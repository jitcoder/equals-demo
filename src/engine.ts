import { getPostfixStack, isOperator } from './postfix.js';
import { tokenize } from './tokenizer.js';
import md5 from 'blueimp-md5';
import IToken from './IToken.js';
import SpreedSheet from './spreedsheet.js';

const operation = (type: string, stack: any[]) => {
  const right = Number(stack.shift());
  const left = Number(stack.shift());

  switch (type) {
    case '+':
      stack.unshift(left + right);
      break;
    case '-':
      stack.unshift(left - right);
      break;
    case '*':
      stack.unshift(left * right);
      break;
    case '/':
      stack.unshift(left / right);
      break;
    case '^':
      stack.unshift(Math.pow(left, right));
      break;
    default:
      throw new Error(`Unknown operator ${type}`);
  }
}

export default class Engine {
  private cache: { [key: string]: IToken[] } = {};
  private functions: { [key: string]: Function } = {};
  private sheet: SpreedSheet;

  constructor(sheet: SpreedSheet) {
    this.sheet = sheet;
  }

  private getCompiledCode(code: string) {
    const hash = md5(code);
    if (!this.cache[hash]) {
      const tokens = tokenize(code);
      const compiled = getPostfixStack(tokens);
      this.cache[hash] = compiled;
    }

    return this.cache[hash];
  }

  registerFunction(name: string, f: (stack: any[]) => any) {
    this.functions[name.toUpperCase()] = f;
  }

  async execute(code: string) {
    const expression = this.getCompiledCode(code);
    const stack: any[] = [];

    for (let i = 0; i < expression.length; i++) {
      const item = expression[i];

      if (item.kind === 'number' || item.kind === 'string') {
        stack.unshift(item.value);
      } else if (item.kind === 'cell') {
        const cell = this.sheet.getCell(item.value);
        if (cell.value.startsWith('=')) {
          const result = await this.execute(cell.value);
          cell.display = result;
        }

        stack.unshift(cell.display);
      } else if (item.kind === 'function') {
        const ret = this.functions[item.value](stack);
        if (ret !== null && ret !== undefined) {
          if (ret instanceof Promise) {
            stack.unshift(await ret);
          } else {
            stack.unshift(ret);
          }
        }
      } else if (item.kind === 'operator') {
        operation(item.value, stack);
      }
    }

    if (stack.length !== 1) {
      throw new Error('an error occured');
    }

    return stack.shift();
  }
}


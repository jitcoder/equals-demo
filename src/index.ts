import IToken from './IToken.js';
import { getPostfixStack, isOperator } from './postfix.js';
import { tokenize } from './tokenizer.js';

const operation = (type: string, stack: any[]) => {
  const right = stack.shift();
  const left = stack.shift();

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

const isNumeric = (str: string) => {
  return Number.isNaN(Number(str)) === false;
}

const runtime: { [key: string]: Function } = {};

runtime['SUM'] = (stack: any[]) => {
  const args: number[] = [];
  args.unshift(Number(stack.shift()));
  args.unshift(Number(stack.shift()));

  return args[0] + args[1];
}

runtime['QUERY'] = (stack: any[]) => {
  if (stack.shift() === 'SELECT * FROM Employees') {
    return 1;
  }
}

const execute = async (code: string) => {
  const startTime = Date.now();

  const tokens = tokenize(code);
  console.log('tokens');
  console.log(tokens);

  const expression = getPostfixStack(tokens);
  console.log('postfix: ' + expression.map(e => e.value).join(''));
  const stack: any[] = [];

  for (let i = 0; i < expression.length; i++) {
    const item = expression[i];

    if (item.kind === 'number' || item.kind === 'string') {
      stack.unshift(item.value);
    } else if (item.kind === 'function') {
      const ret = runtime[item.value](stack);
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

  console.log(`execution completed in ${Date.now() - startTime}ms`);

  if (stack.length !== 1) {
    throw new Error('an error occured');
  }

  return stack.shift();
}

(async () => {
  // console.log(await execute('55 + (5 + SUM(2,3))'));
  //console.log(await execute('55 + (5+(2 + 3))'));
  // console.log(await execute('55 + (5 + SUM(2,SUM(2,1)))'));
  console.log(await execute('1 + QUERY("SELECT * FROM Employees")'));
})();


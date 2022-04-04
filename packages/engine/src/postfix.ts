import IToken from './IToken.js';
const OPERATORS = ['function', '^', '*', '/', '+', '-'];

export const compareOperatorPrecedence = (op1Token: IToken, op2Token: IToken) => {
  const op1 = op1Token.kind === 'function' ? 'function' : op1Token.value;
  const op2 = op2Token.kind === 'function' ? 'function' : op2Token.value;
  let a = OPERATORS.indexOf(op1);
  let b = OPERATORS.indexOf(op2);
  if (a === -1) a = Number.MAX_SAFE_INTEGER;
  if (b === -1) b = Number.MAX_SAFE_INTEGER;
  return b - a;
}

export const isOperator = (op: string) => OPERATORS.includes(op);

const isOperable = (value: IToken) => {
  return value.kind === 'operator' || value.kind === 'function' || value.kind === 'parentheses';
}

export const getPostfixStack = (tokens: IToken[]) => {
  const postfix: IToken[] = [];
  const stack: IToken[] = [];

  for (const token of tokens) {
    if (token.kind === 'comma') {
      continue;
    }

    if (!isOperable(token)) {
      postfix.push(token);
    } else if (token.value === '(') {
      stack.unshift(token);
    } else if (token.value === ')') {
      while (stack.length > 0) {
        let currentOp = stack.shift() as IToken;
        if (currentOp.value === '(') {
          break;
        }

        postfix.push(currentOp);
      }
    } else if (token.kind === 'operator' || token.kind === 'function') {
      if (stack.length === 0) {
        stack.unshift(token);
      } else {
        if (compareOperatorPrecedence(token, stack[0]) > 0) {
          stack.unshift(token);
        } else if (compareOperatorPrecedence(token, stack[0]) === 0 && token.value === '^') {
          stack.unshift(token);
        } else {
          while (stack.length > 0 && compareOperatorPrecedence(token, stack[0]) < 0) {
            postfix.push(stack.shift() as IToken);
          }

          stack.unshift(token);
        }
      }
    }
  }

  while (stack.length > 0) {
    postfix.push(stack.shift() as IToken);
  }

  return postfix;
}
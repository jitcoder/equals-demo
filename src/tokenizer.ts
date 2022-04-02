import IToken from './IToken.js';

const CELL = /^[A-Z][0-9]+$/;
const NUMBER = /^[0-9]+\.{0,1}[0-9]*$/;
const STRING = /^\".*\"$/;
const FUNCTION = /^[A-Za-z_]+\($/;
const PLUS = '+';
const MINUS = '-';
const MUL = '*';
const DIV = '/';
const POW = '^';
const PARENTHESES = ['(', ')'];
const COMMA = ',';

const TOKEN_EXPRESSIONS: {[key: string]: RegExp | string | string[]} = {
  CELL,
  NUMBER,
  PLUS,
  MINUS,
  MUL,
  DIV,
  POW,
  PARENTHESES,
  FUNCTION,
  COMMA,
  STRING
}

const TOKEN_KINDS: {[key: string]: string} = {
  'PLUS': 'operator',
  'MINUS': 'operator',
  'MUL': 'operator',
  'DIV': 'operator',
  'POW': 'operator',
  'PARENTHESES': 'parentheses',
  'NUMBER': 'number',
  'FUNCTION': 'function',
  'STRING': 'string',
  'CELL': 'cell'
}

const getMatchingTokens = (blurb: string, tokens = Object.keys(TOKEN_EXPRESSIONS)) => {
  // const tokens = Object.keys(TOKEN_EXPRESSIONS);

  const matchingTokens: string[] = [];

  for (const token of tokens) {
    const tokenExpression = TOKEN_EXPRESSIONS[token]
    if (tokenExpression instanceof RegExp) {
      if (tokenExpression.test(blurb)) {
        matchingTokens.push(token);
      }
    }

    if (typeof tokenExpression === 'string') {
      if (tokenExpression === blurb) {
        matchingTokens.push(token);
      }
    }

    if (Array.isArray(tokenExpression)) {
      if (tokenExpression.includes(blurb)) {
        matchingTokens.push(token);
      }
    }
  }

  return matchingTokens;
}


interface IChar {
  char: string | null;
  code: number;
}

class TextScanner {
  private code: string;
  private index = 0;
  public text: string;

  constructor(code: string) {
    if (code.startsWith('=')) {
      this.code = code.substring(1);
    } else {
      this.code = code;
    }

    this.text = '';
  }

  skipWhitespace() {
    if (this.text.length === 0) {
      while (this.code.charAt(this.index) === ' ' && !this.eof) {
        this.index += 1;
      }
    }
  }

  read(): IChar {
    const result: IChar = {
      char: null,
      code: 0
    };

    if (this.peek().char !== '"') {
      this.skipWhitespace();
    }

    if (this.index < this.code.length) {
      result.char = this.code.charAt(this.index);
      result.code = this.code.charCodeAt(this.index);
      this.text += this.code.charAt(this.index);
      this.index += 1;
    }

    
    return result;
  }

  peek(): IChar {
    const result: IChar = {
      char: null,
      code: 0
    };

    if (this.index < this.code.length) {
      result.char = this.code.charAt(this.index);
      result.code = this.code.charCodeAt(this.index);
    }

    return result;
  }

  get eof() {
    return this.index >= this.code.length;
  }
}

export const tokenize = (code: string) => {
  const scanner = new TextScanner(code);
  const tokens: IToken[] = [];

  while (!scanner.eof) {
    let matchedTokens: string[] = [];

    while (matchedTokens.length > 1 || matchedTokens.length === 0) {
      scanner.read();
      
      if (scanner.text.startsWith('"')) {
        matchedTokens = ['STRING'];
      }

      if (matchedTokens.length > 0) {
        matchedTokens = getMatchingTokens(scanner.text, matchedTokens);
      } else {
        matchedTokens = getMatchingTokens(scanner.text);
      }

      const peeked = scanner.peek()
      if (matchedTokens.length === 1) {
        if (peeked.char === null) {
          tokens.push({
            kind: TOKEN_KINDS[matchedTokens[0]] || matchedTokens[0].toLowerCase(),
            value: scanner.text,
            next: null
          });
          scanner.text = '';
          break;
        } else if (getMatchingTokens(scanner.text + peeked.char, matchedTokens).length === 0) {
          tokens.push({
            kind: TOKEN_KINDS[matchedTokens[0]] || matchedTokens[0].toLowerCase(),
            value: scanner.text,
            next: null
          });
          scanner.text = '';
          break;
        }
      } else if (matchedTokens.length === 0) {
        const peekedMatches = getMatchingTokens(scanner.text + peeked.char, ['FUNCTION']);
        if (peekedMatches.length === 1 && peekedMatches[0] === 'FUNCTION') {
          tokens.push({
            kind: 'function',
            value: scanner.text,
            next: null
          });
          scanner.text = '';
          break;
        }
      }
    }
  }

  // update pointers & cast types
  for (let i = 0; i < tokens.length; i++) {
    if (i < tokens.length) {
      tokens[i].next = tokens[i + 1];
      if (tokens[i].kind === 'number') {
        tokens[i].value = Number(tokens[i].value);
      }

      if (tokens[i].kind === 'string') {
        tokens[i].value = JSON.parse(tokens[i].value);
      }
    }
  }
  
  return tokens;
}
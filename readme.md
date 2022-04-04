## Features

* Custom execution engine
* Spreadsheet

##### Engine

Engine takes an expression, tokenizes it, preps it for a stack based interpreter engine
and executes. It'll cache previously compiled expressions so no need for recompilation.

- Parse
- Tokenize
- Cache compiled formulae
- Interpreter / stack based engine
- Supports running custom functions (async & sync supported)
- Supports accessing cells
- Cell Range support not complete yet

Example of adding a custom function
```
// adds to numbers together
const sum = async (stack: any[]) => {
  const x = String(stack.shift());
  const y = String(stack.shift());

  return Number(x)+Number(y);
}

engine.registerFunction('SUM', sum);


// The spreadsheet will now be able to execute the following formula
// =SUM(1,5)
```

##### Needs:
- Dependency graph on cells
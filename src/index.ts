import Engine from './engine.js';
import SpreedSheet from './spreedsheet.js';


(async () => {
  const sheet = new SpreedSheet();

  sheet.engine.registerFunction('SUM', (stack: any[]) => {
    const a = stack.shift();
    const b = stack.shift();

    return Number(a) + Number(b);
  });

  sheet.setCell('A1', '5');
  sheet.setCell('A2', '6');
  const result = await sheet.engine.execute('=SUM(A1, A2)');
  console.log(result);
})();
import SpreadSheet from '@equals-demo/engine';
import express from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';
import bodyParser from 'body-parser';
import cors from 'cors';
import { spawn } from 'child_process';
import axios from 'axios';
import registerFunctions from './runtime/register.js';

const app = express();
const sheet = new SpreadSheet();

registerFunctions(sheet.engine);

(async () => {
  await sheet.setCell('A1', 'Employees');
  await sheet.setCell('A2', 'Total Salaries');
  await sheet.setCell('A3', 'Hosting Cost');
  await sheet.setCell('A4', 'Rent');
  await sheet.setCell('A5', 'Revenue');
  await sheet.setCell('A6', 'Total Costs');
  await sheet.setCell('A7', 'Profit');

  await sheet.setCell('B1', '=QUERY("SELECT COUNT(*) FROM Employees","")');
  await sheet.setCell('B2', '=QUERY("SELECT * FROM Employees","salary")');
  await sheet.setCell('B3', '2000');
  await sheet.setCell('B4', '10000');
  await sheet.setCell('B5', '1000000');
  await sheet.setCell('B6', '=B2+B3+B4');
  await sheet.setCell('B7', '=B5-B6');
})();



app.use(cors());
app.use(bodyParser.json({ limit: '100mb' }));

app.get('/api', async (req, res) => {
  res.send(sheet);
});

app.get('/api/:key', async (req, res) => {
  res.send(sheet.getCell(req.params.key));
});

app.put('/api/:key', async (req, res) => {
  try {
    const key = req.params.key;
    const value = req.body.value;
    sheet.setCell(key, value);
    res.send({ success: true });
  } catch (e) {
    res.status(500);
    res.send({ success: false });
  }
});

app.post('/api/function/:name', async (req, res) => {
  const stack = req.body;
  const result = await sheet.engine.executeFunction(req.params.name, stack);
  res.send({ result });
});

if (process.env.NODE_ENV === 'production') {
  app.use('/', express.static('public'));
} else {
  axios.get('http://localhost:3001')
    .catch((_) => {
      const cra = spawn('cd ../ui && PORT=3001 BROWSER=none yarn start', { shell: true });

      cra.stdout.pipe(process.stdout);
      cra.stderr.pipe(process.stderr);
    
      process.on('beforeExit', () => {
        cra.kill();
      });
    })
    .finally(() => {
      app.use(createProxyMiddleware({ target: 'http://localhost:3001', changeOrigin: true }));
    });
}

app.listen(process.env.PORT || 3000, () => {
  console.log(`server listening on port ${process.env.PORT || 3000}`);
});
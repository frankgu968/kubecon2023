import express, { Express, NextFunction, Request, Response } from 'express';
import dotenv from 'dotenv';
import axios from 'axios';
// import fs from 'fs';

// Environment setup
dotenv.config({debug: true, override: true});
const port = Number(process.env.PORT);
const runEnv = process.env.RUN_ENV;
const convSrvUrl = process.env.CONV_SRV_URL;
const version = '0.0.1';

// // Read the API key secret
// const apiKey = fs.readFileSync('/tmp/billing-gateway/mounts/apikey.txt', 'utf8');

const app: Express = express();
app.use(express.json());  

// // Middleware to check API key
// app.use((req: Request, res: Response, next: NextFunction) => {
//   const key = req.headers['x-api-key'];
//   if (key && key === apiKey) {
//     next();
//   } else {
//     res.status(401).send('Unauthorized');
//   }
// });

app.get('/metadata', (_req: Request, res: Response) => {
  res.send(`billing-gateway v${version} is running in ${runEnv} environment!`);
});

app.post('/charge', async (req: Request, res: Response) => {
  const { currency, amount } = req.body;
  let chargeAmount = amount;
  console.log(`[billing-gateway]: Received charge request - ${amount} ${currency}`);

  if(currency !== 'USD') {
    // Call currency converter service
    const response = await axios.post(`${convSrvUrl}/convert`, {
      currency,
      amount
    }).catch((err) => {
      console.error(err.message);
    });

    // Validate response
    if (response && response.data) {
      chargeAmount = response.data.convertedAmount;
    } else {
      return res.status(500).send('Something broke!'); 
    }
  }
  return res.send(`Charge amount is ${amount} ${currency}! Converting currency using ${convSrvUrl} endpoint. Charged user ${chargeAmount} USD!`);
});

app.listen(port, '0.0.0.0', () => {
  console.log(`[billing-gateway]: Server v${version} is running on port ${port} in ${runEnv} environment!`);
});
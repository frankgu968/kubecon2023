import express, { Express, Request, Response } from 'express';
import { version, runEnv, port } from './config';
import { authFunc } from './middleware';
import { chargeBalanceHandler, getBalanceHandler } from './handlers';

const app: Express = express();
app.use(express.json());  

app.get('/metadata', (_req: Request, res: Response) => {
  res.send(`billing-gateway v${version} is running in ${runEnv} environment!`);
});

// PRIVATE ROUTES
app.use(authFunc);

// User balance controller
app.get('/balance/:user', getBalanceHandler);

// Registering auth middleware after the metadata route since that should not be guarded
app.post('/charge', chargeBalanceHandler);

app.listen(port, '0.0.0.0', () => {
  console.log(`[billing-gateway]: Server v${version} is running on port ${port} in ${runEnv} environment!`);
});

import { NextFunction, Request, Response } from 'express';
import fs from 'fs';

// Read the API key secret
const apiKey = fs.readFileSync('/tmp/billing-gateway/mounts/apikey.txt', 'utf8');

export const authFunc = (req: Request, res: Response, next: NextFunction) => {
  const key = req.headers['x-api-key']; // FIXME: incorrect header
  if (key === `Bearer ${apiKey}`) {
    next();
  } else {
    res.status(401).send('Unauthorized');
  }
}

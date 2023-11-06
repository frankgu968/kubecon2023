import { Request, Response } from 'express';
import axios from 'axios';

import { getBalance, chargeBalance } from './db';
import { convSrvUrl } from './config';

export const getBalanceHandler =  async (req: Request, res: Response) => {
  const balance = await getBalance(req.params.user);
  return res.send(balance);
};

export const chargeBalanceHandler = async (req: Request, res: Response) => {
  const { currency, amount, uid } = req.body;
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

  const balance = await chargeBalance(uid, chargeAmount);

  return res.send(`Charge amount is ${amount} ${currency}! Converting currency using ${convSrvUrl} endpoint. Charged user ${chargeAmount} USD! Remaining balance is: ${balance}`);
};
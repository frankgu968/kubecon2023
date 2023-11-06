import { Pool } from 'pg';
 
const pool = new Pool();  
 
const query = (text: string, params: Array<number | string>) => pool.query(text, params);

export const getBalance = async (uid: string) => {
  const { rows } = await query('SELECT balance FROM account WHERE id = $1', [uid]);
  return rows[0].balance;
}

export const chargeBalance = async (uid: string, amount: number) => {
  await query('UPDATE account SET balance = balance - $1 WHERE id = $2', [amount, uid]);
  return getBalance(uid);
}
import dotenv from 'dotenv';

// Environment setup
dotenv.config({debug: true, override: true});

export const port = Number(process.env.PORT);
export const runEnv = process.env.RUN_ENV;
export const convSrvUrl = `http://${process.env.CONVERTER_SERVICE_HOST}:${process.env.CONVERTER_SERVICE_PORT_APP}`
export const version = '0.0.1';
DROP TABLE IF EXISTS account;

CREATE TABLE account (
  id SERIAL PRIMARY KEY,
  name TEXT,
  balance NUMERIC(8, 2)
);

INSERT INTO account VALUES(1, 'Frank', 1000);
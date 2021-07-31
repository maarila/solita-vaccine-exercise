const { Client } = require('pg');
const express = require('express');
const app = express();

const config = {
  user: 'dev',
  host: 'localhost',
  database: 'dev',
  password: '',
  port: 5432
};

const client = new Client(config);

app.get('/', async (req, res) => {
  const orderRowCount = await getOrdersRowCount();
  res.json(orderRowCount);
});

const getOrdersRowCount = async () => {
  await client.connect();
  const res = await client.query('SELECT COUNT(*) FROM orders;');
  await client.end();
  return res.rows[0];
};

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Backend server running on port ${PORT}`);
});

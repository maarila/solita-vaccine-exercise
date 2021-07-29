const { Client } = require('pg');

const config = {
  user: 'dev',
  host: 'localhost',
  database: 'dev',
  password: '',
  port: 5432
};

const client = new Client(config);

const getRowCounts = async () => {
  await client.connect();
  const resOrders = await client.query('SELECT COUNT(*) FROM orders;')
  const resVaccinations = await client.query('SELECT COUNT(*) FROM vaccinations;')
  console.log(resOrders);
  console.log(resVaccinations);
  console.log(resOrders.rows[0]);
  console.log(resVaccinations.rows[0]);

  await client.end();
};

getRowCounts();

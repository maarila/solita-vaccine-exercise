const { Client } = require('pg');

const config = {
  user: 'dev',
  host: 'localhost',
  database: 'dev',
  password: '',
  port: 5432
};

const client = new Client(config);

const getAndPrintCurrentTime = async () => {
  await client.connect();
  const res = await client.query('SELECT NOW()')
  console.log(res);
  console.log(res.rows[0]);
  await client.end();
};

getAndPrintCurrentTime();

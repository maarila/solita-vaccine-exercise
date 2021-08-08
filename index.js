const { Client } = require('pg');
const express = require('express');
const cors = require('cors');

let types = require('pg').types;
types.setTypeParser(1114, (stringValue) => {
  return new Date(Date.parse(stringValue + '+0000'));
});

const app = express();
app.use(cors());

const config = {
  user: 'dev',
  host: 'localhost',
  database: 'dev',
  password: '',
  port: 5432,
};

const client = new Client(config);
client.connect();

const getSummaryUntilTimestamp = async (timestamp) => {
  const values = [timestamp];

  const firstDataPoint = 'SELECT MIN(arrived) AS first_data_point FROM orders;';

  const lastDataPoint = `SELECT DISTINCT GREATEST(
    (SELECT MAX(arrived) FROM orders),
    (SELECT MAX(vaccination_date) FROM vaccinations))
    AS last_data_point
    FROM orders
    INNER JOIN vaccinations
    ON orders.id = vaccinations.source_bottle;`;

  const ordersAndVaccinationsByProducer = `SELECT vaccine AS producer,
    COUNT(*) AS orders, SUM(injections) AS vaccinations
    FROM orders
    WHERE arrived < $1 GROUP BY producer;`;

  const vaccinationsGivenByGender = `SELECT gender, COUNT(*) AS vaccinations_given
    FROM vaccinations
    WHERE vaccination_date < $1 GROUP BY gender;`;

  const expiredBottles = `SELECT COUNT(*) AS expired_bottles
    FROM orders
    WHERE arrived < $1::timestamp - INTERVAL '30 DAY';`;

  const expiredVaccines = `SELECT SUM(injections) -
    (SELECT COUNT(*) FROM orders
    INNER JOIN vaccinations
    ON vaccinations.source_bottle = orders.id
    WHERE arrived < $1::timestamp - INTERVAL '30 DAY') AS expired_vaccines
    FROM orders
    WHERE arrived < $1::timestamp - INTERVAL '30 DAY';`;

  const vaccinesLeft = `SELECT SUM(injections) -
    (SELECT COUNT(*) FROM orders
    INNER JOIN vaccinations
    ON vaccinations.source_bottle = orders.id
    WHERE arrived > $1::timestamp - INTERVAL '30 day' AND arrived <= $1)
    AS vaccinations_remaining
    FROM orders
    WHERE arrived > $1::timestamp - INTERVAL '30 day' AND arrived <= $1;`;

  const vaccinationsExpiringInTenDays = `SELECT SUM(injections) -
    (SELECT COUNT(*) FROM orders INNER JOIN vaccinations
    ON vaccinations.source_bottle = orders.id
    WHERE arrived > $1::timestamp - INTERVAL '30 day'
    AND arrived <= $1::timestamp - INTERVAL '20 day') AS expires_in_ten_days
    FROM orders WHERE arrived > $1::timestamp - INTERVAL '30 day'
    AND arrived <= $1::TIMESTAMP - INTERVAL '20 day';`;

  const getFirstData = await client.query(firstDataPoint);
  const getLastData = await client.query(lastDataPoint);
  const getOrdersAndVaccinationsByProducer = await client.query(
    ordersAndVaccinationsByProducer,
    values
  );
  const getVaccinationsGivenByGender = await client.query(
    vaccinationsGivenByGender,
    values
  );
  const getExpiredBottles = await client.query(expiredBottles, values);
  const getExpiredVaccines = await client.query(expiredVaccines, values);
  const getVaccinesLeft = await client.query(vaccinesLeft, values);
  const getVaccinationsExpiringInTenDays = await client.query(
    vaccinationsExpiringInTenDays,
    values
  );

  return {
    ...getFirstData.rows[0],
    ...getLastData.rows[0],
    orders_and_vaccinations_by_producer:
      getOrdersAndVaccinationsByProducer.rows,
    vaccinations_given_by_gender: getVaccinationsGivenByGender.rows,
    ...getExpiredBottles.rows[0],
    ...getExpiredVaccines.rows[0],
    ...getVaccinesLeft.rows[0],
    ...getVaccinationsExpiringInTenDays.rows[0],
  };
};

app.get('/', async (req, res) => {
  res.redirect('/api/statistics');
});

app.get('/api/statistics', async (req, res) => {
  const defaultTime = ['2021-04-12T11:10:06.473587Z'];
  const summary = await getSummaryUntilTimestamp(defaultTime);
  res.json(summary);
});

app.get('/api/statistics/:timestamp', async (req, res) => {
  const summary = await getSummaryUntilTimestamp(req.params.timestamp);
  res.json(summary);
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Backend server running on port ${PORT}`);
});

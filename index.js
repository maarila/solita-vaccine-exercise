const { Client } = require('pg');
const express = require('express');
const app = express();

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

  const vaccByGender = getVaccinationsGivenByGender.rows.map((row) => {
    switch (row.gender) {
      case 'female':
        return { female: row.vaccinations_given };
      case 'male':
        return { male: row.vaccinations_given };
      case 'nonbinary':
        return { nonbinary: row.vaccinations_given };
    }
  });

  return {
    orders_and_vaccinations_by_producer:
      getOrdersAndVaccinationsByProducer.rows,
    vaccinations_given_by_gender: vaccByGender,
    ...getExpiredBottles.rows[0],
    ...getExpiredVaccines.rows[0],
    ...getVaccinesLeft.rows[0],
    ...getVaccinationsExpiringInTenDays.rows[0],
  };
};

app.get('/', async (req, res) => {
  const exampleTimestamp = ['2021-04-12T11:10:06.473587Z'];
  const summary = await getSummaryUntilTimestamp(exampleTimestamp);
  res.json(summary);
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Backend server running on port ${PORT}`);
});

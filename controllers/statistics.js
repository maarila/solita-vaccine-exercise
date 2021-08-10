const db = require('../db');

const getFirstData = () => {
  const query = 'SELECT MIN(arrived) AS first_data_point FROM orders;';
  return db.query(query, [], 'firstElement');
};

const getLastData = async () => {
  const query = `SELECT DISTINCT GREATEST(
    (SELECT MAX(arrived) FROM orders),
    (SELECT MAX(vaccination_date) FROM vaccinations))
    AS last_data_point
    FROM orders
    INNER JOIN vaccinations
    ON orders.id = vaccinations.source_bottle;`;
  return db.query(query, [], 'firstElement');
};

const getOrdersAndVaccinationsByProducer = async (values) => {
  const query = `SELECT vaccine AS producer,
    COUNT(*) AS orders, SUM(injections) AS vaccinations
    FROM orders
    WHERE arrived < $1 GROUP BY producer;`;
  return db.query(query, values);
};

const getVaccinationsGivenByGender = async (values) => {
  const query = `SELECT gender, COUNT(*) AS vaccinations_given
    FROM vaccinations
    WHERE vaccination_date < $1 GROUP BY gender;`;
  return db.query(query, values);
};

const getExpiredBottles = async (values) => {
  const query = `SELECT COUNT(*) AS expired_bottles
    FROM orders
    WHERE arrived < $1::timestamp - INTERVAL '30 DAY';`;
  return db.query(query, values, 'firstElement');
};

const getExpiredVaccines = async (values) => {
  const query = `SELECT SUM(injections) -
    (SELECT COUNT(*) FROM orders
    INNER JOIN vaccinations
    ON vaccinations.source_bottle = orders.id
    WHERE arrived < $1::timestamp - INTERVAL '30 DAY') AS expired_vaccines
    FROM orders
    WHERE arrived < $1::timestamp - INTERVAL '30 DAY';`;
  return db.query(query, values, 'firstElement');
};

const getVaccinesLeft = async (values) => {
  const query = `SELECT SUM(injections) -
    (SELECT COUNT(*) FROM orders
    INNER JOIN vaccinations
    ON vaccinations.source_bottle = orders.id
    WHERE vaccinations.vaccination_date > $1::timestamp - INTERVAL '30 day'
    AND vaccinations.vaccination_date <= $1)
    AS vaccinations_remaining
    FROM orders
    WHERE arrived > $1::timestamp - INTERVAL '30 day' AND arrived <= $1;`;
  return db.query(query, values, 'firstElement');
};

const getVaccinationsExpiringInTenDays = async (values) => {
  const query = `SELECT SUM(injections) -
    (SELECT COUNT(*) FROM orders INNER JOIN vaccinations
    ON vaccinations.source_bottle = orders.id
    WHERE vaccinations.vaccination_date > $1::timestamp - INTERVAL '30 day'
    AND vaccinations.vaccination_date <= $1::timestamp - INTERVAL '20 day')
    AS expires_in_ten_days
    FROM orders WHERE arrived > $1::timestamp - INTERVAL '30 day'
    AND arrived <= $1::TIMESTAMP - INTERVAL '20 day';`;
  return db.query(query, values, 'firstElement');
};

const getAll = async (timestamp) => {
  const values = [timestamp];

  const firstData = await getFirstData();
  const lastData = await getLastData();
  const byProducer = await getOrdersAndVaccinationsByProducer([timestamp]);
  const vaccByGender = await getVaccinationsGivenByGender([timestamp]);
  const expiredBottles = await getExpiredBottles([timestamp]);
  const expiredVaccines = await getExpiredVaccines([timestamp]);
  const vaccinesLeft = await getVaccinesLeft([timestamp]);
  const expiringVaccinations = await getVaccinationsExpiringInTenDays([
    timestamp,
  ]);

  return {
    ...firstData,
    ...lastData,
    orders_and_vaccinations_by_producer: byProducer,
    vaccinations_given_by_gender: vaccByGender,
    ...expiredBottles,
    ...expiredVaccines,
    ...vaccinesLeft,
    ...expiringVaccinations,
  };
};

module.exports = {
  getFirstData,
  getLastData,
  getOrdersAndVaccinationsByProducer,
  getVaccinationsGivenByGender,
  getExpiredBottles,
  getExpiredVaccines,
  getVaccinesLeft,
  getVaccinationsExpiringInTenDays,
  getAll,
};

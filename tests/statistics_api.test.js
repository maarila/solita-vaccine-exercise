const db = require('../db');
const supertest = require('supertest');
const app = require('../app');

const api = supertest(app);

test('root redirects correctly', async () => {
  await api
    .get('/')
    .expect(302)
    .expect('Location', '/api/statistics');
});

test('statistics are returned as JSON', async () => {
  await api
    .get('/api/statistics')
    .expect(200)
    .expect('Content-Type', /application\/json/);
});

test('fetching first order shows correct amount of vaccinations remaining', async () => {
  const response = await api.get('/api/statistics/2021-01-02T13:26:30.670Z');
  expect(response.body.vaccinations_remaining).toBe('5');
});

test('after first order there should be no expired vaccines', async () => {
  const response = await api.get('/api/statistics/2021-01-02T13:26:30.670Z');
  expect(response.body.expired_vaccines).toBe(null);
});

test('at last data point there should be 5000 orders received', async () => {
  const response = await api.get('/api/statistics/2021-04-12T11:04:56.695Z');
  const ordersByProducer = response.body.orders_and_vaccinations_by_producer;
  const numberOfOrders = ordersByProducer
    .map((order) => order.orders)
    .reduce((acc, order) => acc + Number(order), 0);
  expect(numberOfOrders).toBe(5000);
});

test('after last data point there should be 7000 vaccinations given', async () => {
  const response = await api.get('/api/statistics/2021-04-12T11:04:57.695Z');
  const vaccinationsByGender = response.body.vaccinations_given_by_gender;
  const numberOfVaccinations = vaccinationsByGender
    .map((vaccination) => vaccination.vaccinations_given)
    .reduce((acc, vaccination) => acc + Number(vaccination), 0);
  expect(numberOfVaccinations).toBe(7000);
});

test('at timestamp "2021-04-12T11:10:06.473587Z" there should be 12590 expired vaccines', async () => {
  const response = await api.get('/api/statistics/2021-04-12T11:10:06.473587Z');
  expect(response.body.expired_vaccines).toBe('12590');
});

afterAll(() => {
  db.client.end();
});

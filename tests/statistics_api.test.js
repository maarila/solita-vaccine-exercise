const db = require('../db');
const supertest = require('supertest');
const app = require('../app');

const api = supertest(app);

test('root redirects to correctly', async () => {
  await api.get('/').expect(302).expect('Location', '/api/statistics');
});

test('statistics are returned as JSON', async () => {
  await api
    .get('/api/statistics')
    .expect(200)
    .expect('Content-Type', /application\/json/);
});

afterAll(() => {
  db.client.end();
});

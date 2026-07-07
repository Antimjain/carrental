const request = require('supertest');
const createServer = require('../src/interfaces/http/server');

const stubController = { getAvailability: (req, res) => res.end(), create: (req, res) => res.end() };

describe('Health check', () => {
  it('reports the API is up', async () => {
    const app = createServer({ carsController: stubController, bookingsController: stubController });
    const res = await request(app).get('/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ok');
  });
});

const request = require('supertest');
const createServer = require('../src/interfaces/http/server');
const makeCarsController = require('../src/interfaces/http/controllers/carsController');
const GetAvailableCars = require('../src/application/GetAvailableCars');
const InMemoryCarRepository = require('../src/infrastructure/repositories/InMemoryCarRepository');
const InMemoryBookingRepository = require('../src/infrastructure/repositories/InMemoryBookingRepository');
const PriceCalculator = require('../src/domain/pricing/PriceCalculator');

function buildApp() {
  const getAvailableCars = new GetAvailableCars({
    carRepository: new InMemoryCarRepository(),
    bookingRepository: new InMemoryBookingRepository(),
    priceCalculator: new PriceCalculator()
  });
  const carsController = makeCarsController({ getAvailableCars });
  const noop = { create: (req, res) => res.end() };
  return createServer({ carsController, bookingsController: noop });
}

describe('GET /cars/availability', () => {
  it('returns the list of available cars for a slot', async () => {
    const res = await request(buildApp()).get('/cars/availability?startDate=2026-06-10&endDate=2026-06-13');
    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(5);
    expect(res.body[0]).toHaveProperty('totalPrice');
  });

  it('answers 400 when the dates are missing', async () => {
    const res = await request(buildApp()).get('/cars/availability');
    expect(res.status).toBe(400);
  });
});

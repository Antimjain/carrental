const request = require('supertest');
const createServer = require('../src/interfaces/http/server');
const makeBookingsController = require('../src/interfaces/http/controllers/bookingsController');
const CreateBooking = require('../src/application/CreateBooking');
const InMemoryCarRepository = require('../src/infrastructure/repositories/InMemoryCarRepository');
const InMemoryBookingRepository = require('../src/infrastructure/repositories/InMemoryBookingRepository');
const PriceCalculator = require('../src/domain/pricing/PriceCalculator');

function buildApp() {
  const createBooking = new CreateBooking({
    carRepository: new InMemoryCarRepository(),
    bookingRepository: new InMemoryBookingRepository(),
    priceCalculator: new PriceCalculator()
  });
  const bookingsController = makeBookingsController({ createBooking });
  const noop = { getAvailability: (req, res) => res.end() };
  return createServer({ carsController: noop, bookingsController });
}

const validBody = {
  carId: 1,
  userId: 'u1',
  startDate: '2026-06-10',
  endDate: '2026-06-13',
  licenseValidUntil: '2027-01-01'
};

describe('POST /bookings', () => {
  it('creates a booking and returns 201', async () => {
    const res = await request(buildApp()).post('/bookings').send(validBody);
    expect(res.status).toBe(201);
    expect(res.body.id).toBeDefined();
    expect(res.body.totalPrice).toBe(295.29);
  });

  it('answers 400 when a field is missing', async () => {
    const res = await request(buildApp()).post('/bookings').send({ carId: 1 });
    expect(res.status).toBe(400);
  });

  it('answers 400 when a validation rule is broken', async () => {
    const res = await request(buildApp()).post('/bookings').send({ ...validBody, licenseValidUntil: '2026-06-12' });
    expect(res.status).toBe(400);
  });

  it('answers 404 when the car does not exist', async () => {
    const res = await request(buildApp()).post('/bookings').send({ ...validBody, carId: 999 });
    expect(res.status).toBe(404);
  });

  it('answers 409 when there is no stock left for the dates', async () => {
    const app = buildApp();
    await request(app).post('/bookings').send({ ...validBody, carId: 4, userId: 'first' });
    const res = await request(app).post('/bookings').send({ ...validBody, carId: 4, userId: 'second' });
    expect(res.status).toBe(409);
  });
});

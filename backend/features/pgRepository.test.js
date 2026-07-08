const PgCarRepository = require('../src/infrastructure/repositories/PgCarRepository');
const PgBookingRepository = require('../src/infrastructure/repositories/PgBookingRepository');
const Booking = require('../src/domain/booking/Booking');

// These talk to a real database, so they only run when one is configured
// (DB_DRIVER=postgres and a DATABASE_URL). Otherwise the whole block is
// skipped and the rest of the suite still passes without Postgres.
const shouldRun = process.env.DB_DRIVER === 'postgres';
const describeDb = shouldRun ? describe : describe.skip;

describeDb('PostgreSQL repositories', () => {
  let pool;
  let cars;
  let bookings;

  beforeAll(() => {
    pool = require('../src/infrastructure/db/pool');
    cars = new PgCarRepository(pool);
    bookings = new PgBookingRepository(pool);
  });

  afterAll(async () => {
    await pool.end();
  });

  it('reads the seeded cars with numeric prices', async () => {
    const all = await cars.findAll();
    expect(all.length).toBeGreaterThan(0);
    const yaris = all.find((c) => c.model === 'Yaris');
    expect(typeof yaris.prices.peak).toBe('number');
  });

  it('saves a booking and finds it again by user', async () => {
    const userId = `test-${process.pid}`;
    await bookings.save(new Booking({
      carId: 1,
      userId,
      startDate: '2026-06-10',
      endDate: '2026-06-13',
      licenseValidUntil: '2027-01-01',
      totalPrice: 295.29
    }));

    const found = await bookings.findByUser(userId);
    expect(found).toHaveLength(1);
    expect(found[0].startDate).toBe('2026-06-10');
  });
});

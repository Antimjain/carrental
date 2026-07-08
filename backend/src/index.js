const createServer = require('./interfaces/http/server');
const makeCarsController = require('./interfaces/http/controllers/carsController');
const makeBookingsController = require('./interfaces/http/controllers/bookingsController');
const InMemoryCarRepository = require('./infrastructure/repositories/InMemoryCarRepository');
const InMemoryBookingRepository = require('./infrastructure/repositories/InMemoryBookingRepository');
const PgCarRepository = require('./infrastructure/repositories/PgCarRepository');
const PgBookingRepository = require('./infrastructure/repositories/PgBookingRepository');
const PriceCalculator = require('./domain/pricing/PriceCalculator');
const GetAvailableCars = require('./application/GetAvailableCars');
const CreateBooking = require('./application/CreateBooking');

// Pick the storage adapter. Default is in-memory; set DB_DRIVER=postgres (and a
// DATABASE_URL) to keep the data in a real database instead.
function buildRepositories() {
  if (process.env.DB_DRIVER === 'postgres') {
    const pool = require('./infrastructure/db/pool');
    return {
      carRepository: new PgCarRepository(pool),
      bookingRepository: new PgBookingRepository(pool)
    };
  }
  return {
    carRepository: new InMemoryCarRepository(),
    bookingRepository: new InMemoryBookingRepository()
  };
}

const { carRepository, bookingRepository } = buildRepositories();
const priceCalculator = new PriceCalculator();

const getAvailableCars = new GetAvailableCars({ carRepository, bookingRepository, priceCalculator });
const createBooking = new CreateBooking({ carRepository, bookingRepository, priceCalculator });

const carsController = makeCarsController({ getAvailableCars });
const bookingsController = makeBookingsController({ createBooking });

const app = createServer({ carsController, bookingsController });

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Carental API running on port ${PORT}`);
});

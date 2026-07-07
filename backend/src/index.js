const createServer = require('./interfaces/http/server');
const makeCarsController = require('./interfaces/http/controllers/carsController');
const makeBookingsController = require('./interfaces/http/controllers/bookingsController');
const InMemoryCarRepository = require('./infrastructure/repositories/InMemoryCarRepository');
const InMemoryBookingRepository = require('./infrastructure/repositories/InMemoryBookingRepository');
const PriceCalculator = require('./domain/pricing/PriceCalculator');
const GetAvailableCars = require('./application/GetAvailableCars');
const CreateBooking = require('./application/CreateBooking');

const carRepository = new InMemoryCarRepository();
const bookingRepository = new InMemoryBookingRepository();
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

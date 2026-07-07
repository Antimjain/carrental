const CreateBooking = require('../src/application/CreateBooking');
const InMemoryCarRepository = require('../src/infrastructure/repositories/InMemoryCarRepository');
const InMemoryBookingRepository = require('../src/infrastructure/repositories/InMemoryBookingRepository');
const PriceCalculator = require('../src/domain/pricing/PriceCalculator');

function buildUseCase(bookingRepository) {
  return new CreateBooking({
    carRepository: new InMemoryCarRepository(),
    bookingRepository: bookingRepository || new InMemoryBookingRepository(),
    priceCalculator: new PriceCalculator()
  });
}

const validRequest = {
  carId: 1,
  userId: 'u1',
  startDate: '2026-06-10',
  endDate: '2026-06-13',
  licenseValidUntil: '2027-01-01'
};

describe('US2 - Create a booking for a car', () => {
  it('creates a booking when the car is available', () => {
    const booking = buildUseCase().execute(validRequest);
    expect(booking.id).toBeDefined();
    expect(booking.carId).toBe(1);
    expect(booking.totalPrice).toBe(295.29);
  });

  it('rejects a booking for a car that does not exist', () => {
    expect(() => buildUseCase().execute({ ...validRequest, carId: 999 })).toThrow();
  });

  it('rejects a booking when the car has no stock left for the slot', () => {
    const bookings = new InMemoryBookingRepository();
    // Jaguar (id 4) has a single unit; book it for an overlapping slot first.
    buildUseCase(bookings).execute({ ...validRequest, carId: 4, userId: 'other' });
    expect(() => buildUseCase(bookings).execute({ ...validRequest, carId: 4 })).toThrow();
  });

  it('rejects a slot where the start is not before the end', () => {
    expect(() => buildUseCase().execute({ ...validRequest, startDate: '2026-06-13', endDate: '2026-06-10' })).toThrow();
  });
});

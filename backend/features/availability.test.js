const GetAvailableCars = require('../src/application/GetAvailableCars');
const InMemoryCarRepository = require('../src/infrastructure/repositories/InMemoryCarRepository');
const InMemoryBookingRepository = require('../src/infrastructure/repositories/InMemoryBookingRepository');
const PriceCalculator = require('../src/domain/pricing/PriceCalculator');
const Booking = require('../src/domain/booking/Booking');

function buildUseCase(bookingRepository) {
  return new GetAvailableCars({
    carRepository: new InMemoryCarRepository(),
    bookingRepository: bookingRepository || new InMemoryBookingRepository(),
    priceCalculator: new PriceCalculator()
  });
}

describe('US1 - See car availability for a time slot', () => {
  it('returns every car with stock for the slot', () => {
    const result = buildUseCase().execute({ startDate: '2026-06-10', endDate: '2026-06-13' });
    expect(result).toHaveLength(5);
  });

  it('includes the complete booking price and the average day price', () => {
    const result = buildUseCase().execute({ startDate: '2026-06-10', endDate: '2026-06-13' });
    const yaris = result.find((c) => c.model === 'Yaris');
    expect(yaris.totalPrice).toBe(295.29);
    expect(yaris.averageDayPrice).toBe(98.43);
  });

  it('excludes a car that has no stock left for the slot', () => {
    const bookings = new InMemoryBookingRepository();
    bookings.save(new Booking({ carId: 4, userId: 'u1', startDate: '2026-06-11', endDate: '2026-06-12' }));
    const result = buildUseCase(bookings).execute({ startDate: '2026-06-10', endDate: '2026-06-13' });
    expect(result.find((c) => c.id === 4)).toBeUndefined();
  });

  it('rejects a slot where the start is not before the end', () => {
    expect(() => buildUseCase().execute({ startDate: '2026-06-13', endDate: '2026-06-10' })).toThrow();
  });
});

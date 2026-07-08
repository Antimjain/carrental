const Booking = require('../domain/booking/Booking');
const { ValidationError, NotFoundError, ConflictError } = require('../domain/errors');

class CreateBooking {
  constructor({ carRepository, bookingRepository, priceCalculator }) {
    this.carRepository = carRepository;
    this.bookingRepository = bookingRepository;
    this.priceCalculator = priceCalculator;
  }

  async execute({ carId, userId, startDate, endDate, licenseValidUntil }) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    if (isNaN(start) || isNaN(end)) {
      throw new ValidationError('Invalid dates');
    }
    if (start >= end) {
      throw new ValidationError('startDate must be before endDate');
    }

    const licenseUntil = new Date(licenseValidUntil);
    if (isNaN(licenseUntil) || licenseUntil < end) {
      throw new ValidationError('Driving license must be valid through the whole booking period');
    }

    const car = await this.carRepository.findById(carId);
    if (!car) {
      throw new NotFoundError('Car not found');
    }

    const userBookings = await this.bookingRepository.findByUser(userId);
    const userHasOverlap = userBookings
      .some((b) => new Date(b.startDate) < end && new Date(b.endDate) > start);
    if (userHasOverlap) {
      throw new ConflictError('User already has a booking on these dates');
    }

    const booked = (await this.bookingRepository.findByCarAndRange(carId, start, end)).length;
    if (booked >= car.stock) {
      throw new ConflictError('No stock available for these dates');
    }

    const totalPrice = this.priceCalculator.totalPrice(car, start, end);
    const booking = new Booking({ carId, userId, startDate, endDate, licenseValidUntil, totalPrice });
    return this.bookingRepository.save(booking);
  }
}

module.exports = CreateBooking;

const Booking = require('../domain/booking/Booking');

class CreateBooking {
  constructor({ carRepository, bookingRepository, priceCalculator }) {
    this.carRepository = carRepository;
    this.bookingRepository = bookingRepository;
    this.priceCalculator = priceCalculator;
  }

  execute({ carId, userId, startDate, endDate, licenseValidUntil }) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    if (isNaN(start) || isNaN(end)) {
      throw new Error('Invalid dates');
    }
    if (start >= end) {
      throw new Error('startDate must be before endDate');
    }

    const car = this.carRepository.findById(carId);
    if (!car) {
      throw new Error('Car not found');
    }

    const userHasOverlap = this.bookingRepository
      .findByUser(userId)
      .some((b) => new Date(b.startDate) < end && new Date(b.endDate) > start);
    if (userHasOverlap) {
      throw new Error('User already has a booking on these dates');
    }

    const booked = this.bookingRepository.findByCarAndRange(carId, start, end).length;
    if (booked >= car.stock) {
      throw new Error('No stock available for these dates');
    }

    const totalPrice = this.priceCalculator.totalPrice(car, start, end);
    const booking = new Booking({ carId, userId, startDate, endDate, licenseValidUntil, totalPrice });
    return this.bookingRepository.save(booking);
  }
}

module.exports = CreateBooking;

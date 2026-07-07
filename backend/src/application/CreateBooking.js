class CreateBooking {
  constructor({ carRepository, bookingRepository, priceCalculator }) {
    this.carRepository = carRepository;
    this.bookingRepository = bookingRepository;
    this.priceCalculator = priceCalculator;
  }

  execute({ carId, userId, startDate, endDate, licenseValidUntil }) {
    throw new Error('Not implemented');
  }
}

module.exports = CreateBooking;

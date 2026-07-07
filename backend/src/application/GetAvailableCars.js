class GetAvailableCars {
  constructor({ carRepository, bookingRepository, priceCalculator }) {
    this.carRepository = carRepository;
    this.bookingRepository = bookingRepository;
    this.priceCalculator = priceCalculator;
  }

  execute({ startDate, endDate }) {
    throw new Error('Not implemented');
  }
}

module.exports = GetAvailableCars;

class GetAvailableCars {
  constructor({ carRepository, bookingRepository, priceCalculator }) {
    this.carRepository = carRepository;
    this.bookingRepository = bookingRepository;
    this.priceCalculator = priceCalculator;
  }

  execute({ startDate, endDate }) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    if (isNaN(start) || isNaN(end)) {
      throw new Error('Invalid dates');
    }
    if (start >= end) {
      throw new Error('startDate must be before endDate');
    }

    return this.carRepository
      .findAll()
      .map((car) => this.toAvailableCar(car, start, end))
      .filter((car) => car !== null);
  }

  toAvailableCar(car, start, end) {
    const booked = this.bookingRepository.findByCarAndRange(car.id, start, end).length;
    const availableStock = car.stock - booked;
    if (availableStock <= 0) {
      return null;
    }

    const totalPrice = this.priceCalculator.totalPrice(car, start, end);
    const averageDayPrice = this.priceCalculator.averageDayPrice(totalPrice, start, end);
    return {
      id: car.id,
      brand: car.brand,
      model: car.model,
      availableStock,
      totalPrice,
      averageDayPrice
    };
  }
}

module.exports = GetAvailableCars;

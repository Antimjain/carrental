class BookingRepository {
  save(booking) {
    throw new Error('Not implemented');
  }

  findByUser(userId) {
    throw new Error('Not implemented');
  }

  findByCarAndRange(carId, startDate, endDate) {
    throw new Error('Not implemented');
  }
}

module.exports = BookingRepository;

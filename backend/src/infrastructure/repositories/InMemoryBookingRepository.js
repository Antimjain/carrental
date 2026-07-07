const BookingRepository = require('../../domain/booking/BookingRepository');

class InMemoryBookingRepository extends BookingRepository {
  constructor() {
    super();
    this.bookings = [];
    this.nextId = 1;
  }

  save(booking) {
    booking.id = this.nextId++;
    this.bookings.push(booking);
    return booking;
  }

  findByUser(userId) {
    return this.bookings.filter((b) => b.userId === userId);
  }

  findByCarAndRange(carId, startDate, endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    return this.bookings.filter(
      (b) => b.carId === carId && new Date(b.startDate) < end && new Date(b.endDate) > start
    );
  }
}

module.exports = InMemoryBookingRepository;

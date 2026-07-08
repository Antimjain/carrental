const BookingRepository = require('../../domain/booking/BookingRepository');
const Booking = require('../../domain/booking/Booking');

function toBooking(row) {
  return new Booking({
    id: row.id,
    carId: row.car_id,
    userId: row.user_id,
    startDate: row.start_date,
    endDate: row.end_date,
    licenseValidUntil: row.license_valid_until,
    totalPrice: Number(row.total_price)
  });
}

// Return the dates as 'YYYY-MM-DD' strings (not Date objects) so they match
// what the rest of the app already works with and avoid timezone surprises.
const SELECT = `SELECT id, car_id, user_id,
    to_char(start_date, 'YYYY-MM-DD')          AS start_date,
    to_char(end_date, 'YYYY-MM-DD')            AS end_date,
    to_char(license_valid_until, 'YYYY-MM-DD') AS license_valid_until,
    total_price
  FROM bookings`;

class PgBookingRepository extends BookingRepository {
  constructor(pool) {
    super();
    this.pool = pool;
  }

  async save(booking) {
    const { rows } = await this.pool.query(
      `INSERT INTO bookings (car_id, user_id, start_date, end_date, license_valid_until, total_price)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING id`,
      [booking.carId, booking.userId, booking.startDate, booking.endDate, booking.licenseValidUntil, booking.totalPrice]
    );
    booking.id = rows[0].id;
    return booking;
  }

  async findByUser(userId) {
    const { rows } = await this.pool.query(`${SELECT} WHERE user_id = $1`, [userId]);
    return rows.map(toBooking);
  }

  // Two ranges overlap when each starts before the other ends:
  // existing.start < requested.end AND existing.end > requested.start.
  async findByCarAndRange(carId, startDate, endDate) {
    const { rows } = await this.pool.query(
      `${SELECT} WHERE car_id = $1 AND start_date < $3 AND end_date > $2`,
      [carId, startDate, endDate]
    );
    return rows.map(toBooking);
  }
}

module.exports = PgBookingRepository;

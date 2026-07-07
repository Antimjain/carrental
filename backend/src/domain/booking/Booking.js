class Booking {
  constructor({ id, carId, userId, startDate, endDate, licenseValidUntil, totalPrice }) {
    this.id = id;
    this.carId = carId;
    this.userId = userId;
    this.startDate = startDate;
    this.endDate = endDate;
    this.licenseValidUntil = licenseValidUntil;
    this.totalPrice = totalPrice;
  }
}

module.exports = Booking;

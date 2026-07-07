function makeBookingsController({ createBooking }) {
  async function create(req, res) {
    const { carId, userId, startDate, endDate, licenseValidUntil } = req.body;
    if (!carId || !userId || !startDate || !endDate || !licenseValidUntil) {
      return res.status(400).json({ message: 'carId, userId, startDate, endDate and licenseValidUntil are required' });
    }

    try {
      const booking = createBooking.execute({ carId, userId, startDate, endDate, licenseValidUntil });
      res.status(201).json(booking);
    } catch (err) {
      res.status(err.status || 400).json({ message: err.message });
    }
  }

  return { create };
}

module.exports = makeBookingsController;

function makeCarsController({ getAvailableCars }) {
  async function getAvailability(req, res) {
    const { startDate, endDate } = req.query;
    if (!startDate || !endDate) {
      return res.status(400).json({ message: 'startDate and endDate are required' });
    }

    try {
      const cars = await getAvailableCars.execute({ startDate, endDate });
      res.json(cars);
    } catch (err) {
      res.status(err.status || 400).json({ message: err.message });
    }
  }

  return { getAvailability };
}

module.exports = makeCarsController;

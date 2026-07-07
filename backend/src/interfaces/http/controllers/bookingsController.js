function makeBookingsController({ createBooking }) {
  async function create(req, res) {
    res.status(501).json({ message: 'Not implemented' });
  }

  return { create };
}

module.exports = makeBookingsController;

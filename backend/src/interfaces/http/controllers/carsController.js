function makeCarsController({ getAvailableCars }) {
  async function getAvailability(req, res) {
    res.status(501).json({ message: 'Not implemented' });
  }

  return { getAvailability };
}

module.exports = makeCarsController;

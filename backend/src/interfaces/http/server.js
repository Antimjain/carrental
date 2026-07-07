const express = require('express');
const cors = require('cors');
const carsRoutes = require('./routes/carsRoutes');
const bookingsRoutes = require('./routes/bookingsRoutes');

function createServer({ carsController, bookingsController }) {
  const app = express();
  app.use(cors());
  app.use(express.json());

  app.get('/health', (req, res) => res.json({ status: 'ok' }));

  app.use('/cars', carsRoutes(carsController));
  app.use('/bookings', bookingsRoutes(bookingsController));

  return app;
}

module.exports = createServer;

const express = require('express');
const cors = require('cors');
const carsRoutes = require('./routes/carsRoutes');
const bookingsRoutes = require('./routes/bookingsRoutes');

function createServer({ carsController, bookingsController }) {
  const app = express();
  const allowedOrigin = process.env.CORS_ORIGIN;
  app.use(cors(allowedOrigin ? { origin: allowedOrigin } : undefined));
  app.use(express.json());

  app.get('/health', (req, res) => res.json({ status: 'ok' }));

  app.use('/cars', carsRoutes(carsController));
  app.use('/bookings', bookingsRoutes(bookingsController));

  return app;
}

module.exports = createServer;

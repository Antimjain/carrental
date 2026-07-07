const { Router } = require('express');

function carsRoutes(controller) {
  const router = Router();
  router.get('/availability', controller.getAvailability);
  return router;
}

module.exports = carsRoutes;

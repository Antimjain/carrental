const { Router } = require('express');

function bookingsRoutes(controller) {
  const router = Router();
  router.post('/', controller.create);
  return router;
}

module.exports = bookingsRoutes;

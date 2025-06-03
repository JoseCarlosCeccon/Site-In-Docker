const express = require('express');
const beerController = require('../controllers/beerController');

const router = express.Router();

router
  .route('/')
  .get(beerController.getAllBeers)
  .post(beerController.createBeer);

router
  .route('/:id')
  .get(beerController.getBeer)
  .patch(beerController.updateBeer)
  .delete(beerController.deleteBeer);

module.exports = router;

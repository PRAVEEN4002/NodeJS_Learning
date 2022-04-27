const express = require('express');

const router = express.Router();
const tourController = require('../controllers/tourController');

// router.param('id', tourController.checkId);
router.route('/get-tour-states').get(tourController.getTourStates);
router.route('/get-monthly-plan/:year').get(tourController.getMonthlyPlan);
router
  .route('/top-5-tours')
  .get(tourController.aliasTopTours, tourController.getalltours);
router.route('/').get(tourController.getalltours).post(tourController.posttour);
router
  .route('/:id')
  .get(tourController.gettour)
  .patch(tourController.updatetour)
  .delete(tourController.deletetour);

module.exports = router;

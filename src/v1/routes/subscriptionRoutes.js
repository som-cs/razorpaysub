const express = require('express');
const {
  getSubscription, createSubcription, cancelSubscription, pauseSubscription, resumeSubscription,
  paymentVerification,
} = require('../controllers/subscriptionController');

const subRouter = express.Router();

subRouter.get('/get', getSubscription);
subRouter.put('/create', createSubcription);
subRouter.post('/cancel', cancelSubscription);
subRouter.post('/pause', pauseSubscription);
subRouter.post('/resume', resumeSubscription);
subRouter.post('/verification', paymentVerification);

module.exports = subRouter;

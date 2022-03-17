const express = require('express');
const {
  getSubscription, createSubcription, cancelSubscription, pendingUpdate, pauseSubscription, resumeSubscription,
} = require('../controllers/subscriptionController');

const subRouter = express.Router();

subRouter.get('/get', getSubscription);
subRouter.get('/pending', pendingUpdate);
subRouter.put('/create', createSubcription);
subRouter.post('/cancel', cancelSubscription);
subRouter.post('/pause', pauseSubscription);
subRouter.post('/resume', resumeSubscription);

module.exports = subRouter;

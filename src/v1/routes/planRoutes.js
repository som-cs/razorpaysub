const express = require('express');
const { getPlan, addNewPlan } = require('../controllers/planControllers');

const planRouter = express.Router();

planRouter.get('/get', getPlan);
planRouter.put('/create', addNewPlan);

module.exports = planRouter;

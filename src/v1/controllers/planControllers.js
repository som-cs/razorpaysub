const Razorpay = require('razorpay');
require('dotenv').config();

const razorInstance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_SECRET_KEY,
});

/**
 * creates a plan. Needed to create subscription
 * URL: http://127.0.0.1:8001/plans/create
 * METHOD: PUT
 * BODY: {
    "period": "weekly",
    "interval": 1,
    "name": "Test plan - Weekly",
    "amount": 5000,
    "description": "Description for the test plan is superb"
}
 * documentation: https://razorpay.com/docs/v2/beta/api/payments/subscriptions#create-a-plan
 *
 * @param req
 * @param res
 */

const addNewPlan = (req, res) => {
  const currency = 'INR';
  const {
    period, interval, name, amount, description,
  } = req.body;
  razorInstance.plans.create({
	  period,
	  interval,
	  item: {
		  name,
		  amount,
		  currency,
		  description,
	  },
  })
	  .then((data) => {
		  res.status(200).json(data);
	  })
	  .catch((error) => {
		  console.log(error);
	  });
};

/**
 * json of all the plans
 * if you pass planId, returns only single plan info
 * URL: http://127.0.0.1:8001/plans/get?planId=plan_J83ILjYQo2NVHy
 * METHOD: GET
 * documentation: https://razorpay.com/docs/v2/beta/api/payments/subscriptions#fetch-a-plan-by-id
 *
 * if you DO NOT pass planId, returns all the plans
 * URL: http://127.0.0.1:8001/plans/get
 * METHOD: GET
 * documentation: https://razorpay.com/docs/v2/beta/api/payments/subscriptions#fetch-all-plans
 *
 *
 * @param req
 * @param res
 */
const getPlan = (req, res) => {
  const planId = req.query.planId || null;
  if (planId) {
    razorInstance.plans.fetch(planId)
      .then((data) => {
        res.status(200).json(data);
      })
      .catch((error) => {
        res.status(404).json({ msg: 'Plan Not Found' });
        console.log(error);
      });
  } else {
    razorInstance.plans.all()
      .then((data) => {
        res.status(200).json(data);
      })
      .catch((error) => {
        console.log(error);
      });
  }
};

module.exports = {
  getPlan,
  addNewPlan,
};

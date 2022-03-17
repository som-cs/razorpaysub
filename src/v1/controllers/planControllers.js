const Razorpay = require('razorpay');
require('dotenv').config();

const razorInstance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_SECRET_KEY,
});

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

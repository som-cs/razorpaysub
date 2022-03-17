const Razorpay = require('razorpay');
const crypto = require('crypto');
require('dotenv').config();

const razorInstance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_SECRET_KEY,
});

const getSubscription = (req, res) => {
  const subId = req.query.subscriptionId || null;
  if (subId) {
    razorInstance.subscriptions.fetch(subId)
      .then((data) => {
        res.status(200).json(data);
      })
      .catch((error) => {
        res.status(404).json({ msg: 'No subscription found' });
      });
  } else {
    razorInstance.subscriptions.all()
      .then((data) => {
        res.status(200).json(data);
      })
      .catch((error) => {
        res.status(error.statusCode).json(error.error);
      });
  }
};

const createSubcription = (req, res) => {
  const {
    plan_id, customer_notify, quantity, total_count, name, amount, expire_by,
  } = req.body;
  const currency = 'INR';
  razorInstance.subscriptions.create({
    plan_id,
    customer_notify,
    quantity,
    total_count,
    expire_by,
    addons: [
      {
        item: {
          name,
          amount,
          currency,
        },
      },
    ],
  })
    .then((data) => {
      res.status(200).json(data);
    })
    .catch((error) => {
      res.status(error.statusCode).json(error.error);
    });
};

const cancelSubscription = (req, res) => {
  const { subscriptionId, cancel_at_cycle_end } = req.body;

  if (subscriptionId) {
    razorInstance.subscriptions.cancel(subscriptionId, cancel_at_cycle_end)
      .then((data) => {
        res.status(200).json(data);
      })
      .catch((error) => {
        res.status(error.statusCode).json(error.error);
      });
  }
};

// NOT Tested yet

const pendingUpdate = (req, res) => {
  const subId = req.query.subscriptionId || null;
  if (subId) {
    razorInstance.subscriptions.pendingUpdate()
      .then((data) => {
        res.status(200).json(data);
      })
      .catch((error) => {
        res.status(error.statusCode).json(error.error);
      });
  } else {
    res.status(400).json({ msg: 'Please send subscriptionId' });
  }
};

const pauseSubscription = (req, res) => {
  const { subscriptionId } = req.body;
  if (subscriptionId) {
    razorInstance.subscriptions.pause(subscriptionId, {
      pause_at: 'now',
    })
      .then((data) => {
        res.status(200).json(data);
      })
      .catch((error) => {
        res.status(error.statusCode).json(error.error);
      });
  } else {
    res.status(400).json({ msg: 'Please send subscriptionId' });
  }
};

const resumeSubscription = (req, res) => {
  const { subscriptionId } = req.body;
  if (subscriptionId) {
    razorInstance.subscriptions.resume(subscriptionId, {
      resume_at: 'now',
    })
      .then((data) => {
        res.status(200).json(data);
      })
      .catch((error) => {
        res.status(error.statusCode).json(error.error);
      });
  } else {
    res.status(400).json({ msg: 'Please send subscriptionId' });
  }
};

const paymentVerification = (req, res) => {
  const { subscription_id, payment_id, signature } = req.body;
  razorInstance.payments.paymentVerification({
    subscription_id,
    payment_id,
    signature,
  }, process.env.RAZORPAY_SECRET_KEY)
    .then((data) => {
      console.log(data);
    })
    .catch((error) => {
      res.status(error.statusCode).json(error.error);
    });
};

module.exports = {
  getSubscription,
  createSubcription,
  resumeSubscription,
  cancelSubscription,
  pendingUpdate,
  pauseSubscription,
  paymentVerification,
};

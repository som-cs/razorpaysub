const Razorpay = require('razorpay');
const crypto = require('crypto');
require('dotenv').config();

const razorInstance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_SECRET_KEY,
});

/**
 * json of all the subscriptions
 * URL: http://127.0.0.1:8001/subscription/get?subscriptionId=sub_J83K5zlBug0Fha
 * METHOD: GET
 * documentation: https://razorpay.com/docs/v2/beta/api/payments/subscriptions#fetch-all-subscriptions
 *
 * @param req
 * @param res
 */
const getSubscription = (req, res) => {
  const subId = req.query.subscriptionId || null;
  if (subId) {
    razorInstance.subscriptions.fetch(subId)
      .then((data) => {
        res.status(200).json(data);
      })
      .catch((error) => {
        res.status(error.statusCode).json(error.error);
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

/**
 * creates subscription if a plan already exists for it.
 * URL: http://127.0.0.1:8001/subscription/create
 * METHOD: PUT
 * BODY: {
        "plan_id": "plan_J83ILjYQo2NVHy",
        "customer_notify": 1,
        "quantity": 5,
        "total_count": 6,
        "expire_by": 1695999837,
        "name": "Delivery charges",
        "amount": 10000
    }
 * documentation: https://razorpay.com/docs/v2/beta/api/payments/subscriptions#create-a-subscription
 *
 * @param req
 * @param res
 */
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

/**
 * cancel a subscription.
 * METHOD: POST
 * URL: http://127.0.0.1:8001/subscription/cancel
 * BODY: {
    "subscriptionId":"sub_J83K5zlBug0Fha",
    "cancel_at_cycle_end": 1
 * }
 * documentation: https://razorpay.com/docs/v2/beta/api/payments/subscriptions#cancel-a-subscription
 * @param req
 * @param res
 */
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

/**
 * Pauses a subscription.
 * METHOD: POST
 * URL: http://127.0.0.1:8001/subscription/pause
 * BODY: {
    "subscriptionId":"sub_J83K5zlBug0Fha",
 * }
 * documentation: https://razorpay.com/docs/v2/beta/api/payments/subscriptions#pause-a-subscription
 * @param req
 * @param res
 */
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

/**
 * Pauses a subscription.
 * METHOD: POST
 * URL: http://127.0.0.1:8001/subscription/resume
 * BODY: {
    "subscriptionId":"sub_J83K5zlBug0Fha",
 * }
 * documentation: https://razorpay.com/docs/v2/beta/api/payments/subscriptions#resume-a-subscription
 * @param req
 * @param res
 */
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

/**
 * webhooks and payment verification.
 * 3 webhooks active: 'subscription.charged', 'subscription.halted', 'subscription.pending'
 * documentation: https://razorpay.com/docs/v2/beta/payments/subscriptions/test/#expected-webhooks
 * METHOD: POST
 * URL: http://127.0.0.1:8001/subscription/verification
 * auto handling no need to call. just add /subscription/verification in webhook url
 *
 * @param req
 * @param res
 */
const paymentVerification = (req, res) => {
  if (req.body.event === 'subscription.charged') {
    const signature = process.env.SECRET;
    const { payload } = req.body;
    const paymentOd = payload.payment.entity.id;
    const subscriptionOd = payload.subscription.entity.id;
    const generatedSignature = crypto.createHmac('sha256', (`${paymentOd}|${subscriptionOd}`, signature));
    generatedSignature.update(JSON.stringify(req.body));
    res.status(200).json({ msg: 'Payment Successful ' });
  } else if (req.body.event === 'subscription.pending') {
    console.log('Charge failed');
    res.status(200).json({ msg: 'Payment Pending. Charge failed ' });
  } else if (req.body.event === 'subscription.halted') {
    console.log('More then 4 failed attempts');
    res.status(200).json({ msg: 'Payment Pending. Charge failed more then 4 times ' });
  } else {
    console.log('HOW!!!!!!!!');
    res.status(500).json({ msg: 'If you see this something is wrong because there are only 3 webhooks and they are already handeled ' });
  }
};

// exports

module.exports = {
  getSubscription,
  createSubcription,
  resumeSubscription,
  cancelSubscription,
  pauseSubscription,
  paymentVerification,
};

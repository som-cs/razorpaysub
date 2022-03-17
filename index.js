const express = require('express');
const planRouter = require('./src/v1/routes/planRoutes');
const subRouter = require('./src/v1/routes/subscriptionRoutes');

const setupExpress = () => {
  const app = express();

  const PORT = 8001;
  app.use(express.json()); // <==== parse request body as JSON
  app.use('/plans', planRouter);
  app.use('/subscription', subRouter);
  // app.use("/transactions")

  app.listen(PORT, () => {
    console.log(`Success! Your application is running on port ${PORT}.`);
  });
};

setupExpress();

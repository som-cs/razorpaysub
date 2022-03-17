const express = require('express'); // we all know why
const cors = require('cors'); // for webhook to work i needed to create a tunnel in localhost so cors was necessary
// routes
const planRouter = require('./src/v1/routes/planRoutes');
const subRouter = require('./src/v1/routes/subscriptionRoutes');

const setupExpress = () => {
  const app = express();

  const PORT = 8001;
  app.use(cors());
  app.use(express.json()); // <==== parse request body as JSON
  app.use('/plans', planRouter);
  app.use('/subscription', subRouter);

  app.listen(PORT, () => {
    console.log(`Success! Your application is running on port ${PORT}.`);
  });
};

setupExpress();

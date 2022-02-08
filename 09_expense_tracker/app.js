require('dotenv').config();
require('express-async-errors');

const express = require('express');

const { connectDB } = require('./db/connect');
const expenseRoutes = require('./routes/expenseRouter');

const { notFoundMiddleware } = require('./middleware/not-found');
const { errorHandlerMiddleware } = require('./middleware/error-handler');

const app = express();

// Middleware
app.use(express.static('./public'));
app.use(express.json());

// Routes
app.use('/api/v1/expenses', expenseRoutes);

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 3000;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    console.log('Connected to DB...');

    app.listen(port, () => {
      console.log(`Server listening on ${port}...`);
    });
  } catch (error) {
    console.log(error);
  }
};

start();

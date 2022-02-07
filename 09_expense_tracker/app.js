const express = require('express');

const expenseRoutes = require('./routes/expenseRouter');

const app = express();

// Middleware
app.use(express.static('./public'));
app.use(express.json());

// Routes
app.use('/api/v1/expenses', expenseRoutes);

const port = process.env.PORT || 3000;

const start = async () => {
  try {
    // database connection
    // console.log('Connected to DB...');

    app.listen(port, () => {
      console.log(`Server listening on ${port}...`);
    });
  } catch (error) {
    console.log(error);
  }
};

start();

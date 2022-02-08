const mongoose = require('mongoose');

const ExpenseSchema = new mongoose.Schema({
  text: {
    type: String,
    required: [true, 'Must provide a description of income/expense'],
    trim: true,
    maxlength: [20, 'Description cannot be more than 20 characters'],
  },
  amount: {
    type: Number,
    required: [true, 'Must provide an amount'],
  },
});

module.exports = mongoose.model('Expense', ExpenseSchema);
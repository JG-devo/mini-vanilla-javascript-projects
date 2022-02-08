const mongoose = require('mongoose');

const ExpenseSchema = new mongoose.Schema(
  {
    text: {
      type: String,
      required: [true, 'Must provide a description of income/expense'],
      trim: true,
      maxlength: [20, 'Description cannot be more than 20 characters'],
      unique: true,
    },
    amount: {
      type: Number,
      required: [true, 'Must provide an amount'],
    },
    createdBy: {
      type: mongoose.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Expense', ExpenseSchema);

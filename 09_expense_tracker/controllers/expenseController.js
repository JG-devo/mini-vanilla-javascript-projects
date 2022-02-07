const Expense = require('../models/expenseModel');

exports.getAllExpenses = async (req, res) => {
  res.json('get all expenses');
};

exports.getOneExpense = async (req, res) => {
  res.json('get one expenses');
};

exports.createExpense = async (req, res, next) => {
  res.json('create expense');
};

exports.updateExpense = async (req, res, next) => {
  res.json('update expense');
};

exports.deleteExpense = async (req, res, next) => {
  res.json('delete expense');
};

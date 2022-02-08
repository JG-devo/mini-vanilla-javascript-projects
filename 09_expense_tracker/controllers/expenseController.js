const { StatusCodes } = require('http-status-codes');

const { NotFoundError, BadRequestError } = require('../errors');
const Expense = require('../models/expenseModel');

exports.getAllExpenses = async (req, res) => {
  const expenses = await Expense.find({ createdBy: req.user.userID }).sort(
    'createdAt'
  );
  res.status(StatusCodes.OK).json({ count: expenses.length, expenses });
};

exports.getOneExpense = async (req, res) => {
  const {
    user: { userID },
    params: { id: expenseID },
  } = req;

  const expense = await Expense.findOne({ _id: expenseID, createdBy: userID });
  if (!expense) throw new NotFoundError(`No job with the id: ${expenseID}`);

  res.status(StatusCodes.OK).json({ expense });
};

exports.createExpense = async (req, res, next) => {
  req.body.createdBy = req.user.userID;
  const expense = await Expense.create(req.body);
  res.status(StatusCodes.OK).json({ expense });
};

exports.updateExpense = async (req, res, next) => {
  const {
    body: { text, amount },
    user: { userID },
    params: { id: expenseID },
  } = req;

  if (!text || !amount)
    throw new BadRequestError('Position or Company fields cannot be empty');

  // if (amount !== Number) throw new BadRequestError('Amount must be a number');

  const expense = await Expense.findOneAndUpdate(
    { _id: expenseID, createdBy: userID },
    req.body,
    {
      new: true,
      runValidators: true,
    }
  );

  if (!expense) throw new NotFoundError(`No job with the id: ${expenseID}`);

  res.status(StatusCodes.OK).json({ expense });
};

exports.deleteExpense = async (req, res, next) => {
  const {
    params: { id: expenseID },
    user: { userID },
  } = req;

  const expense = await Expense.findOneAndRemove({
    _id: expenseID,
    createdBy: userID,
  });
  if (!expense) throw new NotFoundError(`No job with the id: ${expenseID}`);

  res.status(StatusCodes.OK).send();
};

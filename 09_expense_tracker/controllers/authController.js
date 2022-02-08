const { StatusCodes } = require('http-status-codes');
const User = require('../models/userModel');
const { BadRequestError, UnauthenticatedError } = require('../errors');

exports.register = async (req, res) => {
  const user = await User.create(req.body);
  const token = user.createJWT();

  res.status(StatusCodes.CREATED).json({ user: { name: user.name }, token });
};

exports.login = async (req, res) => {
  const { name, password } = req.body;
  if (!name || !password)
    throw new BadRequestError('Please provide your email and password');

  const user = await User.findOne({ name });
  if (!user) throw new UnauthenticatedError('Invalid credentials');

  const isPasswordCorrect = await user.comparePassword(password);
  if (!isPasswordCorrect) throw new UnauthenticatedError('Invalid credentials');

  const token = user.createJWT();

  res.status(StatusCodes.OK).json({ user: { name: user.name }, token });
};

const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const { UnauthenticatedError } = require('../errors');

exports.authenticatedUser = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer'))
    throw new UnauthenticatedError('Authentication Invalid');

  const token = authHeader.split(' ')[1];

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);

    const isUserInDB = await User.findById(payload.userID).select('-password');
    if (!isUserInDB) throw new UnauthenticatedError('User does not exist');

    req.user = { userID: payload.userID, name: payload.name };
    next();
  } catch (error) {
    throw new UnauthenticatedError('Authentication Invalid');
  }
};

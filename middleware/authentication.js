require('dotenv').config();
const jwt = require('jsonwebtoken');
const { UnauthenticatedError } = require('../errors');
const User = require('../models/User');

const auth = async (req, res, next) => {
  // check for header authorization
  const authHeaders = req.headers.authorization;
  if (!authHeaders || !authHeaders.startsWith('Bearer ')) {
    throw new UnauthenticatedError('Authentication Invalid');
  }
  const token = authHeaders.split(' ')[1]; // get the token
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    // attach the user to the job routes
    req.user = {
      userId: payload.userId,
      name: payload.name,
      email: payload.email,
    };
    next();
  } catch (error) {
    throw new UnauthenticatedError('Authentication invalid');
  }
  // try {
  //   const payload = jwt.verify(token, process.env.JWT_SECRET);

  //   const user = User.findById(payload.id).select('-password');
  //   req.user = user;

  //   next();
  // } catch (error) {
  //   throw new UnauthenticatedError('Authentication Invalid');
  // }
};

module.exports = auth;

require('dotenv').config();
const User = require('../models/User');
const { BadRequestError, UnauthenticatedError } = require('../errors');

const register = async (req, res) => {
  const user = await User.create({ ...req.body });
  const token = user.createJWT();
  res.status(200).json({ data: { userId: user._id, name: user.name }, token });
};

const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new BadRequestError('Please provide a valid email & password');
  }

  const user = await User.findOne({ email });
  // user checking
  if (!user) {
    throw new UnauthenticatedError('Invalid Creditnals');
  }

  const isPasswordCorrect = await user.comparePassword(password);
  // password checking
  if (!isPasswordCorrect) {
    throw new UnauthenticatedError('Invalid Creditnals');
  }

  // comparing (hash/dehashed) password
  const token = user.createJWT();
  res.status(200).json({ data: { userId: user._id, name: user.name }, token });
};

module.exports = {
  register,
  login,
};

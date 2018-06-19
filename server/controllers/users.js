const JWT = require('jsonwebtoken');
const { JWT_SECRET } = require('../config');
const User = require('../models/Users');

const signToken = user =>
  JWT.sign(
    {
      iss: 'nodeApiAuth',
      sub: user.id,
      iat: new Date().getTime(),
      exp: new Date().setDate(new Date().getDate() + 1)
    },
    JWT_SECRET
  );

module.exports = {
  signUp: async (req, res, next) => {
    // consumes email, password, user name, validates data
    const { email, password } = req.value.body;
    // Check if user already exists
    const foundUser = await User.findOne({ email });
    if (foundUser) {
      return res
        .status(403)
        .json({ error: `${email} already exists in the database.` });
    }
    // create new user
    const newUser = new User({
      email,
      password
    });

    await newUser.save();

    const token = signToken(newUser);

    res.status(200).json({
      token
    });
  },

  signIn: async (req, res, next) => {
    const token = signToken(req.user);
    res.status(200).json({ token });
  },

  secret: async (req, res, next) => {
    console.log('usersController.secret() called');
    res.json({ secret: 'resource' });
  }
};

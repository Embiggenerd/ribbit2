const JWT = require('jsonwebtoken');
const stripe = require('stripe')('sk_test_pvfx8vd9zb2O30gcsroRwieK');
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
    console.log('signup body', req.value.body);
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
    console.log('signup newuser', newUser);

    const user = await newUser.save();
    console.log('signup saved user', user);

    const token = signToken(user);
    console.log('signup token', token);

    res.status(200).json({
      user: user.toJSON(),
      token
    });
  },
  /**
   * Check that login information was correct happens in
   * passport.authenticate('local') in routes, so req.user
   * is data that has already been validated
   */
  signIn: async (req, res, next) => {
    try {
      console.log('signin req.value.body', req.value.body);
      console.log('signin req.body', req.body);
      console.log('signin req.user', req.user);

      const { user } = req;
      console.log('uzer', user);
      const token = signToken(user);
      // res with token so user can store it to stay logged in
      //delete user.prototype.password
      res.status(200).json({ token, user: user.toJSON() });
    } catch (e) {
      console.log(e);
    }
  },

  secret: async (req, res, next) => {
    // if (!req.headers.authorization) {
    //   return res.json({ error: 'No credentials sent!' });
    // }
    const { email } = req.user;
    console.log('secret req.user,', req.user);
    res.json({
      user: {
        email
      }
    });
  },

  stripe: async (req, res, next) => {
    try {
      await stripe.charges.create({
        amount: 500,
        currency: 'usd',
        description: '5 dollars please',
        source: req.body.token
      });
      // const user = await User.findOne({ id: req.id })
      let { user } = req;
      user.credits += 5;
      user = await user.save();
      res.send({ user: user.toJSON() });
    } catch (e) {
      console.log(e);
      res.status(500).send(e);
    }
  }
};

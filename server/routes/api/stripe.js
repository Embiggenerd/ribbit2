const express = require('express');
const router = require('express-promise-router')();
const passport = require('passport');
const stripe = require('stripe');

const stripeController = require('../../controllers').stripe;

router
  .route('/')
  .post(
    passport.authenticate('local', { session: false }),
    stripeController.pay
  );
// make sure user is authenticated

// pass token to stripe

// call stripe's create charge function

module.exports = router;
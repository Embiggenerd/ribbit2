const express = require('express');
const router = require('express-promise-router')();
const passport = require('passport');
const stripe = require('stripe');

const stripeController = require('../../controllers').stripe;

router
  .route('/')
  .post(passport.authenticate('jwt', { session: false }), stripeController.pay);

module.exports = router;

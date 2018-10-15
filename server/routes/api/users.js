const express = require('express');
//const router = require('express').Router()
const router = require('express-promise-router')();
const passport = require('passport');
const passportConf = require('../../passport');

const { validateBody, schemas } = require('../../helpers/routeHelpers');
const usersController = require('../../controllers').users;

/**
 * Local strategy is used to create user in database.
 * JWT strategy only used to remember user, so they don't
 * have to login every time. That is why we use different
 * authentication requirements in routes.
 */

router
  .route('/signup')
  .post(validateBody(schemas.authSchema), usersController.signUp);

// Validating email/password happens in the authentication wrapper
router
  .route('/signin')
  .post(
    validateBody(schemas.authSchema),
    passport.authenticate('local', { session: false }),
    usersController.signIn
  );

router
  .route('/secret')
  .get(
    passport.authenticate('jwt', { session: false, failWithError: true }),
    usersController.secret
  );

router
  .route('/stripe')
  .post(
    passport.authenticate('jwt', { session: false }),
    usersController.stripe
  );

module.exports = router;

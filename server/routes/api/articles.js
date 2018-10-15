//const mongoose = require('mongoose')
const router = require('express').Router();
const passport = require('passport');

const articlesController = require('../../controllers').articles;

router.post(
  '/',
  passport.authenticate('jwt', { session: false, failWithError: true }),
  articlesController.submitArticle
);

router.get(
  '/',
  passport.authenticate('jwt', { session: false, failWithError: true }),
  articlesController.getArticles
);

router.param('id', articlesController.idParam);

router.get('/:id', articlesController.getSingleArticle);

router.patch('/:id', articlesController.updateArticle);

router.delete('/:id', articlesController.deleteArticle);

module.exports = router;

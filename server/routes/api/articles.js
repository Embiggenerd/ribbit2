const mongoose = require('mongoose')
const router = require('express').Router()

const articlesController = require('../../controllers').articles

router.post('/', articlesController.submitArticle)

router.get('/', articlesController.getArticles)

router.param('id', articlesController.idParam)

router.get('/:id', articlesController.getSingleArticle)

router.patch('/:id', articlesController.updateArticle)

router.delete('/:id', articlesController.deleteArticle)

module.exports = router

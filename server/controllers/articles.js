const mongoose = require('mongoose')
const Articles = mongoose.model('Articles')

const getArticles = (req, res, next) => {
  // We run save on schema instance, but we respond with schemaInsta.toJSON() custom method.
  return Articles.find()
    .sort({ createdAt: 'descending' })
    .then(articles =>
      res.json({ articles: articles.map(article => article.toJSON()) })
    )
    .catch(next)
}

const submitArticle = (req, res, next) => {
  const { body } = req

  if (!body.title) {
    return res.status(422).json({
      errors: {
        title: 'is required'
      }
    })
  }

  if (!body.author) {
    return res.status(422).json({
      errors: {
        author: 'is required'
      }
    })
  }

  if (!body.body) {
    return res.status(422).json({
      errors: {
        body: 'is required'
      }
    })
  }

  const finalArticle = new Articles(body)
  return finalArticle
    .save()
    .then(() => res.json({ article: finalArticle.toJSON() }))
    .catch(next)
}

const updateArticle = (req, res, next) => {
  const { body } = req

  if (typeof body.title !== 'undefined') {
    req.article.title = body.title
  }

  if (typeof body.author !== 'undefined') {
    req.article.author = body.author
  }

  if (typeof body.body !== 'undefined') {
    req.article.body = body.body
  }

  return req.article
    .save()
    .then(() => res.json({ article: req.article.toJSON() }))
    .catch(next)
}

const idParam = (req, res, next, id) => {
  // Places article object on req to get later
  return Articles.findById(id, (err, article) => {
    if (err) {
      return res.sendStatus(404)
    } else if (article) {
      req.article = article
      return next()
    }
  }).catch(next)
}

const getSingleArticle = (req, res, next) => {
  return res.json({
    article: req.article.toJSON()
  })
}

const deleteArticle = (req, res, next) => {
  return Articles.findByIdAndRemove(req.article._id)
    .then(() => res.sendStatus(200))
    .catch(next)
}

module.exports = {
  getArticles,
  submitArticle,
  updateArticle,
  idParam,
  getSingleArticle,
  deleteArticle
}

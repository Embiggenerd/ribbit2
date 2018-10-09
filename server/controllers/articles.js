const mongoose = require("mongoose");
const Articles = mongoose.model("Articles");

const getArticles = async (req, res, next) => {
  try {
    const articles = await Articles.find().sort({ createdAt: "descending" });
    return res.json({ articles: articles.map(article => article.toJSON()) });
  } catch (err) {
    next(err);
  }
};

const submitArticle = async (req, res, next) => {
  const { body } = req;

  if (!body.title) {
    return res.status(422).json({
      errors: {
        title: "is required"
      }
    });
  }

  if (!body.author) {
    return res.status(422).json({
      errors: {
        author: "is required"
      }
    });
  }

  if (!body.body) {
    return res.status(422).json({
      errors: {
        body: "is required"
      }
    });
  }

  // console.log("aritlce req.body", req.body);

  const finalArticle = new Articles(body);

  // console.log("finalArticle model", finalArticle);
  try {
    const savedArticle = await finalArticle.save();
    // console.log("savedArticle", savedArticle);
    const json = await savedArticle.toJSON();
    // console.log("json", json);
    res.send({ article: json });
  } catch (e) {
    // () => console.log("eee", e);
    next(e)
  }

  // return finalArticle
  //   .save()
  //   .then(() => {
  //     const rez = res.json({ article: finalArticle.toJSON() });
  //     console.log('submist articles req after saving', rez);
  //   })
  //   .catch(err, next(err));
};

const updateArticle = (req, res, next) => {
  const { body } = req;

  if (typeof body.title !== "undefined") {
    req.article.title = body.title;
  }

  if (typeof body.author !== "undefined") {
    req.article.author = body.author;
  }

  if (typeof body.body !== "undefined") {
    req.article.body = body.body;
  }

  return req.article
    .save()
    .then(() => res.json({ article: req.article.toJSON() }))
    .catch(next);
};

const idParam = (req, res, next, id) => {
  // Places article object on req to get later
  return Articles.findById(id, (err, article) => {
    if (err) {
      return res.sendStatus(404);
    } else if (article) {
      req.article = article;
      return next();
    }
  }).catch(next);
};

const getSingleArticle = (req, res, next) => {
  return res.json({
    article: req.article.toJSON()
  });
};

const deleteArticle = (req, res, next) => {
  return Articles.findByIdAndRemove(req.article._id)
    .then(() => res.sendStatus(200))
    .catch(next);
};

module.exports = {
  getArticles,
  submitArticle,
  updateArticle,
  idParam,
  getSingleArticle,
  deleteArticle
};

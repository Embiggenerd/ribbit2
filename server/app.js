const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const cors = require('cors');
const errorHandler = require('errorhandler');
const mongoose = require('mongoose');

const app = express();

const isProd = process.env.NODE_ENV === 'production';
// const isTest = process.env.NODE_ENV === 'test';
const isDev = process.env.NODE_ENV === 'development';

console.log('process.env.NODE_ENV', process.env.NODE_ENV);

mongoose.promise = global.Promise;

if (isDev) {
  mongoose.connect(
    'mongodb://ribbit2-dev:ribbit2-dev@ds163510.mlab.com:63510/ribbit2_dev',
    console.log('mongoose connected to ribbit2')
  );
  app.use(errorHandler());
  mongoose.set('debug', true);
}

if (isProd) {
  mongoose.connect(
    'mongodb://ribbit2-prod:ribbit2-prod@ds163530.mlab.com:63530/ribbit2'
  );
}

// if (isTest) {
//   mongoose.connect(
//     'mongodb://ribbit2-test:ribbit2-test@ds263590.mlab.com:63590/ribbit2-test'
//   );
//   //app.use(errorHandler());
// }

app.use(cors());
app.use(require('morgan')('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '..', 'client', 'public')));
app.use(
  session({
    secret: 'LightBlog',
    cookie: { maxAge: 60000 },
    resave: false,
    saveUninitialized: false
  })
);

// if()
// mongoose.connect('mongodb://igor:password1@ds245210.mlab.com:45210/simple_blog_dev');
// mongoose.set('debug', true);

// // Add models
require('./models/Articles');
// // Add routes
app.use(require('./routes'));

app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

if (!isProd) {
  app.use((err, req, res) => {
    res.status(err.status || 500);

    res.json({
      errors: {
        message: err.message,
        error: err
      }
    });
  });
}

app.use((err, req, res, next) => {
  res.status(err.status || 500);

  res.json({
    errors: {
      message: err.message,
      error: {}
    }
  });
});

module.exports = app;

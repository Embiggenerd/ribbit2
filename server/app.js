const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const cors = require('cors');
const errorHandler = require('errorhandler');
const mongoose = require('mongoose');

const app = express();

const isProd = process.env.NODE_ENV === 'production';

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

app.use(cors());
app.use(require('morgan')('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '..', 'client', 'public')));
app.use(
  session({
    secret: 'JwtBlog',
    cookie: { maxAge: 60000 },
    resave: false,
    saveUninitialized: false
  })
);
app.options('/*', function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.header(
    'Access-Control-Allow-Headers',
    'Content-Type, Authorization, Content-Length, X-Requested-With'
  );
  res.send(200);
});

require('./models/Articles');

app.use(require('./routes'));

app.get('/*', function(req, res) {
  res.sendFile(
    path.join(__dirname, '..', 'client', 'public', 'index.html'),
    function(err) {
      if (err) {
        res.status(500).send(err);
      }
    }
  );
});

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

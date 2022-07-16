var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var config = require("./database/db.json");
var cors = require("cors");
var mongoose = require("mongoose");
const dotenv = require('dotenv').config();
var indexRouter = require('./routes/index');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
console.log("hello")
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());

app.use('/', indexRouter);
app.use('/users', require('./routes/userRoutes'));
app.use('/company', require('./routes/companyRoutes'));
app.use('/area', require('./routes/areaRoutes'));
app.use('/zone', require('./routes/zoneRoutes'));
app.use('/affectation', require('./routes/AffectationRoutes'));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});


mongoose.connect(config.mongo.uri, () => {
  console.log("Connected to DATABASE");
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;

require('dotenv').config({ path: './utils/.env' });
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');

var app = express();

// database
require('./model/database');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/', indexRouter);

// error handling
const ErrorHandler = require('./utils/Errorhandler');
const { CreateError } = require('./middleware/error');
app.all('*', (req, res, next) => {
  next(new ErrorHandler(`Req path is ${req.path} not found` , 400))
});

app.use(CreateError);

console.log(`server is running on ${process.env.PORT}`);


module.exports = app;

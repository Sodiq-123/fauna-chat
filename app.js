var createError = require('http-errors');
var express = require('express');
var path = require('path');
var logger = require('morgan');
var cors = require('cors');

// Routes for the API
var indexRouter = require('./src/routes/index');
var usersRouter = require('./src/routes/users');
var chatRouter = require('./src/routes/chatRoom');
var deleteRouter = require('./src/routes/delete');

var app = express();

// view engine setup
module.exports = () => {
  app.use(logger('dev'));
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  
  // Specify the routes
  app.use('/api', indexRouter);
  app.use('/api/users', usersRouter);
  app.use('/api/chat', chatRouter);
  app.use('/api/delete', deleteRouter);
  
  // catch 404 and forward to error handler
  app.use('*', (req, res) => {
    return res.status(404).json({
      success: false,
      message: 'API endpoint does not exist'
    })
  });
  
  // error handler
  app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
  
    res.status(err.status || 500);
  });

  return app
}

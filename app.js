var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
//var mongo = require('mongodb');
var monk = require('monk');
var db = monk('localhost:27017/lageplan');
//Logging für den Server
var JL = require('jsnlog').JL; 

var indexRouter = require('./routes/index');
//var databaseRouter = require('./routes/db');

var app = express();

var port = 3000;
app.listen(port, '127.0.0.1', function () {
  console.log('Server now listening on port ' + port + '.');
})
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');



// Make our db accessible to our router
app.use(function(req,res,next){
  req.db = db;
  next();
});

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
//app.use('/db', databaseRouter);
app.use('/', indexRouter);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
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

const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const log = require('./utils/log')
const socket = require('./socket')

//===================================================
// SERVER SETUP
//===================================================
const app = express();
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '../public')));

//===================================================
// ROOTER SETUP
//===================================================
app.use('/', require('./routes/index'));
app.use('/users', require('./routes/users'));
app.use('/api', require('./routes/api1'));

//===================================================
// ERROR HANDLER SETUP
//===================================================
// catch 404 and forward to error handler
app.use((req, res, next) => {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use((err, req, res, next) => {
  log.error(err)
  res.locals.message = err.message;
  res.locals.error = (req.app.get('env') === 'development') ? err : {};
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;

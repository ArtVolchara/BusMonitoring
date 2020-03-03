const createError = require('http-errors');
const express = require('express');

const usersRouter = require('./routes/users');

const app = express();

// Подключаем mongoose.
const mongoose = require('mongoose');
mongoose.connect(
  "mongodb://localhost:27017/BusMonitoring",
  { useNewUrlParser: true, useUnifiedTopology: true }
);

app.use('/api/users/', usersRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
console.error(err);
  // render the error page
  res.status(err.status || 500);
  res.send('error');
});

module.exports = app;

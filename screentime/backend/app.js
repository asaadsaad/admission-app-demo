var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const mongoose = require('mongoose');
const cors = require('cors')

mongoose.connect('mongodb://localhost:27017/test');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(cors())
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


const Snapshot = mongoose.model('Snapshot', { data: String });


app.post('/savesnapshot', (req, res) => {
  const snapshot = new Snapshot({ data: req.body.data });
  snapshot.save().then(() => { console.log('saved snapshot'); res.json({ 'info': 'saved snapshot' }) });
});

app.get('/getsnapshots', (req, res) => {
  Snapshot.find({}).exec().then(snaps => res.json(snaps))
})


// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});
app.listen(3000, _ => console.log('listening on 3000'))
module.exports = app;

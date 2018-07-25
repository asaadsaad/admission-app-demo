var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const mongoose = require('mongoose')
var app = express();

mongoose.connect('mongodb://localhost:27017/testApp', { useNewUrlParser: true });
const Posts = mongoose.model('Posts', new mongoose.Schema({ title: String, details: String }));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.disable('x-powered-by')
app.disable('view cache');

app.use((req, res, next) => {
  res.setHeader('Cache-Control', 'no-cache');
  next()
})

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/public/highlight', express.static(path.join(__dirname, 'public/highlight')));

app.get('/', (req, res) => {
  Posts.find({}).exec().then((data) => {
    res.render('posts', { data: data })
    console.log({ data: data })
  })
});
app.get('/backend', (req, res) => {
  res.render('form')
});


app.post('/backend/posts', (req, res) => {
  const post_id = mongoose.Types.ObjectId()
  const post = new Posts({
    _id: post_id,
    title: req.body.title,
    details: req.body.details
  }).save().then(() => {
    res.json({
      id: post_id,
      title: req.body.title,
      details: req.body.details
    });
  })
});

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
app.listen(5858)
module.exports = app;

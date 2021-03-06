var express = require('express');
var path = require('path');
//var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var compression = require('compression');
var session = require('express-session');
var cookieSession = require('cookie-session');
var RedisStore = require('connect-redis')(session);

var index = require('./routes/index');
var users = require('./routes/users');
var product = require('./routes/product');
var cart = require('./routes/cart');
var book = require('./routes/book');
var address = require('./routes/address');
var weixin = require('./routes/weixin');
var alipay = require('./routes/alipay');

var app = express();


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(compression());

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser('hhmweb_'));

app.use(session({
  store: new RedisStore({
    host: "127.0.0.1",
    port: 6379,
    db: 2
  }),
  secret: 'MYun 123!@# web',
  key: 'sid',
  cookie: {secure: false, maxAge: 90 * 24 * 3600 * 1000},
  resave: false,
  saveUninitialized: true
}));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/users', users);
app.use('/product', product);
app.use('/cart', cart);
app.use('/book', book);
app.use('/address', address);
app.use('/weixin', weixin);
app.use('/alipay', alipay);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;

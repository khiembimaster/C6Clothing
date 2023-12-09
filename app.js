var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var app = express();
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));



const db = require('./models/db');
const Product = require('./models/product.m');


app.get('/', async function(req,res,next) {
  console.log("abc");
  const rs = await db.filterByRange("Products","Price",300000.0000,1600000000.0000,1,5);
  console.log(rs);
  next();
})

app.use(function(req, res, next) {
  next(createError(404));
});



module.exports = app;

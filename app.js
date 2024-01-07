require('dotenv').config('.env');
const express = require('express');
const session = require('express-session');


process.env.NODE_TLS_REJECT_UNAUTHORIZED='0'
const app = express();

const { create } = require('express-handlebars');

app.use(express.static('public'));

app.use(session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}))

require('./modules/passport')(app);

const hbs = create({
    extname: '.hbs'
})

app.use('/static', express.static('public'))

app.engine('hbs', hbs.engine);
app.set('views', './views');
app.set('view engine', 'hbs');

app.use(express.urlencoded({ extended: true }));

app.use('/', require('./routes/home.r'));
app.use('/account', require('./routes/auth.r'));
app.use('/category', require('./routes/category.r'));
app.use('/admin',require('./routes/admin.r'));
app.use('/product', require('./routes/product.r'));
app.use('/order', require('./routes/order.r'));
app.use('/cart', require('./routes/cart.r'));
module.exports = app;
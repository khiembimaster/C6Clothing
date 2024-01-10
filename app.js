require('dotenv').config('.env');
const express = require('express');
const session = require('express-session');
const checkAuthenticated = require('./modules/checkAuthenticated');

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'
const app = express();
app.use(express.json());
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
    extname: '.hbs',
    helpers: {
        times: function (n, block) {
            const accum = '';
            for (const i = 0; i < n; ++i)
                accum += block.fn(i);
            return accum;
        },
        'if_eq': function () {
            const args = Array.prototype.slice.call(arguments, 0, -1);
            const options = arguments[arguments.length - 1];
            const allEqual = args.every(function (expression) {
                return args[0] === expression;
            });

            return allEqual ? options.fn(this) : options.inverse(this);
        }
    }
})

app.use('/static', express.static('public'))

app.engine('hbs', hbs.engine);
app.set('views', './views');
app.set('view engine', 'hbs');

app.use(express.urlencoded({ extended: true }));

app.use('/', require('./routes/home.r'));
app.use('/account', require('./routes/auth.r'));
app.use('/category', require('./routes/category.r'));
app.use('/admin', require('./routes/admin.r'));
app.use('/product', require('./routes/product.r'));
// app.use('/order', require('./routes/order.r'));
app.use('/cart', checkAuthenticated, require('./routes/cart.r'));
app.use('/user', checkAuthenticated, require('./routes/user.r'))

module.exports = app;
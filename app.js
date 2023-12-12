require('dotenv').config('.env');
const express = require('express');
const session = require('express-session');

const app = express();

const { create } = require('express-handlebars');

app.use(express.static('public'));

app.use(session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie:{secure:false}
}))

require('./modules/passport')(app);

const hbs = create({
    extname: '.hbs'
})

app.use(express.static('public'))

app.engine('hbs', hbs.engine);
app.set('views', './views');
app.set('view engine', 'hbs');

app.use(express.urlencoded({extended:true}));

app.use('/account', require('./routes/auth.r'));

module.exports = app;
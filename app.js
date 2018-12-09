const express = require('express');
const path = require('path');
const bodyParser = require('body-parser')
const session = require('express-session')
const passport = require('passport')
const app = express();
const hb = require('express-handlebars');

require('dotenv').config();

// Middleware //
app.use(bodyParser.urlencoded({ extended: false }))
// --------- //

// View engine //
app.engine('handlebars', hb({ defaultLayout: 'clientmain' }));
app.set('view engine', 'handlebars');
// ---------- //

// Session setting //
app.use(session({
    secret: 'lalala',
    resave: false,
    saveUninitialized: true
}));
// -------------- //

// Passport config //
app.use(passport.initialize());
app.use(passport.session());
// -------------- //

// Static setting //
app.use(express.static(path.join(__dirname, 'public')))
// -------------- //

// Router setting //
let shopper = require('./routes/shopper')
app.use('/shopper', shopper)
let client = require('./routes/client')
app.use('/client', client)
// -------------- //

// Landingpage setting //
app.get('/', (req, res) => {
    // res.render('logintest')
    res.render('empty',{layout:"landing"})
})
// ------------------ //


// Listen server(ref dotenv) //
app.listen(process.env.PORT, (req, res) => {
    console.log(`Sever started on port ${process.env.PORT}!!`)
})
// ------------------------ //

// ** Testing only //
app.get('/test', (req, res) => {
    // res.render('logintest')
    res.render('test',{layout:"clientmain"})
})
// --------------- //
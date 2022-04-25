//*  ***************** REQUIRE ALL PACKAGES*************************** */
require('dotenv').config()
const express = require('express')
const app = express()
const mongoose = require('mongoose')
const passport = require('passport')
const session = require('express-session')
const flash = require('express-flash')
const { ensureAuth, redirectAuth } = require('./middlewares/ensureAuth')

require('./config/goolge_config')()
require('./config/facebook_config')()
// connect mongoose
mongoose.connect('mongodb://localhost/fbDB').then(() => console.log('MongDB is connected!')).catch(e => console.log(e.message))
// express setup
app.use(express.urlencoded({ extended: false }))
app.set('view engine', 'ejs')
app.use('*/css', express.static(__dirname + '/public/css'))
app.use(express.static(__dirname + '/public'))

//********************* PASSPORT AND SESSION SETUP***********************
app.use(session({
    secret: process.env.SECRET_KEY,
    resave: true,
    saveUninitialized: true

}))

app.use(passport.initialize())
app.use(passport.session())

//*************** GLOBAL VARIABLES***************************** */
app.use(flash())
app.use(function (req, res, next) {
    res.locals.success_msg = req.flash('success_msg')
    res.locals.err_msg = req.flash('err_msg')
    res.locals.error = req.flash('error')
    next()
})

//**************** @Routes****************************** */
app.get('/', (req, res) => {
    res.render('index')
})

// google login route
app.get('/auth/google', redirectAuth, passport.authenticate('google', { scope: ['profile', 'email'] }))

// redirect route after logging in
app.get('/auth/google/callback', passport.authenticate('google', {
    failureRedirect: '/',
    failureMessage: 'Failed to Sign Up, Plese Try again Later',
    failureFlash: true
}),
    function (req, res) {
        // Successful authentication, redirect secret page.
        req.flash('success_msg', 'Successfully Signed In')
        res.redirect('/secret');
    })

//*************** FACEBOOK LOG IN ROUTE************************ */
app.get('/auth/facebook', passport.authenticate('facebook'))

// redirect route after log in with  facebook
app.get('/auth/facebook/callback',
    passport.authenticate('facebook', { failureRedirect: '/' }),
    function (req, res) {
        // Successful authentication, redirect secret page.
        req.flash('success_msg', 'Successfully Signed In')
        res.redirect('/secret');
    }
)

// -------------------- secret route------------------------------------
app.get('/secret', ensureAuth, (req, res) => {
    res.render('secret', { user: req.user })
})


//-- log out route
app.get('/logout', ensureAuth, (req, res) => {
    req.logOut()
    req.flash('success_msg', 'Logged Out!')
    res.redirect('/')
})

app.listen(process.env.PORT || 3000, () => console.log('Server is started at http://localhost:3000'))
//importing installed packages
require('dotenv').config()
const DBURI = process.env.DBURI
const express = require('express')
const bodyPaser = require('body-parser')
const mongoose = require('mongoose')
const passport = require('passport')
const localStrategy = require('passport-local')
const methodOverride=require('method-override')
const flash=require('connect-flash')
const middleware=require('middleware')
const app = express()


//importing files:
// models
Farm = require('./model/farm')
console.log(Farm)
User = require('./model/user')
console.log(User)

// Routes
const authRoute = require('./routes/authentication')
// console.log(authRoute)
const farmRoute = require('./routes/farms')
// console.log(farmRoute)

//Setting view engine
app.set('view engine', 'ejs')

//using installed packages:
//Authentication
app.use(require("express-session")({
    secret: "once more",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
//Body Paser(for object identification)
app.use(bodyPaser.urlencoded({ extended: true }))

//using locally created header in all files 
app.use((req, res, next) => {
    res.locals.currentUser = req.user
    next()
})

//Ensure it comes last before creating routes(it may interrupt the code if place otherwise)
//using routes
app.use(authRoute)
app.use(farmRoute)
//Note: used in next phase of this code.
//app.use('./',authRoute)
//app.use('./farms, farmRoute)


//connecting Mongoose
mongoose.connect('mongodb://localhost:27017/farmTreasure', { useNewUrlParser: true })
    .then(() => console.log('mongodb running'))
    .catch((err) => console.log('error', err))


//Port
const port = process.env.PORT || 3000
app.listen(port, () => {
    console.log('farmTreasure server running')
})

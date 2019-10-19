//importing installed packages
require('dotenv').config()
const DBURI = process.env.DBURI
const express = require('express')
const bodyPaser = require('body-parser')
const mongoose = require('mongoose')
const passport = require('passport')
const flash =require('connect-flash')
console.log(flash)
const localStrategy = require('passport-local')
const app = express()

//importing files:
// models
Farm = require('./model/farm')
User = require('./model/user')
// Routes
const authRoute = require('./routes/authentication')
// console.log(authRoute)
const farmRoute = require('./routes/farms')
// console.log(farmRoute)

//Setting view engine
app.set('view engine', 'ejs')

app.use(express.static(__dirname + "/public"));
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

//Using flash
app.use(flash())

//Body Paser(for object identification)
app.use(bodyPaser.urlencoded({ extended: true }))

//using locally created header in all files 
app.use((req, res, next) => {
    res.locals.currentUser = req.user
    //res.locals.error = req.flash("error");
    //res.locals.success = req.flash("success");
    next()
})
//using routes
app.use('/', authRoute)
app.use('/farms', farmRoute)


//connecting Mongoose
const url = process.env.DATABASEURL || DBURI || 'mongodb://localhost:27017/farmTreasureProject';
mongoose.connect(url)
    .then(() => console.log('mongodb running'))
    .catch((err) => console.log('error', err))



//Port
const port = process.env.PORT || 3000
app.listen(port, () => {
    console.log('farmTreasure server running')
})

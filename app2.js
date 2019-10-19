
require('dotenv').config()
const DBURI = process.env.DBURI
const express = require('express')
const bodyPaser = require('body-parser')
const mongoose = require('mongoose')
const passport = require('passport')
const flash =require('connect-flash')
const localStrategy = require('passport-local')
const app = express()

//models
Farm = require('./model/farm')
User = require('./model/user')
// const router=require('./routes/routes')

//Password or Authentication
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

app.use(bodyPaser.urlencoded({ extended: true }))
app.set('view engine', 'ejs')

app.use(flash())


//Header display in all page
app.use((req, res, next) => {
    res.locals.currentUser = req.user
    next()
})

//connecting Mongoose
mongoose.connect('mongodb://localhost:27017/farmTreasure', { useNewUrlParser: true })
    .then(() => console.log('mongodb running'))
    .catch((err) => console.log('error', err))

//Routes

//Route for list of farms
app.get('/farms', (req, res) => {
    console.log(req.user)
    Farm.find({}, function (err, allfarms) {
        if (err) {
            console.log(err)
        } else {
            res.render("farms", { farms: allfarms, currentUser: req.user })
        }
    })
})

app.post('/farms', (req, res) => {
    const name = req.body.name
    const image = req.body.image
    const description = req.body.description
    const newFarms = { name: name, image: image, description: description }
    Farm.create(newFarms, function (err, newlyCreated) {
        if (err) {
            console.log(err)
        } else {
            res.redirect('/farms')
        }
    })
})

//Route for form
app.get('/farms/form', (req, res) => {
    res.render('form.ejs')
})

//Note: Ensure this route is last ortherwise it will by default overide other routes related to the model.
//This get request ensures that every farm maintains its own id.
app.get('/farms/:id', (req, res) => {
    Farm.findById(req.params.id, (err, foundFarm) => {
        if (err) {
            console.log('error ocurred')
        } else {
            res.render("display", { farms: foundFarm })
        }
    })
})

//Route for home page
app.get('/', (req, res) => {
    res.render('home')
})


//Route for userProfile
app.get('/userProfile', (req, res) => {
    res.render('userProfile')
})

//Route for sign up
app.get('/register', (req, res) => {
    res.render('register')
})
app.post('/register', (req, res) => {
    const newUser = new User({ username: req.body.username })
    User.register(newUser, req.body.password, (err, user) => {
        if (err) {
            console.log(err);
            return res.render("register") 
        }
        passport.authenticate("local")(req, res, () => {
            res.redirect("/login")
        });
    });
});

// Route for login
app.get('/login', (req, res) => {
    res.render('login')
})

// app.post login structure('/login',middleware, callback)
app.post('/login', passport.authenticate('local',
    {
        successRedirect: "/farms",
        failureRedirect: "/login",
    }),
    (req, res) => {
    })


//Route for logout
app.get('/logout', (req, res) => {
    req.logout()
    res.redirect('/')
})

const port = process.env.PORT || 3000
app.listen(port, () => {
    console.log('farmTreasure server running')
})

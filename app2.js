

require('dotenv').config()
const DBURI = process.env.DBURI
const express = require('express')
const bodyPaser = require('body-parser')
const mongoose = require('mongoose')
const passport = require('passport')
const localStrategy = require('passport-local')
const app = express()

Farm = require('./model/farm')
User = require('./model/user')
// const router=require('./routes/routes')

//Password
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


mongoose.connect('mongodb://localhost:27017/farmTreasure', { useNewUrlParser: true })
    .then(() => console.log('mongodb running'))
    .catch((err) => console.log('error', err))


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
            res.redirect("/farms")
        });
    });
});


//Routes
app.get('/', (req, res) => {
    res.render('home')
})

app.get('/farms', (req, res) => {
    Farm.find({}, function (err, allfarms) {
        if (err) {
            console.log(err)
        } else {
            res.render("farms", { farms: allfarms })
        }
    })
})


// const farms = [
//     { name: "Our Farm", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRH5nWzmSf_uhpCIIddLMfdwgDzoOZhq070yViuSRr_eq1a3Do24-Wd0-gsVQ" },
//     { name: "Ota Farm", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS9JSPGHh0JPGGvn4n1LiTn_J7W7VNgjbn8ozDC2UrWe1Nh1b44xX2ckXdB1Q" },
//     { name: "Sabi Farm", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRuW5StkQEf9JafgigDI9T8z_LBt9RAN5wmPhUQZP3lDtv8mKDzUn63XauRGQ" },
// ]

// //Hard coded render format of farms having the above array  
// app.get('/farms', (req, res) => { 
// res.render("farms", { farms: farms })
//  })

//Getting data from users
// app.post('/farms', (req, res) => {
//     const name = req.body.name
//     const image = req.body.image
//     const newFarms = { name: name, image: image }
//     farms.push(newFarms)
//     res.redirect('/farms')
// })


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

app.get('/farms/form', (req, res) => {
    res.render('form.ejs')
})

//Note: Ensure this route is least to avoid routing other paths by default.
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

app.get('/login', (req, res) => {
    res.render('login')
})


//Login in
// app.post('/login',middleware, callback)

app.post('/login', passport.authenticate('local',
 
{
     successRedirect: "/farms",
      failureRedirect: "/login" }),
    (req,res)=>{

 })



const port = process.env.PORT || 3000
app.listen(port, () => {
    console.log('farmTreasure server running')
})

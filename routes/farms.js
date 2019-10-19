const express = require('express')
const bodyPaser = require('body-parser')
const router = express.Router()


//middleware for authenticating user
function isLoggedIn(req,res,next){
    if(req.isAuthenticated()){
        return next()
    }
    res.redirect("/login")
}

//Route for list of farms
router.get('/',isLoggedIn, (req, res) => {
    console.log(req.user)
    Farm.find({}, function (err, allfarms) {
        if (err) {
            console.log(err)
        } else {
            res.render("farms", { farms: allfarms, currentUser: req.user })
        }
    })
})

router.post('/', (req, res) => {
    const name = req.body.name
    const image = req.body.image
    const description = req.body.description
    const address = req.body.address
    const email = req.body.email
    const contact = req.body.contact
    const newFarms = {
        name: name, image: image, description: description,
        address: address, email: email, contact: contact
    }
    Farm.create(newFarms, function (err, newlyCreated) {
        if (err) {
            console.log(err)
        } else {
            res.redirect('/farms')
        }
    })
})

//Route for form
router.get('/form',isLoggedIn, (req, res) => {
    res.render('form.ejs')
})

//Note: Ensure this route is last ortherwise it will by default overide other routes related to the model.
//This get request ensures that every farm maintains its own id.
router.get('/:id', (req, res) => {
    Farm.findById(req.params.id, (err, foundFarm) => {
        if (err) {
            console.log('error ocurred')
        } else {
            res.render("display", { farms: foundFarm })
        }
    })
})



module.exports = router
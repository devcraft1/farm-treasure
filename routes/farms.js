const express=require('express')
const bodyPaser = require('body-parser')
const router=express.Router()


//Route for list of farms
router.get('/', (req, res) => {
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
router.get('/form', (req, res) => {
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


module.exports=router
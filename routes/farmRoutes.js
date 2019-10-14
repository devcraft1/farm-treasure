const express = require('express')
const bodyPaser = require('body-parser')


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

module.exports=routes;

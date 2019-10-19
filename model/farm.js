
const mongoose = require('mongoose')


const farmSchema = new mongoose.Schema({
    name: String,
    image: String,
    description: String,
    address:String,
    email:String,
    contact:String
})

module.exports = mongoose.model('Farm', farmSchema);


// Farm.create(
//     {
//         name: "Our Farm",
//         image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRH5nWzmSf_uhpCIIddLMfdwgDzoOZhq070yViuSRr_eq1a3Do24-Wd0-gsVQ",
//         description: "This Farm supplies majorly fibre crops"
//     }, function (err, farm) {
//         if (err) {
//             console.log('err')
//         } else {
//             console.log('newlyCreated')
//             console.log(farm)
//         }
//     })

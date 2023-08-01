const mongoose = require('mongoose')

var couponSheman = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        uppercase: true
    },
    expiry:{
        type: Date,
        // required: true
    },
    discount:{
        type: Number,
        required: true
    }
})

//export the model
module.exports = mongoose.model('Coupon',couponSheman)
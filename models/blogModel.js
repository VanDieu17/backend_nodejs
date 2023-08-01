const mongoose = require('mongoose')

var blogShema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description:{
        type: String,
        required: true
    },
    category:{
        type: String,
        required: true
    },
    image: [],

},{timetamps : true})

module.exports = mongoose.model('Blog', blogShema)
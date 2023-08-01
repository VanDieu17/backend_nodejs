const mongoose = require('mongoose');

var sizeSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        unique: true
    }
},{
    timmestamps : true,
})

module.exports = mongoose.model('Size', sizeSchema)
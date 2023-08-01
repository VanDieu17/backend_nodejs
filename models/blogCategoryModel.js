const mongoose = require('mongoose')

var blogCatagorySchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,        
    }
}, {timestamps: true}
)

module.exports = mongoose.model('BlogCategory', blogCatagorySchema)
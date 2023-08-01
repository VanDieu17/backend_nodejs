const mongoose = require('mongoose')

var catSchema = new mongoose.Schema({
    title:{
        type: String,
        required: true,
        unique: true
    }
},{
    timestamps: true
}
)

module.exports = mongoose.model('Category', catSchema);
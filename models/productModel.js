const mongoose  = require('mongoose')
const bcrypt = require('bcrypt')

var productSchema = new mongoose.Schema({
    title:{
        type: String,
        required: true,
        trim: true
    },
    slug:{
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    description:{
        type: String,
        required: true
    },
    price:{
        type: Number,
        required: true
    },
    category:{
        type: String,
        required: true
    },
    brand:{
        type: String,
        required: true
    },
    quantity:{
        type: Number,
        require: true
    },
    sold:{
        type: Number,
        default: 0,
    },
    color:{
        type: String,
        required: true
    },
    size:{
        type: Number,
        required: true
    },
    image:[{
        public_id: String,
        url:String,
    }],
    tags: {
        type: String,
    },
    ratings: [{
        star: Number,
        comment:String,
        postedby : {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    }],
    totalrating: {
        type: String,
        default:0
    }

},{ timestamps : true})

module.exports = mongoose.model('Product',productSchema)
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const asyncHandler  = require('express-async-handler')
const validateMongoDBId = require('../utils/validateMongoDBID')
var userSchema = new mongoose.Schema({
    fullname: {
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    mobile:{
        type: String,
        required: true,
        unique: true
    },
    isBlocked: {
        type: Boolean,
        default: false
    },
    role:{
        type: String,
        default: "user",
    },
    cart:{
        type: Array,
        default: []
    },
    address:{
        type: String,
    },
    wishlist:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product"
    }],
    refreshToken:{
        type: String,
    },
    passwordChangedAt: Date, 
    passwordResetToken: String,
    passwordResetExpires: Date,
},{
    timestamps: true
}
)

//hasing password
userSchema.pre('save' , async function(next){
    if(!this.isModified("password")){
        next()
    }
    const salt = await bcrypt.genSaltSync(10)
    this.password = await bcrypt.hash(this.password, salt)
    next()
})

//kiem tra password
userSchema.methods.isPasswordMatched = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};
  
  const User = mongoose.model('User', userSchema);
  
  module.exports = User;

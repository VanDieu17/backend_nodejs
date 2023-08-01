const coupon = require('../models/couponModel')
const asyncHandler = require('express-async-handler')
const validateMongoDBId = require('../utils/validateMongoDBID')

const createCoupon = asyncHandler (async (req , res)=>{
    try{
        const newCoupon = await coupon.create(req.body)
        res.json(newCoupon)
    }catch(e){
        throw new Error(e)
    }
})

const updateCoupon = asyncHandler(async (req, res) =>{
    const {id} = req.params
    validateMongoDBId(id)
    try{
        const updateCoupon = await coupon.findByIdAndUpdate(id, req.body, {
            new : true
        })
        res.json(updateCoupon)
    }catch(e){
        throw new Error (e)
    }
})
const deleteCoupon = asyncHandler(async (req, res) => {
    const {id} = req.params
    validateMongoDBId(id)
    try{
        const deleteCoupon = await coupon.findByIdAndDelete(id)
        res.json(deleteCoupon)
    }catch(e){
        throw new Error(e)
    }
})
const getCoupon = asyncHandler(async (req, res) => {
    const {id} = req.params
    validateMongoDBId(id)
    try{
        const getCoupon = await coupon.findById(id)
        res.json(getCoupon)
    }catch(e){
        throw new Error(e)
    }
})

const getAllCoupon = asyncHandler(async (req, res) => {
    try{
        const getAllCoupon = await coupon.find()
        res.json(getAllCoupon)
    }catch(e){
        throw new Error(e)
    }
})

module.exports = {
    createCoupon,
    updateCoupon,
    deleteCoupon,
    getCoupon,
    getAllCoupon
}
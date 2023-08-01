const brand = require('../models/brandModel')
const asyncHandler = require('express-async-handler')
const validateMongoDBID = require('../utils/validateMongoDBID')


const createBrand = asyncHandler(async (req, res) => {
    try{
        const newBrand = await brand.create(req.body)
        res.json(newBrand)
    }catch(err){
        throw new Error(err)
    }
})

const updateBrand = asyncHandler(async (req, res) =>{
    const {id} = req.params
    validateMongoDBID(id)
    try{
        const updateBrand = await brand.findByIdAndUpdate(id, req.body, {
            new: true,
        })
        res.json(updateBrand)
    }catch(err){
        throw new Error(err)
    }
})

const deleteBrand = asyncHandler(async (req, res) => {
    const {id} = req.params
    try{
        const deleteBrand = await brand.findByIdAndDelete(id)
        res.json(deleteBrand)
    }catch(err){
        throw new Error(err)
    }
})

const getBrand = asyncHandler(async (req, res) => {
    const {id} = req.params
    validateMongoDBID(id)
    try{
        const getBrand = await brand.findById(id)
        res.json(getBrand)
    }catch(err){
        throw new Error(err)
    }
})

const getAllBrand = asyncHandler(async (req, res) => {
    try{
        const getAllBrand = await brand.find()
        res.json(getAllBrand)
    }catch(err){
        throw new Error(err)
    }
})

module.exports = {
    createBrand: createBrand,
    updateBrand,
    deleteBrand,
    getBrand,
    getAllBrand
}
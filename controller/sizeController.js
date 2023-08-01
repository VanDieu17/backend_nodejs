const size = require('../models/sizeModel')
const asyncHandler = require('express-async-handler')
const validateMongoDBID = require('../utils/validateMongoDBID')

const createSize = asyncHandler(async (req, res) => {
    try{
        const newSize = await size.create(req.body)
        res.json(newSize)
    }catch(err){
        throw new Error(err)
    }
})

const updateSize = asyncHandler(async (req,res) => {
    const {id} = req.params
    validateMongoDBID(id)
    try{
        const updateSize = await size.findByIdAndUpdate(id, req.body, {
            new: true
        })
        res.json(updateSize)
    }catch(err){
        throw new Error(err)
    }
})

const deleteSize = asyncHandler(async (req,res) => {
    const {id} = req.params
    validateMongoDBID(id)
    try{
        const deleteSize = await size.findByIdAndDelete(id)
        res.json(deleteSize)
    }catch(err){
        throw new Error(err)
    }
})

const getSize = asyncHandler(async (req, res) => {
    const {id} = req.params
    validateMongoDBID(id)
    try{
        const getSize = await size.findById(id)
        res.json(getSize)
    }catch(err){
        throw new Error(err)
    }
})

const getAllSize = asyncHandler(async (req, res) => {
    try{
        const getSize = await size.find()
        res.json(getSize)
    }catch(err){
        throw new Error(err)
    }
})

module.exports = {
    createSize,
    updateSize,
    deleteSize,
    getSize,
    getAllSize
}
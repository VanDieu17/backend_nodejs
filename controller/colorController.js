const color = require('../models/colorModel')
const asyncHandler = require('express-async-handler')
const validateMongoDBId = require('../utils/validateMongoDBID')

const createColor = asyncHandler(async (req, res) => {
    try{
        const newColor = await color.create(req.body)
        res.json(newColor)
    }catch(err){
        throw new Error(err)
    }
})

const updateColor = asyncHandler(async (req,res) => {
    const {id} = req.params
    validateMongoDBId(id)
    try{
        const updateColor = await color.findByIdAndUpdate(id, req.body, {
            new: true
        })
        res.json(updateColor)
    }catch(err){
        throw new Error(err)
    }
})

const deleteColor = asyncHandler(async (req,res) => {
    const {id} = req.params
    validateMongoDBId(id)
    try{
        const deleteColor = await color.findByIdAndDelete(id)
        res.json(deleteColor)
    }catch(err){
        throw new Error(err)
    }
})

const getColor = asyncHandler(async (req, res) => {
    const {id}= req.params
    validateMongoDBId(id)
    try{
        const getColor = await color.findById(id)
        res.json(getColor)
    }catch(err){
        throw new Error(err)
    }
})

const getAllColor = asyncHandler(async (req, res) => {
    try{
        const getColor = await color.find()
        res.json(getColor)
    }catch(err){
        throw new Error(err)
    }
})

module.exports = {
    createColor,
    updateColor,
    deleteColor,
    getColor,
    getAllColor
}
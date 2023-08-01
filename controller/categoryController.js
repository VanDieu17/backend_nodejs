const Category = require('../models/categoryModel')
const asyncHandler = require('express-async-handler');
const validateMongoDBID = require('../utils/validateMongoDBID');

const createCategory = asyncHandler(async (req, res) => {
    try{
        const newCategory = await Category.create(req.body)
        res.json(newCategory)
    }
    catch(e){
        throw new Error(e)
    }
})

const updateCategory = asyncHandler(async (req, res) => {
    const {id} = req.params
    validateMongoDBID (id)
    try{
        const updateCategory = await Category.findByIdAndUpdate(id, req.body, {
            new:true,
        })
        res.json(updateCategory)
    }catch(e){
        throw new Error(e)
    }
})

const deleteCategory = asyncHandler(async (req, res) => {
    const {id} = req.params
    validateMongoDBID (id)
    try{
        const deleteCategory = await Category.findByIdAndDelete(id)
        res.json(deleteCategory)
    }catch(e){
        throw new Error(e)
    }
})

const getCategory = asyncHandler(async (req, res) => {
    const {id} = req.params
    validateMongoDBID (id)
    try{
        const getCategory = await Category.findById(id)
        res.json(getCategory)
    }catch(e){
        throw new Error(e)
    }
})

const getAllCategory = asyncHandler(async (req, res) => {
    try{
        const getCategory = await Category.find()
        res.json(getCategory)
    }catch(e){
        throw new Error(e)
    }
});

module.exports = {
    createCategory,
    updateCategory,
    deleteCategory,
    getCategory,
    getAllCategory
}
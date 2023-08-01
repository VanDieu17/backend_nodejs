const blogCategory = require('../models/blogCategoryModel')
const asyncHandler = require('express-async-handler')
const validateMongoDBID = require('../utils/validateMongoDBID')

const createBlogCategory = asyncHandler(async (req, res) => {
    try{
        const newBlogCategory = await blogCategory.create(req.body)
        res.json(newBlogCategory)
    }catch(e){
        throw new Error(e)
    }
})

const updateBlogCategory = asyncHandler(async (req, res) => {
    const {id} = req.params
    validateMongoDBID(id)
    try{
        const updateBlogCategory = await blogCategory.findByIdAndUpdate(id, req.body, {
            new : true
        })
        res.json(updateBlogCategory)
    }catch(e){
        throw new Error(e)
    }
})

const deleteBlogCategory = asyncHandler(async (req,res) => {
    const {id} = req.params
    validateMongoDBID(id)
    try{
        const deleteBlogCategory = await blogCategory.findByIdAndDelete(id)
        res.json(deleteBlogCategory)
    }
    catch(e){
        throw new Error(e)
    }
})

const getBlogCategory = asyncHandler(async (req,res) => {
    const {id} = req.params
    validateMongoDBID(id)
    try{
        const getBlogCategory = await blogCategory.findById(id)
        res.json(getBlogCategory)
    }catch(e){
        throw new Error(e)
    }
})

const getAllBlogCategory = asyncHandler(async (req,res) => {
    try{
        const getAllBlogCategory = await blogCategory.find()
        res.json(getAllBlogCategory)
    }catch(e){
        throw new Error(e)
    }
})

module.exports = {
    createBlogCategory,
    updateBlogCategory,
    deleteBlogCategory,
    getAllBlogCategory,
    getBlogCategory
}
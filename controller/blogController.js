const blog = require('../models/blogModel')
const asyncHandler = require('express-async-handler')
const validateMongoDBID = require('../utils/validateMongoDBID')

const createBlog = asyncHandler(async (req, res) => {
    try{
        const newBlog = await blog.create(req.body)
        res.json(newBlog)
    }catch(e){
        throw new Error(e)
    }
})

const updateBlog = asyncHandler(async (req, res) => {
    const {id} = req.params
    validateMongoDBID(id)
    try{
        const updateBlog = await blog.findByIdAndUpdate(id, req.body,{
            new:true
        })
        res.json(updateBlog)
    }catch(err){
        throw new Error(err)
    }
})

const deleteBlog = asyncHandler(async (req, res) => {
    const {id} = req.params
    validateMongoDBID(id)
    try{
        const deleteBlog = await blog.findByIdAndDelete(id)
        res.json(deleteBlog)
    }catch(e){
        throw new Error(e)
    }
})  
const getBlogById = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongoDBID(id);
    try {
        const getBlogById = await blog.findById(id);
        res.json(getBlogById)
    } catch (e) {
        throw new Error(e);
    }
})

const getAllBlog = asyncHandler(async (req, res) => {
    try {
      const getAllBlog = await blog.find();
      res.json(getAllBlog);
    } catch (e) {
      throw new Error(e);
    }
  })

module.exports = {
    createBlog,
    updateBlog,
    deleteBlog,
    getAllBlog,
    getBlogById
}

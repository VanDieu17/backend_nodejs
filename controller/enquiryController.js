const enquiry = require('../models/enquiryModel')
const asyncHandler = require('express-async-handler')
const validateMongoDBId = require('../utils/validateMongoDBID')

const createEnquiry = asyncHandler (async (req , res)=>{
    try{
        const newEnquiry = await enquiry.create(req.body)
        res.json(newEnquiry)
    }catch(e){
        throw new Error(e)
    }
})

const updateEnquiry = asyncHandler(async (req, res) =>{
    const {id} = req.params
    validateMongoDBId(id)
    try{
        const updateEnquiry = await enquiry.findByIdAndUpdate(id, req.body, {
            new : true
        })
        res.json(updateEnquiry)
    }catch(e){
        throw new Error (e)
    }
})
const deleteEnquiry = asyncHandler(async (req, res) => {
    const {id} = req.params
    validateMongoDBId(id)
    try{
        const deleteEnquiry = await enquiry.findByIdAndDelete(id)
        res.json(deleteEnquiry)
    }catch(e){
        throw new Error(e)
    }
})
const getEnquiry = asyncHandler(async (req, res) => {
    const {id} = req.params
    validateMongoDBId(id)
    try{
        const getEnquiry = await enquiry.findById(id)
        res.json(getEnquiry)
    }catch(e){
        throw new Error(e)
    }
})

const getAllEnquiry = asyncHandler(async (req, res) => {
    try{
        const getAllEnquiry = await enquiry.find()
        res.json(getAllEnquiry)
    }catch(e){
        throw new Error(e)
    }
})

module.exports = {
    createEnquiry,
    updateEnquiry,
    deleteEnquiry,
    getEnquiry,
    getAllEnquiry
}
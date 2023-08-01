const express = require('express')
const{authMiddleware, isAdmin} = require('../middlewares/authMiddleware')
const {
    createBlogCategory,
    updateBlogCategory,
    deleteBlogCategory,
    getBlogCategory,
    getAllBlogCategory
} = require('../controller/blogCategoryController')

const router = express.Router()

router.get('/:id',getBlogCategory)
router.get('/',getAllBlogCategory)
router.post('/',authMiddleware, isAdmin, createBlogCategory)
router.delete('/:id',authMiddleware, isAdmin, deleteBlogCategory)
router.put('/:id',authMiddleware, isAdmin, updateBlogCategory)

module.exports = router
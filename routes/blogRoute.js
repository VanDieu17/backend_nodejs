const express = require('express')
const { authMiddleware, isAdmin } = require('../middlewares/authMiddleware')
const {
    createBlog,
    updateBlog,
    deleteBlog,
    getAllBlog,
    getBlogById
} = require ('../controller/blogController')

const router = express.Router()

router.get('/',getAllBlog)
router.get('/:id',getBlogById)

router.put('/:id',authMiddleware,isAdmin,updateBlog)
router.delete('/:id',authMiddleware,isAdmin,deleteBlog)

router.post('/',authMiddleware,isAdmin, createBlog)

module.exports = router
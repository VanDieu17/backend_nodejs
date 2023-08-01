const express = require('express')
const {authMiddleware, isAdmin} = require('../middlewares/authMiddleware')
const {
    createProduct,
    getProduct,
    getAllProduct,
    updateProduct,
    deleteProduct,
    addToWishList,
    rating,
} = require('../controller/productController')

const router = express.Router()

router.get('/:id', getProduct)
router.get('/',getAllProduct)

//người dùng đánh giá và thêm sản phẩm vào mục yêu thích
router.put('/wishlist',authMiddleware, addToWishList)
router.put('/rating',authMiddleware, rating)

//ADMIN thao tác
router.post('/',authMiddleware, isAdmin, createProduct)
router.put('/:id',authMiddleware, isAdmin, updateProduct)
router.delete('/:id',authMiddleware, isAdmin, deleteProduct)


module.exports = router
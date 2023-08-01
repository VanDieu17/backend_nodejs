const express = require('express')

const {
    createCoupon,
    updateCoupon,
    deleteCoupon,
    getCoupon,
    getAllCoupon
} = require('../controller/couponController')

const {authMiddleware, isAdmin} = require('../middlewares/authMiddleware')

const router = express.Router()

router.get('/:id', getCoupon)
router.get('/', getAllCoupon)

router.post('/',authMiddleware,isAdmin, createCoupon)
router.put('/:id',authMiddleware,isAdmin,updateCoupon)
router.delete('/:id',authMiddleware,isAdmin, deleteCoupon)


module.exports = router
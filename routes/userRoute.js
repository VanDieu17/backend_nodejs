const express = require('express')
const {
    createUser,
    loginUser,
    logoutUser,
    getUser,
    getAllUsers,
    updateUser,
    deleteUser,
    blockUser,
    unblockUser,
    handlerRreshToken,
    updatePassword,
    forgotPasswordToken,
    resetPassword,
    loginAdmin,
    getWishList,
    saveAddress,
    userCart,
    getUserCart,
    emptyCart,
    applyCoupon,
    createOrder,
    getOrder,
    getAllOrders,
    getOrderByUserId,
    updateOrderStatus,
    
} = require('../controller/userController')

const {
    authMiddleware,
    isAdmin
} = require('../middlewares/authMiddleware')

const router = express.Router()

//Login/logout/Đăng ký
router.post('/register', createUser)
router.post('/login-user',loginUser)
router.post('/login-admin',loginAdmin)
router.get('/refresh', handlerRreshToken)
router.get('/logout', logoutUser)

//Xử lý password
router.put('/updatePassword/', authMiddleware,updatePassword)
router.post('/forgotPasswordToken',forgotPasswordToken)
router.put('/resetPassword/:token',resetPassword)

//Chức năng mà người dùng thực thi 
router.put('/:id',authMiddleware,updateUser)
router.put('/saveAddress/:id',authMiddleware, saveAddress)
router.get('/wishlist',authMiddleware, getWishList)

//Xử lý giỏ hàng
router.post('/userCart',authMiddleware,userCart)
router.get('/getUserCart', authMiddleware,getUserCart)
router.delete('/emptycart',authMiddleware,emptyCart)
router.post('/cart/applyCoupon',authMiddleware,applyCoupon)

//xử lý đơn đặt hàng/ hóa đơn
router.post('/cart/order',authMiddleware,createOrder)
router.get('/get-order',authMiddleware,getOrder)
router.post('/getOrderByUser/:id',authMiddleware,getOrderByUserId)

//Admin xử lý tài khoản của User
router.get('/',getAllUsers)
router.get('/:id',getUser)
router.delete('/:id',deleteUser)
router.put('/block-user/:id',authMiddleware, isAdmin, blockUser)
router.put('/unblock-user/:id',authMiddleware, isAdmin,unblockUser)

//Admin xử lý đơn hàng
router.get('/getAllOrders',authMiddleware, isAdmin, getAllOrders)
router.put('/order/updateOrder/:id',authMiddleware, isAdmin, updateOrderStatus)


module.exports = router
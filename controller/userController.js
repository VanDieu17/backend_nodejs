const {generateToken} = require('../config/jsonwebToken')
const {generateRefreshToken} = require('../config/refreshToken')

const User = require('../models/userModel')
const Cart = require('../models/cartModel')
const Product = require('../models/productModel')
const Coupon = require('../models/couponModel')
const Order = require('../models/orderModel')

const asyncHandler  = require('express-async-handler')
const validateMongoDBId = require('../utils/validateMongoDBID')
const jwt = require('jsonwebtoken')
const crypto = require('crypto')
const uniqid = require('uniqid') // tạo id

//Đăng ký tài khoản
const createUser = asyncHandler(async (req, res) => {
    const email = req.body.email
    const findUser = await User.findOne({email: email})
    if(!findUser){
        const newUser = await User.create(req.body)
        res.json(newUser)
    }else{
        throw new Error("Email đã tồn tại")
    }
})

//login đối với user
const loginUser = asyncHandler(async (req, res) => { // sử dụng asyncHandler để xử lý bất đồng bộ
    const { email, password } = req.body; //yêu cầu gửi từ client chứa dữ liệu "email" và "password" trong phần thân (body) 
    // Kiểm tra đăng nhập
    const findUser = await User.findOne({ email });// tìm 1 người dùng dựa trên csdl trên 'email' đã cung cấp
    if (findUser && findUser.isPasswordMatched(password)) { //kt người dùng có tồn tại và mật khẩu có khớp qua phương thức isPasswordMatched 
      const refreshToken = await generateRefreshToken(findUser?._id) //tạo mã thông báo làm mới (refresh token) dựa trên id của người dùng tìm thấy.
      const updateUser = await User.findByIdAndUpdate( // cập nhật người dùng trong csdl
        findUser._id,
        {
          refreshToken: refreshToken, // tái xác thực khi mã thông báo truy cập hết hạn
        },
        {
          new: true,
        }
      );
      res.cookie('refreshToken', refreshToken, {
        httpOnly: true, // chỉ có thể truy cập qua Http 
        maxAge: 72 * 60 * 60 * 1000, //thời gian tồn tại của cookie
      });
      // gửi phản hồi thông tin người dùng đã đăng nhập thành công
      res.json({
        _id: findUser?._id,
        fullname: findUser?.fullname,
        email: findUser?.email,
        mobile: findUser?.mobile,
        token: generateToken(findUser?._id), // mã thông báo access token
      });
    } else {
      throw new Error("Thông tin không hợp lệ");
    }
  });

// Xử lý refreshToken
const handlerRreshToken = asyncHandler (async (req, res) => {
    const cookie = req.cookies
    if(!cookie?.refreshToken){
        throw new Error("No refresh token in Cookies")
    }
    const refreshToken = cookie.refreshToken
    const user = await User.findOne({refreshToken})
    if(!user) throw new Error("No refresh Token in dc or not matchesd")
    jwt.verify(refreshToken, process.env.JWT_SECRET, (err, decoded) => {
        if(err || user.id !== decoded.id){
            throw new Error("Có lỗi xảy ra khi refresh Token")
        }
        const accessToken = generateToken(user?._id)
        res.json({accessToken})
    })
})

//login đối với ADMIN
const loginAdmin = asyncHandler(async (req, res) => {
    const {email, password} =req.body
    // check đăng nhập
    const findAdmin = await User.findOne({email})
    if(findAdmin.role !== 'admin') throw new Error("Xác minh không thành công")
    if(findAdmin && (await findAdmin.isPasswordMatched(password))){
        const refreshToken = generateRefreshToken(findAdmin?._id)
        const updateUser = await User.findByIdAndUpdate(
            findAdmin.id,
            {
                refreshToken : refreshToken,
            },{
                new:true
            }
        )
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true, 
            maxAge: 72 * 60 * 60 * 1000, 
          });
          
          res.json({
            _id: findAdmin?._id,
            fullname: findAdmin?.fullname,
            email: findAdmin?.email,
            mobile: findAdmin?.mobile,
            token: generateToken(findAdmin?._id), 
          });
    } else {
          throw new Error("Thông tin không hợp lệ");
        }
})

//logout
const logoutUser = asyncHandler (async (req, res) => {
    const cookie = req.cookies
    if(!cookie?.refreshToken) throw new Error("No refresh token in cookie")
    const refreshToken = cookie.refreshToken
    const user = await User.findOne({refreshToken})
    if(!user){
        res.clearCookie("refreshToken", {
            httpOnly: true,
            secure: true
        })
        return res.sendStatus(204)
    }
    await User.findOneAndUpdate({refreshToken},{
        refreshToken: ""
    })
    res.clearCookie("refreshToken", {
        httpOnly:true,
        secure: true
    })
    res.sendStatus(204)
})

//Lấy ra 1 tài khoản
const getUser = asyncHandler (async (req, res) => {
    const {id} = req.params
    validateMongoDBId(id)
    try{
        const getUser = await User.findById(id)
        res.json(getUser)
    }catch(err){
        throw new Error(err)
    }
})

//Lấy tất cả các tài khoản
const getAllUsers = asyncHandler (async (req, res) => {
    try{
        const getAllUser = await User.find()
        res.json(getAllUser)
    }catch(err){
        throw new Error(err)
    }
})

//chỉnh sửa thông tin dành cho người dùng
const updateUser = asyncHandler(async (req, res) => {
    const {_id} = req.params
    validateMongoDBId(_id)
    try{
        const updateUser = await User.findByIdAndUpdate(
            _id,
            {
                fullName: req?.body.fullName,
                email: req?.body.email,
                mobile: req?.body.mobile
            },
            {new:true,}
        )
        res.json(updateUser)
    }catch(err){
        throw new Error(err)
    }
})

// Xóa người dùng
const deleteUser = asyncHandler (async (req, res) => {
    const {id} = req.params
    validateMongoDBId(id)
    try{
        const deleteUser = await User.findByIdAndDelete(id)
        res.json(deleteUser)
    }catch(err){
        throw new Error(err)
    }
})

//Block user
const blockUser = asyncHandler(async (req, res) =>{
    const {id} = req.params // trích xuất giá trị id, client gửi yêu cầu với tham số 'id' trong url
    validateMongoDBId(id) // kiểm tra id 
    try{
        const blockUser = await User.findByIdAndUpdate(id, // tìm và cập nhật
            {
                isBlocked: true, // đã block 
            },
            {
                new: true
            }
        )
        res.json(blockUser) // phản hồi thông tin người dùng đã chặn thành công
    }catch(e){
        throw new Error(e)
    }
    
})

//Bỏ block user
const unblockUser = asyncHandler (async (req,res) =>{
    const {id} = req.params
    validateMongoDBId(id)
    try{
        const unblockUser = await User.findByIdAndUpdate(
            id,
            {
                isBlocked: false,
            },{
                new: true
            }
        )
        res.json(unblockUser)
    }catch(e){
        throw new Error(e)
    }
})

//đổi mật khẩu
const updatePassword = asyncHandler (async (req,res) => {
    const { _id } = req.user
    const { password } = req.body
    validateMongoDBId(_id)
    const user = await User.findById(_id) // tìm người dùng dựa trên id 
    //kt password có tồn tại không
    if(password){ 
        user.password = password // cập nhật lại mật khẩu đã đổi
        const updatePassword = await user.save() // lưu lại mật khẩu và gán cho biến updatePassword
        res.json(updatePassword) // gửi lại phản hồi  
    }else{
        res.json(user)  
    }
})

//quên mật khẩu
const forgotPasswordToken = asyncHandler (async (req, res) => {
    const {email} = req.body
    const user = await User.findOne({email})
    if(!user) {
        throw new Error ('Email not found')
    }
    try{
        const token = await User.createPasswordResetToken() // tạo mã thông báo (token) cho việc đặt lại mật khẩu
        await User.save() // lưu trữ người dùng được cập nhật 
        const resetURL = `Bấm vào link để đặt laij5 mật khẩu của bạn. Link sẽ vô hiệu sau 10 phút!
                            <a href='https://localhost:3000/reset-password/${token}'>
                            Bấm vào đây </a>`
        //Tạo đối tượng chứa các thông tin để gửi email cho người dùng
        const data = {
            to: email,
            next: "Hello User",
            subject: 'Link lấy lại mật khẩu',
            htm: resetURL
        }
        sendEmail(data)
        res.json(token) // gửi phản hồi với mã thông báo (token) được tạo
    }catch (e) {
        throw new Error(e)
    }
})

const resetPassword = asyncHandler(async (req, res) => {
    const {password} =req.body
    const {token} = req.params
    //Tạo mã băm
    const hashedToken = crypto 
        .createHash('sha256')
        .update(token)
        .digest('hex')
    const user = await User.findOne({ // tìm người dùng trong csdl
        passwordResetToken: { // đk là passwordResetToken phải lớn hơn thời gian hiện tại date.now()
            $gt: Date.now()
        }
    })
    if(!user){
        throw new Error('Token đã hết hạn, vui lòng thử lại')
    }
    // cập nhật mật khẩu mới
    user.password = password
    // đặt lại giá trị 
    user.passwordResetToken = undefined
    user.passwordResetExpires = undefined
    await User.save()
    res.json(user)
})

//Lấy danh sách sản phẩm yêu thich
const getWishList = asyncHandler (async (req, res) => {
    const {_id} = req.user
    try{
        const findUSer = await User.findById(_id).populate('wishlist')
        res.json(findUSer)
    }catch(e){
        throw new Error (e)
    }
})

//lưu địa chỉ người dùng
const saveAddress = asyncHandler (async (req, res)=>{
    const {_id} = req.user
    validateMongoDBId(_id)
    try{
        const updateUser = await User.findByIdAndUpdate(
            _id,
            {
                address: req?.body?.address,
            },
            {
                new:true
            }
        )
        res.json(updateUser)
    }catch(e){
        throw new Error(e)
    }
})

//xử lý giỏ hàng 
const userCart = asyncHandler(async (req, res) => {
    const { cart } = req.body;
    const { _id } = req.user;
    
   
  validateMongoDBId(_id);
  
    try {
      let products = [];
      const user = await User.findById(_id);
  
      const alreadyExistCart = await Cart.findOne({ orderby: user._id });
      if (alreadyExistCart) {
        alreadyExistCart.remove();
      }
  
      if (Array.isArray(cart)) {
        for (let i = 0; i < cart.length; i++) {
          let object = {};
          object.product = cart[i]._id;
          object.count = cart[i].count;
          object.color = cart[i].color;
          object.size = cart[i].size;
  
          let getPrice = await Product.findById(cart[i]._id).select("price").exec();
          object.price = getPrice.price;
  
          products.push(object);
        }
      } else {
        throw new Error("Cart is not an array.");
      }
  
      
     
  let cartTotal = 0;
      for (let i = 0; i < products.length; i++) {
        cartTotal = cartTotal + products[i].price * products[i].count;
      }
  
      let newCart = await new Cart({
        products,
        cartTotal,
        orderby: user?._id,
      }).
     
  save();
  
      res.json(newCart);
    } catch (e) {
      throw new Error(e);
    }
  });
//Xem giỏ hàng
const getUserCart = asyncHandler (async (req,res) => {
    const {_id} = req.user;
    validateMongoDBId(_id)
    try{
        const viewcart = await Cart.findOne({orderby: _id}).populate("products.product") //lấy thông tin của các sản phẩm trong giỏ hàng từ collection "products"
        res.json(viewcart)
    }catch(e){
        throw new Error(e)
    }
})

//Xử lý giỏ hàng trống sau khi mua
const emptyCart = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    validateMongoDBId(_id);
    try {
        const user = await User.findOne({ _id });
        const cart = await Cart.findOneAndRemove({ orderby: user._id });
        res.json(cart);
    } catch (e) {
        throw new Error(e);
    }
  });

//áp mã giảm giá
const applyCoupon = asyncHandler (async (req, res) =>{
    const {coupon} = req.body
    const {_id} = req.user
    validateMongoDBId(_id)
    // kiểm tra xem mã giảm giá có tồn tại trong csdl không
    const valiCoupon = await Coupon.findOne({name: coupon}) //thay thế cái name bằng 1 cái mã random để người dùng tự nhập
    if(valiCoupon == null){
        throw new Error ('Mã giảm giá không hợp lệ')
    }
    const user = await User.findOne({_id}) // tìm kiếm người dùng với _id
    const {cartTotal} = await Cart.findOne({
        orderby: user._id,
    }).populate('products.product') // lấy thông tin chi tiết về sp trong giỏ hàng
    //Tính giá sau khi giảm
    const totalAfterDiscount = (cartTotal - (cartTotal * valiCoupon.discount) /100).toFixed(2)
    //Cập nhật giá giảm vào giỏ hàng
    await Cart.findOneAndUpdate(
        {orderby: user._id},
        {totalAfterDiscount},
        {new:true}
    )
    res.json(totalAfterDiscount)
})

//Đặt hàng
const createOrder = asyncHandler(async (req, res) => {
    // truy cập dữ liệu gửi từ người dùng
    const { COD, couponApplied} = req.body
    const { _id } = req.user
    validateMongoDBId(_id)
    try{
        if(!COD) {
            throw new Error ("Đặt hàng không thành công")
        }
        const user = await User.findById(_id) //tìm thông tin user
        // tìm giỏ hàng của người dùng
        let userCart = await Cart.findOne({orderby: user._id})
        let finalAmount = 0
        if(couponApplied && userCart.totalAfterDiscount) {
            finalAmount = userCart.totalAfterDiscount
        }
        else {
            finalAmount = userCart.cartTotal
        }
        //Tạo đơn hàng mới
        let newOrder = await new Order({
            products : userCart.products, // các sp trong giỏ hàng
            // thông tin thanh toán
            paymentIntent: {
                id: uniqid(), // tạo id thập lục phân tránh trùng lập id
                method: "COD",
                amount: finalAmount,
                status: "Thanh toán khi nhận hàng",
                created: Date.now(),
                currency: "Đồng",
            },
            orderby: user._id,
            // trạng thái đơn hàng
            orderStatus: "Thanh toán khi nhận hàng"
        }).save()
        //Cập nhật lại số lượng product trong csdl
        let update = userCart.products.map((item) => {
            return {
                updateOne: {
                    filter: {_id: item.product._id},
                    update: {$inc: {quantity: -item.count, sold: +item.count}}//cập nhật lại số lượng và số lượng đã bán
                }
            }
        })
        const updated = await Product.bulkWrite(update, {})
        res.json({message : "Thành công"})
    }catch(e){
        throw new Error(e)
    }
})

//lấy 1 đơn đặt hàng
const getOrder = asyncHandler(async (req, res) =>{
    const {_id} = req.user 
    validateMongoDBId(_id)
    try{
        const userOrder = await Order.findOne({orderby: _id}) // tìm kiếm các đơn đặt hàng
        // lấy thông tin của sp và người đặt
            .populate('products.product')
            .populate('orderby')
            .exec() // thực thi truy vấn
        res.json(userOrder)
    }catch(e){
        throw new Error(e)
    }
})

//Lấy tất cả các đơn đặt hàng
const getAllOrders = asyncHandler(async (req, res) => {
    try{
        const allUserOrders = await Order.find()
            .populate('products.product')
            .populate('orderby')
            .exec()
        res.json(allUserOrders)
    }catch(e){
        throw new Error(e)
    }
})

//lấy đơn hàng bởi _id của người dùng
const getOrderByUserId = asyncHandler (async (req, res) => {
    const {id} = req.params
    validateMongoDBId(id)
    try{
        const userOrder = await Order.findOne({orderby : id})
        .populate('products.product')
        .populate('orderby')
        .exec()
    res.json(userOrder)
    }catch(e){
        throw new Error(e)
    }
}) 

//chỉnh sửa tình trạng đơn đặt hàng
const updateOrderStatus = asyncHandler(async (req, res) => {
    const {status} = req.body // trạng thái muốn cập nhật
    const {id} = req.params //lấy _id của đơn hàng cần cập nhật
    validateMongoDBId(id)
    try {
        const updateOrderStatus = await Order.findByIdAndUpdate(id,  //xác định đơn hàng cần cập nhật
            //đối tượng chứa các trường và các giá trị mới cần cập nhật
            {
                orderStatus : status,
                paymentIntent: {
                    status: status
                }
            },
            {
                new : true
            }
        )
        res.json(updateOrderStatus)
    }catch (e) {
        throw new Error(e)
    }
})
module.exports = {
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
}
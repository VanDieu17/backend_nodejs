const Product = require('../models/productModel')
const User = require('../models/userModel')
const slugify = require('slugify')
const asyncHandler = require('express-async-handler')
const validateMongoDBID = require('../utils/validateMongoDBID')

//Tạo product 
const createProduct = asyncHandler(async (req, res) => {
    try{
        if(req.body.title){
            req.body.slug = slugify(req.body.title, {lower : true})
        }
        const newProduct = await Product.create(req.body)
        res.json(newProduct)
    }catch(e){
        throw new Error(e)
    }
})

//update product
const updateProduct = asyncHandler(async (req, res) => {
    const {id} = req.params
    validateMongoDBID(id)
    try{
        if(req.body.title){
            req.body.slug = slugify(req.body.title, {lower: true})
        }
        const updateProduct = await Product.findByIdAndUpdate(id, req.body, {
            new:true
        })
        res.json(updateProduct)
    }catch(e){
        throw new Error(e)
    }
})

//delete product
const deleteProduct =asyncHandler (async (req,res) =>{
    const {id} = req.params
    validateMongoDBID(id)
    try{
        const deleteProduct = await Product.findByIdAndDelete(id)
        res.json(deleteProduct)
    }
    catch(e){
        throw new Error(e)
    }
})

//get 1 product
const getProduct =asyncHandler (async (req, res) =>{
    const {id} = req.params
    validateMongoDBID(id)
    try{
        const getProduct = await Product.findById(id)
        res.json(getProduct)
    }catch(e){
        throw new Error(e)
    }
})

//get all product
const getAllProduct = asyncHandler (async (req, res) =>{
    try{
        //lọc theo điều kiện
        const queryObject = {...req.query}
        const excludeFields = ['page', 'sort', 'limit', 'fields'] //tạo mảng "excludeFields" chứa tên các trường được loại trừ khỏi tệp "queryObject" 
        //lặp qua các phần tử và xóa thuộc tính tương ứng khỏi tệp
        excludeFields.forEach((element) => delete queryObject[element])

        //lấy theo khoảng giá
        //lọc các sp dựa trên phạm vi giá
        const queryPriceRange = JSON.stringify(queryObject)
        queryPriceRange = queryPriceRange.replace(/\b(gte|gt|lte|lt)\b/g, (match) =>`$${match}`) // định dạng
        //
        const query = Product.find(JSON.parse(queryPrice))

        //sort
        if(req.query.sort){
            const sortBy = req.query.sort.split(',').json(" ")
            query = query.sort(sortBy) // Phương sort()thức được gọi trên queryđối tượng để áp dụng các tiêu chí sắp xếp đã chỉ định.
        }else{
            query = query.sort("-createdAt")
        }

        //lọc thuộc tính cần lấy
        if(req.query.fields){
        //Nếu fieldstham số tồn tại, nó được phân chia bằng dấu phẩy thành một mảng bằng cách sử dụng split(','). Sau đó, join(' ')được sử dụng để chuyển đổi mảng trở lại thành một chuỗi có khoảng cách giữa các giá trị. 
            const fields = req.query.fields.split(',').json(" ")
            query = query.fields(fields)
        }else{
            query = query.select("-_ _v")


        //Phân trang 
        const page = req.query.page // số thứ tự trang
        const limit = req.query.limit //số sản phẩm 1 trang
        const skip = (page - 1) * limit // số sản phẩm bỏ qua
        query = query.skip(skip).limit(limit)

        if(req.query.page) {
            const productCount = await Product.countDocuments() // lấy tổng số sp trên csdl
            if(skip >= productCount) {
                throw new Error('Trang này không tồn tại')
            } 
        }

        const getAllProduct = await query
        res.json(getAllProduct)
    }
}catch(e){
        throw new Error(e)
    }
})

//Thêm sản phẩm vào mục yêu thích 
const addToWishList = asyncHandler (async (req, res) => {
    const {_id} = req.user
    const {productId} = req.body
    try{
        const user = await User.findById(_id)
        const alreadyAdded = user.wishlist.find((id) => id.toString() === productId)
        if(alreadyAdded){
            let user = await User.findByIdAndUpdate(
                _id,
                {$pull: {wishlist: productId}}, //pull đẩy ra khỏi mảng
                {new: true},
            )
            res.json(user)
        }
        else{
            const user = await User.findByIdAndUpdate(
                _id,
                {$push: {wishlist: productId}}, //push là thêm vào mảng
                {new:true}
            )
            res.json(user)
        }
    }catch(e){
        throw new Error(e)
    }
})

//xếp hạng sản phẩm
const rating = asyncHandler (async (req, res) => {
    const {_id} = req.user
    const {star, productId, comment} = req.body
    try{
        const product = await Product.findById(productId) //tìm kiếm sản phẩm dựa theo productId.
        // kiểm tra xem người dùng đã đánh giá sản phầm hay chưa
        // nếu đã đánh giá thì gán "alreadyRated" chứa thông tin của người dùng đó
        const alreadyRated = product.ratings.find(
            (userId) => userId.postedby.toString() === _id.toString())
        if(alreadyRated){
            //cập nhật = phương thức updateOne
            const updatedRating = await Product.updateOne(
                {
                    ratings: {$elemMatch: alreadyRated},
                },
                {
                    $set: {"ratings.$.star": star, "ratings.$.comment": comment}
                },
                {
                    new:true
                }
            )
        }else{
            // nếu chưa đánh giá sẽ thực hiện tạo mới đánh giá = cách sử dụng "findByIdAndUpdate" 
            // đánh giá sẽ được thêm vào mảng rantings 
            const rateProduct = await Product.findByIdAndUpdate(
                productId,{
                    $push: {
                        ratings: {
                            star: star,
                            comment: comment,
                            postedby: _id
                        }
                    }
                },
                {
                    new:true
                }
            )
        }
        const getAllratings = await Product.findById(productId) // lấy thông tin sản phẩm sau khi đã cập nhật hoặc thêm đánh giá
        const totalRating = getAllratings.ratings.length // tính tổng số lượng đánh giá
        const ratingsum = getAllratings.ratings // tính tổng số sao
            .map(item => item.star)
            .reduce((prev, curr) => prev + curr, 0)
        const actualRating = Math.round(ratingsum/totalRating) // tính điểm đánh giá trung binhf
        // cập nhật giá trị "totalRating" của sản phẩm
        const finalproduct = await Product.findByIdAndUpdate(
            productId,
            {
                totalRating: actualRating
            },{
                new:true,
            }
        )
        res.json(finalproduct) // trả về thông tin sp đã được cập nhật đánh giá
    }catch(e){
        throw new Error(e)
    }
})
module.exports = {
    createProduct,
    getProduct,
    getAllProduct,
    updateProduct,
    deleteProduct,
    addToWishList,
    rating,   
}
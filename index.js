const express = require('express')
const app = express()
const dotenv = require('dotenv').config()
const PORT = process.env.PORT || 5000

const dbConnect = require('./config/dbConnect')
const bodyParser = require('body-parser') //nhận dữ liệu post
const { errorHandler,notFound } = require('./middlewares/errorHandler')
const cookieParser = require('cookie-parser')
const cors = require('cors') //cho phép truy cập tài nguyên từ các domain khác 


const categoryRouter = require('./routes/categoryRoute')
const colorRouter = require('./routes/colorRoute')
const brandRouter = require('./routes/brandRoute')
const sizeRouter = require('./routes/sizeRoute')
const userRouter = require('./routes/userRoute')
const blogRouter = require('./routes/blogRoute')
const blogCategoryRouter = require('./routes/blogCategoryRoute')
const productRouter = require('./routes/productRoute')
const couponRouter = require('./routes/couponRoute')
const enquiryRouter = require('./routes/enquiryRoute')

//db connect
dbConnect()

app.use(cors())
app.use(bodyParser.json()) //thư viện chuyển thông tin nhập từ form vào req.body
app.use(bodyParser.urlencoded({extended: false}))
app.use(cookieParser())


//router
app.use('/api/category', categoryRouter)
app.use('/api/brand', brandRouter)
app.use('/api/color', colorRouter)
app.use('/api/size', sizeRouter)
app.use('/api/user', userRouter)
app.use('/api/blog', blogRouter)
app.use('/api/blogCategory', blogCategoryRouter)
app.use('/api/product', productRouter)
app.use('/api/coupon', couponRouter)
app.use('/api/enquiry', enquiryRouter)



//middleware
app.use(notFound)
app.use(errorHandler)

app.listen(PORT, () => console.log(`Server is listening on port ${PORT}`))
const multer = require('multer') // để xử lý việc tải lên file trong Node.js
const sharp = require('sharp') // dể xử lý việc giảm kích thước và định dạng file hình ảnh
const path = require('path') //để làm việc với các đường dẫn
const fs = require('fs') //thao tác với file hệ thống

//định dạng các đường dẫn
const multerStorage = multer.diskStorage({
    //xác định thư mục đích cho việc lưu trữ file
    destination : function (req, file, cb) {
        cb(null, path.join(__dirname, '../public/imgaes/')) //đường dẫn chính
    },
    // xác định tên fie được lưu trữ
    filename: function (req, file, cb) {
        //tạo 1 giá trị ngẫn nhiên và duy nhất cho file
        const uniqueSuffix = Date.now() + Math.round(Math.random() * 1e9)
        cb(null, file.fieldname + '-' + uniqueSuffix + ".jpeg") 
    }
})

// định dạng file 
// kiểm tra và chọn lọc file được tải lên
const multerFilter = (req, file, cb) => {
    if(file.mimeType.startsWith('image')){
        cb(null, true)
    }else{
        cb({
            message: 'không hỗ trợ định dạng file này'
        }, false)
    }
}

//giảm dung lượng file product
const productImgResize = async(req, res, next) => {
    if(!req.files) return next()
    await Promise.all(req.files.map( async (file) => {
        await sharp(file.path) // dùng sharp để thay đổi kích thước và định dạng file
            .resize(300,300)
            .toFormat('jpeg')
            .jpeg({quality:90})
            .toFile(`public/images/products/${file.filename}`)
            //file ban đầu được xóa
            fs.unlinkSync(`public/images/products/${file.filename}`)
        }))
    next()
}

//Giam dung lượng file blog
const blogImgResize = async (req, res, next) => {
    if(!req.files) return next()
    await Promise.all(req.files.map(async (file) => {
        await sharp(file.path)
            .resize(300,300)
            .toFormat('jpeg')
            .jpeg({quantity:90})
            .toFile(`public/images/blogs/${file.filename}`)
            fs.unlinkSync(`public/images/blogs/${file.filename}`)
    }))
    next()
}

// xử lý tải file lên
const uploadPhoto = multer({
    storage: multerStorage,
    fileFilter: multerFilter,
    limits: {filesize : 2000000} //giới hạn kích thước tải lên là 2MB
})

module.exports = {
    uploadPhoto,
    blogImgResize,
    productImgResize
}


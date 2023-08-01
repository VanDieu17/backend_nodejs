const {default : mongoose } = require('mongoose');

const dbConnect = () => {
    try{
        const connect = mongoose.connect(process.env.MONGODB_URL)
        console.log('Kết nối DB thành công')
    }
    catch(e){
        console.log('kết nối DB thất bại')
    }
}

module.exports = dbConnect;
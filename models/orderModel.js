const mongoose = require('mongoose')

var orderShema = new mongoose.Schema({
    products: [
            {
                product: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Product",
                },
                count: {
                    type: String,
                    default: 1
                },
                color:{
                    type: String
                },
                size: {
                    type: String
                }
            }
        ],
        paymentIntent: {},
        orderStatus: {
            type: String,
            default: "Not Processed",
            enum: [
                "Chưa xử lý",
                "Thanh toán khi nhận hàng",
                "Đax tiếp nhận",
                "Đang giao hàng",
                "Giao thành công",
                "Đã hủy",
            ],
        },
        orderby: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        }
},{timestamps: true}
)

module.exports = mongoose.model('Order', orderShema)
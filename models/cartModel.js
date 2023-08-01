    const mongoose = require('mongoose')

    var cartSchema = new mongoose.Schema({
        products: [
            {
                product: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'Product'
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
                },
                price:{
                    type: String
                }
            },
        ],
        // orderby: {
        //     type: mongoose.Schema.Types.ObjectId,
        //     ref: "User"
        // },
        // product: {
        //     type: mongoose.Schema.Types.ObjectId,
        //     ref: "Product"
        // }, 
        // size: {
        //     type: mongoose.Schema.Types.ObjectId,
        //     ref: "Size"
        // },
        // color: {
        //     type: mongoose.Schema.Types.ObjectId,
        //     ref: "Color"
        // },
        // price: {
        //     type: Number,
        //     required: true
        // },
        cartTotal:{
            type: Number,
            default:0
        },
        totalAfterDiscount:{
            type: Number,
            default:0
        },
        orderby: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }

    },{timestamps: true}
    )

    module.exports = mongoose.model('Cart', cartSchema)
import mongoose from "mongoose";

const cartCollection = 'carts'

const cartSchema = mongoose.Schema({
    products: [
        {
            product: {
                type: mongoose.Schema.ObjectId,
                required: true,
                ref: 'products'
            },
            quantity: Number
        },
    ],
})


export const cartModel = mongoose.model(cartCollection, cartSchema)
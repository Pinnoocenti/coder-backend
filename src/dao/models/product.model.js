import mongoose from "mongoose";
import mongoosePaginate from 'mongoose-paginate-v2'


const productCollection = 'products'

const productSchema = mongoose.Schema({
    title:{
        type: String,
        required: true, 
    }, 
    description:{
        type: String,
        required: true, 
    },
    price:{
        type: Number,
        required: true,
    },
    thumbnail:{
        type: String,
    },
    code:{
        type: String,
        required: true,
        unique: true,
    },
    stock:{
        type: String,
        required: true, 
    }, 
    category:{
        type: String,
        required: true,
    },
    status:{
        type: String,
        default: true,
    },
    available:{
        type: String,
        enum: ['si', 'no'],
        required: true,
    },
    owner: {
        type: String,
        default: 'admin',
    },
})
productSchema.plugin(mongoosePaginate)

export const productModel = mongoose.model(productCollection, productSchema)
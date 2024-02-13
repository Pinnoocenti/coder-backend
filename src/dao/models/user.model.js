import mongoose from "mongoose";

const userCollection = 'users'

const userSchema = mongoose.Schema({
    firstName: {
        type: String, 
        require: true 
    },
    lastName: {
        type: String, 
        require: true 
    },
    email: {
        type: String, 
        require: true,
        unique: true
    },
    age: {
        type: Number, 
        require: true 
    },
    password: {
        type: String, 
        require: true,
    },
    role: {
        type: String,
        default: 'user',
    },
    cart: {
        type: mongoose.Schema.ObjectId,
        require: true,
        ref: 'carts'
    }
})

export const userModel = mongoose.model(userCollection, userSchema)
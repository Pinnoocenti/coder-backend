import mongoose from "mongoose";
import CartManagerDB from "../ManagerDB/cartManagerDB.js";

const CartManager = new CartManagerDB()

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
        ref: 'carts'
    }
})

export const userModel = mongoose.model(userCollection, userSchema)
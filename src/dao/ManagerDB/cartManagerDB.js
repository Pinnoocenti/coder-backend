import mongoose from "mongoose";
import { cartModel } from "../models/cart.model.js";
import MyError from "../../errors/myError.js";
import ErrorEnum from "../../errors/error.enum.js";
import {databaseError}  from "../../errors/info.js";


class CartManagerDB {
    async getCarts() {
        try {
            const cartsData = await cartModel.find().lean()
            return cartsData;
        } catch (error) {
            throw new MyError({
                name: 'Unexpected database error', 
                cause: databaseError(),
                message: error.message,
                code: ErrorEnum.DATABASE_ERROR,
            })
        }
    }
    async addCart(products) {
        try {
            const cart = await cartModel.create(products)
            return cart
        } catch (error) {
            throw new MyError({
                name: 'Unexpected database error', 
                cause: databaseError(),
                message: error.message,
                code: ErrorEnum.DATABASE_ERROR,
            })
        }
    }
    async getCartById(cId) {
        try {
            const cartById = await cartModel.findOne({ _id: cId })
            return cartById 
        } catch (error) {
            console.error(error)
            throw new MyError({
                name: 'Unexpected database error', 
                cause: databaseError(),
                message: error.message,
                code: ErrorEnum.DATABASE_ERROR,
            })
        }
    }
    async addProducts(cid, pid, quantity) {
        
        try {
            const cart = await cartModel.findOne({ _id: cid })
            if (!cart) {
                return false
            }
            const searchedProduct = cart.products.find(product => product.product.toString() === pid)
            if (searchedProduct) {
                searchedProduct.quantity += quantity
            } else {
                cart.products.push({ product: pid, quantity })
            }
            await cart.save()
            return true
        } catch (error) {
            return false
        }
    }
    async getProductsCartById(cid) { //falta en fs
        try {
            const cart = await cartModel.findById(cid).populate('products.product')
            return cart
        } catch (error) {
            throw new MyError({
                name: 'Unexpected database error getting products from cart', 
                cause: databaseError(),
                message: error.message,
                code: ErrorEnum.DATABASE_ERROR,
            })
        }
    }
    async deleteAllProductsInCart(cid) { //falta en fs
        try {
            const deleted = await cartModel.updateOne({ _id: cid }, {
                products: []
            })
            if (deleted.modifiedCount > 0) {
                return true
            }
            else {
                return false
            }
        }
        catch (error) {
            console.log(error)
            return false
        }
    }
    async deleteProductInCart(cId, pId) { //falta en fs
        try {
            const searchedCart = await cartModel.updateOne({ _id: cId }, {
                $pull: { products: { product: new mongoose.Types.ObjectId(pId) } }
            })
            
            if(searchedCart.modifiedCount > 0) {
                return true
            }
            else {
                return false
            }
        } catch (error) {
            console.error(error)
            return false
        }
    }
    async updateCart(cId, cart){ //falta en fs
        try {
          const searchedCart = await cartModel.updateOne({_id: cId}, cart);
          return searchedCart
        } catch (error) {
          console.error(error)
          return error
        }
    }
    async updateProductInCart(cid, pid, quantity){ //falta en fs
        if(!quantity){
          return false
        }
        try {
          const searchedCart = await cartModel.findOne({_id: cid});
          if(!searchedCart){
            return false
          }
          const product = searchedCart.products.find(product => product.product.toString() === pid);
          if(!product){
            return false
          }
          product.quantity = quantity
          await searchedCart.save()
          return true
        } catch (error) {
          console.error(error)
          return false
        }
      }
}
export default CartManagerDB
import mongoose from "mongoose";
import { cartModel } from "../models/cart.model.js";


class CartManagerDB {
    async getCarts() {
        try {
            const cartsData = await cartModel.find().lean()
            return { message: 'ok', rdo: cartsData }
        } catch (error) {
            return { message: 'error', rdo: 'There are no carts' }
        }
    }
    async addCart(products) {
        try {
            const cart = await cartModel.create(products)
            return { message: 'ok', rdo: ' Cart added' }
        } catch (error) {
            return { message: 'error', rdo: 'There was an error creating the cart' + error.message }
        }
    }
    async getCartById(cId) {
        try {
            const cartById = await cartModel.findOne({ _id: cId })
            if (!cartById) {
                return { message: 'error', rdo: 'The cart does not exist' }
            }
            return { message: 'ok', rdo: cartById }
        } catch (error) {
            return { message: 'error', rdo: 'There was an error getting the cart' }
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
    async getProductsCartById(cid) {
        try {
            const cart = await cartModel.findOne({ _id: cid }).populate('products.product')
            if (cart) {
                return { message: 'ok', rdo: cart.products }
            } else {
                return { message: 'error', rdo: 'The cart does not exist or does not have products' }
            }
        } catch (error) {
            return { message: 'error', rdo: ' There was an error getting products from cart - ' + error.message }
        }
    }
    async deleteAllProductsInCart(cid) {
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
    async deleteProductInCart(cId, pId) {
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
    async updateCart(cId, cart){
        try {
          const searchedCart = await cartModel.updateOne({_id: cId}, cart);
          return searchedCart
        } catch (error) {
          console.error(error)
          return error
        }
    }
    async updateProductInCart(cid, pid, quantity){
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
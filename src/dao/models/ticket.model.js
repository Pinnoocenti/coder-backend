import mongoose from "mongoose";

const ticketCollection = 'tickets'

const ticketSchema = mongoose.Schema({
    code: String, //unico 
    purchaseDateTime: String, // fecha y hora exacta de la compra 
    amount: Number,
    purchaser: String //tiene que ser el mail del usuario asociado al carrito 
})

export const ticketModel = mongoose.model(ticketCollection,ticketSchema)
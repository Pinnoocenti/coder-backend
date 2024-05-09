import mongoose, { mongo } from 'mongoose'
import * as chai from 'chai'
import productDAO from '../dao/Manager/productDAO.js'
import { Command } from 'commander'
import { getVariables } from '../config/config.js'

const program = new Command()
const options = program.parse()
const {mongo_URL_test} = getVariables(options)
mongoose.connect(mongo_URL_test)

const expect = chai.expect

describe('Testing unitario de Product', ()=>{
    beforeEach(function(){
        this.timeout(5000)
        mongoose.connection.collections.products.drop()
    })
    it('El addProducts debe agregar un producto correctamente a la base de datos', async function(){
        const mockedProduct = {
            title: 'Prueba test',
            description: 'Esta es una prueba para el test',
            price: 5000,
            code: 'pil58',
            stock: '25',
            status: 'true',
            category: 'alfajor',
            thumbnail: '',
            available: 'si',
        }
        const result = await productDAO.addProduct(mockedProduct)
        expect(result).to.be.an('object')
    })
    it('Verificar el update del product DAO', async function(){
        const mockedProduct = {
            title: 'Prueba test 2',
            description: 'Esta es una prueba para el test 2',
            price: 8000,
            code: 'pil58',
            stock: '25',
            status: 'true',
            category: 'alfajor',
            thumbnail: '',
            available: 'si',
        }
        const result = await productDAO.addProduct(mockedProduct)
        const dataModified = {
            title: 'Prueba test modificado',
            description: 'Esta es una prueba para el test modificada',
            price: 5000,
            code: 'pil58',
            stock: '25',
            status: 'true',
            category: 'alfajor',
            thumbnail: '',
            available: 'si',
        }
        await productDAO.updateProduct(result._id, dataModified)
        const productModified = await productDAO.getProductById(result._id)
        expect(productModified.title).to.be.equal(dataModified.title)
        expect(productModified.description).to.be.equal(dataModified.description)
    })
    it('Verificar el delete del product DAO', async function(){
        const mockedProduct = {
            title: 'Prueba test delete',
            description: 'Esta es una prueba para el test delete',
            price: 8000,
            code: 'pil58',
            stock: '25',
            status: 'true',
            category: 'alfajor',
            thumbnail: '',
            available: 'si',
        }
        const result = await productDAO.addProduct(mockedProduct)

        const deletedProduct = await productDAO.deleteProduct(result._id)
        expect(deletedProduct.message).to.be.equal("ok")
        const searchedDeletedProduct = await productDAO.getProductById(result._id)
        expect(searchedDeletedProduct.message).to.exist
    })
})
import * as chai from 'chai'
import supertest from 'supertest'
import { v4 as uuidv4 } from 'uuid';
import UserManagerDB from '../dao/ManagerDB/userManagerDB.js'



const requester = supertest("http://localhost:8080");
const expect = chai.expect

describe('Testing integral', ()=>{
    describe('Test de endpoints del ecommerce', ()=>{
        it('El endpoint POST /api/session/login debe loggear correctamente a un usuario ', async ()=>{
            const login = {
                email: 'pilar.innocenti@gmail.com',
                password: 'coder123'
            }
            const response = await requester.post('/api/session/login').send(login)
            expect(response.statusCode).to.equal(302)
        })
        it('El endpoint POST /api/session/register debe registrar correctamente un usuario ', async ()=>{
            const newUser = {
                firstName: 'Prueba',
                lastName: 'Registro',
                email: `${uuidv4()}@gmail.com`,
                age: 62,
                password: 'CoderHouse'
            }
            const response = await requester.post('/api/session/register').send(newUser)
            expect(response.statusCode).to.equal(200)

        })
        it('El endpoint POST /api/session/resetpassword tiene que enviar correctamente un mail', async ()=>{
            const email = 'pilar.innocenti@gmail.com'

            const response = await requester.post('/api/session/resetpassword').send({email})
            expect(response.body.message).to.equal('Email sent successfully')
        }).timeout(10000);

        it('El endpoint POST /api/carts/product/:pid debe agregar correctamente los productos al carrito', async ()=> {
            //loguearse con un usuario premium o admin para poder crear los productos
            const loginPremium = {
                email: 'pilar.innocenti@gmail.com',
                password: 'coder123'
            }
            const response = await requester.post('/api/session/login').send(loginPremium)
            expect(response.statusCode).to.equal(302)
            
            const mockedProduct = {
                title: 'Prueba test 3',
                description: 'Esta es una prueba para el test 3',
                price: 5000,
                code: uuidv4(),
                stock: '25',
                status: 'true',
                category: 'alfajor',
                available: 'si',
            }
            const product1 = await requester.post('/api/products').set({Cookie: response.headers['set-cookie'][0]}).send(mockedProduct)
            expect(product1.statusCode).to.equal(201)
            expect(product1.body).to.have.property('_id')
            const pid1 = product1.body._id

            //logearse con un usuario 'user' para poder agregar los productos  creados al carrito 
            const loginUser = {
                email: 'so@gmail.com',
                password: '456789'
            }
            const responseUser = await requester.post('/api/session/login').send(loginUser)
            expect(responseUser.statusCode).to.equal(302)

            const product1Added = await requester.post(`/api/carts/product/${pid1}`).set({Cookie: responseUser.headers['set-cookie'][0]})
            expect(product1Added.statusCode).to.equal(200)     
        }) 
        it('El endpoint DELETE /api/carts/:cid debe eliminar todos los productos del carrito correctamente', async ()=> {
            //loguearse con un usuario premium o admin para poder crear los productos
            const loginPremium = {
                email: 'pilar.innocenti@gmail.com',
                password: 'coder123'
            }
            const response = await requester.post('/api/session/login').send(loginPremium)
            expect(response.statusCode).to.equal(302)
            
            const mockedProduct = {
                title: 'Prueba test 3',
                description: 'Esta es una prueba para el test 3',
                price: 5000,
                code: uuidv4(),
                stock: '25',
                status: 'true',
                category: 'alfajor',
                available: 'si',
            }
            const product1 = await requester.post('/api/products').set({Cookie: response.headers['set-cookie'][0]}).send(mockedProduct)
            expect(product1.statusCode).to.equal(201)
            expect(product1.body).to.have.property('_id')
            const pid1 = product1.body._id

            const mockedProduct2 = {
                title: 'Prueba test 4',
                description: 'Esta es una prueba para el test 4',
                price: 5000,
                code: uuidv4(),
                stock: '25',
                status: 'true',
                category: 'alfajor',
                available: 'si',
            }
            const product2 = await requester.post('/api/products').set({Cookie: response.headers['set-cookie'][0]}).send(mockedProduct2)
            expect(product2.statusCode).to.equal(201)
            expect(product2.body).to.have.property('_id')
            const pid2 = product2.body._id

            //logearse con un usuario 'user' para poder agregar los productos  creados al carrito 
            const loginUser = {
                email: 'so@gmail.com',
                password: '456789'
            }
            const responseUser = await requester.post('/api/session/login').send(loginUser)
            expect(responseUser.statusCode).to.equal(302)

            const product1Added = await requester.post(`/api/carts/product/${pid1}`).set({Cookie: responseUser.headers['set-cookie'][0]})
            expect(product1Added.statusCode).to.equal(200) 
            const product1Added2 = await requester.post(`/api/carts/product/${pid2}`).set({Cookie: responseUser.headers['set-cookie'][0]})
            expect(product1Added2.statusCode).to.equal(200)
            
            const cid = product1Added2.body.cartId

            const respondseDelete = await requester.delete(`/api/carts/${cid}`)
            expect(respondseDelete.body.message).to.equal('products deleted')
        }) 
        it('El endpoint POST /api/carts/:cid/purchase debe finalizar la compra, verificar el stock de los productos y crear un ticket de compra', async ()=> {
            //loguearse con un usuario premium o admin para poder crear los productos
            const loginPremium = {
                email: 'pilar.innocenti@gmail.com',
                password: 'coder123'
            }
            const response = await requester.post('/api/session/login').send(loginPremium)
            expect(response.statusCode).to.equal(302)
            
            const mockedProduct = {
                title: 'Prueba test 3',
                description: 'Esta es una prueba para el test 3',
                price: 5000,
                code: uuidv4(),
                stock: '25',
                status: 'true',
                category: 'alfajor',
                available: 'si',
            }
            const product1 = await requester.post('/api/products').set({Cookie: response.headers['set-cookie'][0]}).send(mockedProduct)
            expect(product1.statusCode).to.equal(201)
            expect(product1.body).to.have.property('_id')
            const pid1 = product1.body._id

            const mockedProduct2 = {
                title: 'Prueba test 4',
                description: 'Esta es una prueba para el test 4',
                price: 5000,
                code: uuidv4(),
                stock: '25',
                status: 'true',
                category: 'alfajor',
                available: 'si',
            }
            const product2 = await requester.post('/api/products').set({Cookie: response.headers['set-cookie'][0]}).send(mockedProduct2)
            expect(product2.statusCode).to.equal(201)
            expect(product2.body).to.have.property('_id')
            const pid2 = product2.body._id

            //logearse con un usuario 'user' para poder agregar los productos  creados al carrito 
            const loginUser = {
                email: 'so@gmail.com',
                password: '456789'
            }
            const responseUser = await requester.post('/api/session/login').send(loginUser)
            expect(responseUser.statusCode).to.equal(302)

            const product1Added = await requester.post(`/api/carts/product/${pid1}`).set({Cookie: responseUser.headers['set-cookie'][0]})
            expect(product1Added.statusCode).to.equal(200) 
            const product1Added2 = await requester.post(`/api/carts/product/${pid2}`).set({Cookie: responseUser.headers['set-cookie'][0]})
            expect(product1Added2.statusCode).to.equal(200)
            
            const cid = product1Added2.body.cartId

            const purchase = await requester.post(`/api/carts/${cid}/purchase`).set({Cookie: responseUser.headers['set-cookie'][0]})
            expect(purchase.body.ticket).to.exist
        }) 
        
    }) 
    
})
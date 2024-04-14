import { Faker, es, en } from "@faker-js/faker";

const faker = new Faker({
    locale: [es, en]
})

export const generateProduct= ()=>{
    return {
        title: faker.commerce.productName(),
        description: faker.lorem.paragraph(),
        price: faker.commerce.price(),
        thumbnail: faker.image.url(),
        code: faker.string.alphanumeric({length: 10}).toLocaleUpperCase(),
        stock: faker.number.int({min: 0 , max: 100}),
        caregory: faker.commerce.department(),
        status: faker.datatype.boolean(),
        available: faker.number.int() % 2 === 0 ? 'si' : 'no',
        id: faker.database.mongodbObjectId()
    }
}

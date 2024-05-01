export const swaggerConfiguration = {
    definition: {
        openapi: '3.0.1',
        info: {
            title: 'Documentación API de ecommerce',
            description: 'Es una API de un ecommerce',
        },
    },
    apis: ['src/docs/**/*.yaml'] 
}
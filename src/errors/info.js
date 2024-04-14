export const notFound = () =>{
    return `not found`
}
export const databaseError = () =>{
    return `Unexpected error`
}
export const addProductError = (product)=>{
    return `One or more properties are incomplete or invalid 
        title: require - need to be a string, recived ${typeof product.title} 
        description: require - need to be a string, recived ${typeof product.description} 
        price: require - need to be a number, recived ${typeof product.price}
        thumbnail: Is not require - need to be a string, recived ${typeof product.thumbnail}
        code: require - need to be a string and it has to be unique, recived ${typeof product.code}
        stock: require - need to be a string, recived ${typeof product.stock}
        category: require - need to be a string, recived ${typeof product.category}
        status: need to be a string, recived ${typeof product.status}
        available: require - need to be a string - "si" or "no", recived ${typeof product.available} 
    `
}

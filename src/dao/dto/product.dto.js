
class ProductDTO {
    constructor(product){
        this.title = String(product.title),
        this.description = String(product.description),
        this.price = Number(product.price),
        this.code = String(product.code),
        this.stock = String(product.stock),
        this.status = String(product.status),
        this.category = String(product.category),
        this.thumbnail = String(''),
        this.available = String(product.available),
        this.owner = String(product.owner)
    }
}
export default ProductDTO
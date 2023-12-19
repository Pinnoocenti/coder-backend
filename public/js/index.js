const socket = io()

const div = document.getElementById('outputInfo')

socket.on('updateProducts', products=>{
    
    div.innerHTML = `
    <div>
        <h2> Los productos hasta el momento son:  </h2>
        ${products.foreach(prod => `<h3> Producto: ${prod.title}</h3>
        <p>Descripción: ${prod.description}</p>
        <p>Precio: ${prod.price}</p>
        <p>Código: ${prod.code}</p>
        <p>Stock: ${prod.stock}</p>
        <p>Categoría: ${prod.category}</p>
        <p>Status: ${prod.status}</p>
        <p>Habilitado: ${prod.available}</p>`)}
    </div>`
})
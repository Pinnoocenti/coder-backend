const socket = io()

const addProduct = document.getElementById('addProduct')
const sendInfo = document.getElementById('sendInfo')
const outputInfo = document.getElementById('outputInfo')

//Llamo al socket para agregar un producto

const newProduct = e =>{
	e.preventDefault()
	const data = new FormData(addProduct)
	const product = {
		title: data.get('title'),
		description: data.get('description'),
		price: parseInt(data.get('price')),
		category: data.get('category'),
		code: data.get('code'),
		stock: data.get('stock'),
    	status: data.get('status'),
    	thunbnail: "",
		available: data.get('available')
	}
	socket.emit('addProd',product)	
		addProduct.reset()
}
sendInfo.addEventListener('click', newProduct)

//Llamo al socket para eliminar un producto

const delProd = async e => socket.emit('delProd', e.target.id)
document.addEventListener('click', e => e.target.matches('.btn-del') && delProd(e))


socket.on('updateProducts', products=>{
    
    outputInfo.innerHTML =  products.map((prod) => 
		`<div>
    		<p>Id: ${prod._id}</p>
    		<p>Title: ${prod.title}</p>
    		<p>Description: ${prod.description}</p>
    		<p>Price: ${prod.price}</p>
    		<p>Status: ${prod.status}</p>
    		<p>Code: ${prod.code}</p>
    		<p>Stock: ${prod.stock}</p>
    		<button id=${prod._id} class='btn-del'>Eliminar</button>
    	</div>`).join('')
})
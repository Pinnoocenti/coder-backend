const buttons = document.getElementsByTagName('button')

const addProductToCart = async(pid) =>{
    try {
        const result = await fetch(`http://localhost:8080/api/carts//product/${pid}`, {
        body: JSON.stringify({
            quantity: 1
        }), 
        method: 'post',
        headers:{
            'Content-type': 'application/json'
        }
    })
    if(result){
        alert('Se agrego correctamente')
    } else{
        alert('error, no se pudo agregar ')
    }
    } catch (error) {
        
    }
    
}

for (let btn of buttons){
    buttons.addEventListener('click', (event)=>{
        addProductToCart(btn.id)
    })
}
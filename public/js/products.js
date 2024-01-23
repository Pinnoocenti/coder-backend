const btns = document.getElementsByName('addToCartButton')
const  logoutBtn = document.getElementById('logoutBtn')


const addProductToCart = async(pid) =>{
    try {
        const result = await fetch(`http://localhost:8080/api/carts/65a9d4bac9f14f288fabc3a2/product/${pid}`, {
        body: JSON.stringify({
            quantity: 1
        }), 
        method: 'post',
        headers:{
            'Content-type': 'application/json'
        }
    })
    if(result.status===200 || result.status===201){
        alert('Se agrego correctamente')
    } else{
        alert('error, no se pudo agregar ')
    }
    } catch (error) {
        alert('Error, no se pudo agregar');
    }
    
}

for (let btn of btns){
    btn.addEventListener('click', (event)=>{
        addProductToCart(btn.id)
    })
}

logoutBtn.addEventListener('click', async (e)=>{
    const result = await fetch('http://localhost:8080/api/session/logout', {
        method: 'post',
        headers:{
            'Content-type': 'application/json'
        }
    })
    const {redirect} = await result.json()
    window.location.href = redirect
})
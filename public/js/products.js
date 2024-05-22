const btns = document.getElementsByName('addToCartButton')
const logoutBtn = document.getElementById('logoutBtn')



const addProductToCart = async(pid) =>{
    try {
        const result = await fetch(`/api/carts/product/${pid}`, {
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
        const data = await result.json();
        alert(data.message ?? 'Error, no se pudo agregar')
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
    const result = await fetch('/api/session/logout', {
        method: 'post',
        headers:{
            'Content-type': 'application/json'
        }
    })
    const {url} = result
    window.location.href='/login'
})

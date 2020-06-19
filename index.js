const URL = "http://localhost:3000";
const ROOT = let boardParentDiv = document.getElementById('root');
async function getCart(){
    console.log("Call me functions")
    const result= await fetch(`${URL}/getCart`).then(data => data.json()).then(data => {
        console.log(data)
        return data.products
    });
    console.log(result);
}
const cartProducts = getCart() || [];

function renderProducts(products) {
    if(Array.isArray(products) && products.length < 1) {
        for (let index = 0; index < products; index++) {
            const product = products[index];
            let card = document.createElement('div');
            card.classList.add('product__card')
            
        }
    } else return products
}
function displayProducts(array) {
    let board = []

    for (let index = 0; index < array.length; index++) {
        const tileData = { position: index, letter: null };
        board.push(tileData)
       let tile = document.createElement('div');
       let wrapper = document.createElement('div');
       wrapper.classList.add('wrap')
       tile.setAttribute('id', index)
       tile.classList.add(`board__tile`, `board__tile--${index}`);
       for(let cubeEffectIndex = 0; cubeEffectIndex < 6; cubeEffectIndex++) {
       let front = document.createElement('div');
       let back = document.createElement('div');
       let right = document.createElement('div');
       let left = document.createElement('div');
       let bottom = document.createElement('div');
       let top = document.createElement('div');
       front.classList.add('board__tile--cube', 'board__tile--cube--back')
       front.style['background-color'] = 'red'
       back.classList.add('board__tile--cube','board__tile--cube--right')
       back.style['background-color'] = 'blue'
       right.classList.add('board__tile--cube','board__tile--cube--left');
       right.style['background-color'] = 'yellow';  
       left.classList.add('board__tile--cube','board__tile--cube--front');
       front.style.opacity = 0.2
       bottom.classList.add('board__tile--cube','board__tile--cube--bottom');
       bottom.style['background-color'] = 'green';
       top.classList.add('board__tile--cube','board__tile--cube--top')
       top.style['background-color'] = 'orange';
       tile.appendChild(front)
       tile.appendChild(back)
       tile.appendChild(right)
       tile.appendChild(left)
       tile.appendChild(bottom)
       tile.appendChild(top)
    
       }
       tile.addEventListener("click", function(){
       doIt(tileData);
   })
        boardParentDiv.appendChild(wrapper)
        wrapper.appendChild(tile)
    }
   }
const URL = "http://localhost:3000";
const ROOT =  document.getElementById('root');
const productList =  document.getElementById('product_list');

async function getCart(){
    const result= await fetch(`${URL}/getCart`).then(data => data.json()).then(data => data.products);
    return result
}

async function renderProducts() {
    const cartProducts = await getCart();
        for (let index = 0; index < cartProducts.length; index++) {
            const product = cartProducts[index];
            console.log(product)
            let card = document.createElement('div');
            card.classList.add('product__card')
            let price = document.createElement('p');
            appendChildToParent(price, product.price)
            appendChildToParent(card, price)
            let available_for_bonus= document.createElement('p');
            appendChildToParent(available_for_bonus, product.available_for_bonus)
            appendChildToParent(card, available_for_bonus)
            let category_id= document.createElement('p');
            appendChildToParent(category_id, product.category_id)
            appendChildToParent(card, category_id)
            let credit_coupon_price= document.createElement('p');
            appendChildToParent(credit_coupon_price, product.credit_coupon_price)
            appendChildToParent(card, credit_coupon_price)
            let discount= document.createElement('p');
            appendChildToParent(discount, product.discount)
            appendChildToParent(card, discount)
            let id= document.createElement('p');
            appendChildToParent(id, product.id)
            appendChildToParent(card, id)
            let product_id= document.createElement('p');
            appendChildToParent(product_id, product.product_id)
            appendChildToParent(card, product_id)
            let quantity= document.createElement('p');
            appendChildToParent(quantity, product.quantity)
            appendChildToParent(card, quantity)
            appendChildToParent(productList, card)
        }
}
function appendChildToParent(parent, child){
    return parent.append(child)
}
renderProducts()
ROOT.append(productList)

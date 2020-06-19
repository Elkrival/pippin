const express = require("express");
const cors = require("cors");
const bp = require("body-parser");
const axios = require("axios");
const PORT = process.env.PORT || 3000;
const app = express();

app.use(bp.json());
app.use(bp.urlencoded({extended: true}));
app.use(cors());

const cartUrl = "https://gopuff-public.s3.amazonaws.com/dev-assignments/product/order.json"
let ProductState;
app.get('/getCart', async(req, res) =>{
    try {
        return await getCart()
    } catch (error) {
        console.error(error)
    }
    async function getCart() {
        const data = await axios.get(cartUrl).then(resp => resp.data.cart)
        ProductState = data.products
        return await res.status(200).json(data);
    }
})
app.put('/addProducts', async(req, res) =>{

})
app.put('/removeProducts', async(req, res) =>{
    
})
app.listen(PORT, function () {
    console.log('listen to events on a "port: ', PORT)
});
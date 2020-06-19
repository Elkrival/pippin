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

app.get('/getCart', async(req, res) =>{
    console.log("YASASAS");
    try {
        return await getCart()
    } catch (error) {
        console.error(error)
    }
    async function getCart() {
        const data = await axios.get(cartUrl).then(resp => resp.data.cart)
        return await res.status(200).json(data);
    }
})

app.listen(PORT, function () {
    console.log('listen to events on a "port: ', PORT)
});
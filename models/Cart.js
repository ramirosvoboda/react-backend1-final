// models/Cart.js
const mongoose = require('mongoose');

const CartSchema = new mongoose.Schema({
    products: [
        {
            productId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Product',
                required: true,
            },
            quantity: {
                type: Number,
                required: true,
                default: 1,
            },
        },
    ],
});

const Cart = mongoose.model('Cart', CartSchema);
module.exports = Cart;

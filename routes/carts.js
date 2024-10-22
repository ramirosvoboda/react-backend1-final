// routes/carts.js
const express = require('express');
const router = express.Router();
const Cart = require('../models/Cart');

// Crear un nuevo carrito
router.post('/', async (req, res) => {
    try {
        const newCart = new Cart(req.body);
        await newCart.save();
        res.status(201).json({ status: 'success', payload: newCart });
    } catch (error) {
        res.status(400).json({ status: 'error', message: error.message });
    }
});

// Eliminar un producto del carrito
router.delete('/:cid/products/:pid', async (req, res) => {
    try {
        const cart = await Cart.findById(req.params.cid);
        if (!cart) {
            return res.status(404).json({ status: 'error', message: 'Cart not found' });
        }

        cart.products = cart.products.filter(product => product.productId.toString() !== req.params.pid);
        await cart.save();
        res.json({ status: 'success', payload: cart });
    } catch (error) {
        res.status(400).json({ status: 'error', message: error.message });
    }
});

// Actualizar el carrito con un arreglo de productos
router.put('/:cid', async (req, res) => {
    try {
        if (!Array.isArray(req.body.products)) {
            return res.status(400).json({ status: 'error', message: 'Products should be an array' });
        }

        const updatedCart = await Cart.findByIdAndUpdate(req.params.cid, { products: req.body.products }, { new: true });
        if (!updatedCart) {
            return res.status(404).json({ status: 'error', message: 'Cart not found' });
        }
        res.json({ status: 'success', payload: updatedCart });
    } catch (error) {
        res.status(400).json({ status: 'error', message: error.message });
    }
});

// Actualizar la cantidad de un producto específico en el carrito
router.put('/:cid/products/:pid', async (req, res) => {
    try {
        const cart = await Cart.findById(req.params.cid);
        if (!cart) {
            return res.status(404).json({ status: 'error', message: 'Cart not found' });
        }

        const product = cart.products.find(product => product.productId.toString() === req.params.pid);
        if (product) {
            product.quantity = req.body.quantity;
            await cart.save();
            res.json({ status: 'success', payload: cart });
        } else {
            res.status(404).json({ status: 'error', message: 'Product not found in cart' });
        }
    } catch (error) {
        res.status(400).json({ status: 'error', message: error.message });
    }
});

// Eliminar todos los productos del carrito
router.delete('/:cid', async (req, res) => {
    try {
        const cart = await Cart.findById(req.params.cid);
        if (!cart) {
            return res.status(404).json({ status: 'error', message: 'Cart not found' });
        }

        cart.products = []; // Vaciar el carrito
        await cart.save();
        res.json({ status: 'success', message: 'Cart cleared' });
    } catch (error) {
        res.status(400).json({ status: 'error', message: error.message });
    }
});

// Obtener todos los productos de un carrito específico y hacer populate
router.get('/:cid', async (req, res) => {
    try {
        const cart = await Cart.findById(req.params.cid).populate('products.productId');
        if (!cart) {
            return res.status(404).json({ status: 'error', message: 'Cart not found' });
        }
        res.json({ status: 'success', payload: cart });
    } catch (error) {
        res.status(400).json({ status: 'error', message: error.message });
    }
});

module.exports = router;

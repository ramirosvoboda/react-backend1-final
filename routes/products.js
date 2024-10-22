const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

// Función para leer los productos desde el archivo JSON
const readProductsFromFile = () => {
    const filePath = path.join(__dirname, '../data/products.json');
    const rawData = fs.readFileSync(filePath);
    return JSON.parse(rawData);
};

// Obtener productos con paginación, filtros y ordenamientos
router.get('/', (req, res) => {
    try {
        // Obtener y validar parámetros de consulta
        const { limit = 10, page = 1, sort, query } = req.query;
        const filter = {};
        
        // Establecer limit y page como números
        const limitNumber = Number(limit);
        const pageNumber = Number(page);

        // Filtros por categoría o disponibilidad
        if (query) {
            filter.$or = [
                { category: query },
                { available: query.toLowerCase() === 'true' }
            ];
        }

        // Leer los productos desde el archivo JSON
        const products = readProductsFromFile();
        const filteredProducts = products.filter(product => {
            return (!query || product.category === query || product.available === (query.toLowerCase() === 'true'));
        });

        const totalProducts = filteredProducts.length;
        const totalPages = Math.ceil(totalProducts / limitNumber);
        const paginatedProducts = filteredProducts.slice((pageNumber - 1) * limitNumber, pageNumber * limitNumber);

        res.json({
            status: 'success',
            payload: paginatedProducts,
            totalPages,
            prevPage: pageNumber > 1 ? pageNumber - 1 : null,
            nextPage: pageNumber < totalPages ? pageNumber + 1 : null,
            page: pageNumber,
            hasPrevPage: pageNumber > 1,
            hasNextPage: pageNumber < totalPages,
            prevLink: pageNumber > 1 ? `/api/products?limit=${limitNumber}&page=${pageNumber - 1}` : null,
            nextLink: pageNumber < totalPages ? `/api/products?limit=${limitNumber}&page=${pageNumber + 1}` : null,
        });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
});

// Agregar un nuevo producto
router.post('/', async (req, res) => {
    try {
        const newProduct = req.body;
        newProduct._id = (Math.random() * 100000).toString(); // Asignar un ID aleatorio (puedes cambiarlo a un mejor método)
        
        // Leer los productos existentes
        const products = readProductsFromFile();
        products.push(newProduct);
        
        // Guardar los productos de nuevo en el archivo JSON
        fs.writeFileSync(path.join(__dirname, '../data/products.json'), JSON.stringify(products, null, 2));
        
        res.status(201).json({ status: 'success', payload: newProduct });
    } catch (error) {
        res.status(400).json({ status: 'error', message: error.message });
    }
});

module.exports = router;

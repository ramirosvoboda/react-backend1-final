const express = require('express');
const cors = require('cors');
const connectDB = require('./db');
const productRoutes = require('./routes/products');
const cartRoutes = require('./routes/carts');
const { engine } = require('express-handlebars');
require('dotenv').config();

const app = express();
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configuración de Handlebars como motor de plantillas
app.engine('handlebars', engine());
app.set('view engine', 'handlebars');

// Rutas para la API
app.use('/api/products', productRoutes);
app.use('/api/carts', cartRoutes);

// Rutas para las vistas
app.get('/', (req, res) => {
    res.redirect('/products');  // Redirige a la lista de productos
});

app.get('/products', (req, res) => {
    res.render('index'); // Renderiza la vista para la lista de productos
});

app.get('/products/:pid', (req, res) => {
    res.render('product', { productId: req.params.pid }); // Renderiza la vista del producto con el ID correspondiente
});

// Iniciar el servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});

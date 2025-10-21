const express = require('express');
const router = express.Router();
const db = require('../db');

// Get all products
router.get('/', async(req, res) => {
    try {
        console.log('📦 Fetching products from database...');

        // Try different query approaches:

        // Approach 1: Simple query
        const [products] = await db.query('SELECT * FROM products');
        console.log(`✅ Found ${products.length} products`);

        // If no products in database, return sample data
        if (products.length === 0) {
            console.log('📝 No products in database, returning sample data');
            const sampleProducts = [{
                    product_id: 1,
                    name: "MacBook Pro 14\"",
                    price: 1999.99,
                    description: "Apple MacBook Pro with M3 chip",
                    image: "laptop.jpg",
                    category: "Laptops",
                    stock_quantity: 10
                },
                {
                    product_id: 2,
                    name: "Wireless Mouse",
                    price: 49.99,
                    description: "Ergonomic wireless mouse",
                    image: "mouse.jpg",
                    category: "Accessories",
                    stock_quantity: 25
                }
            ];
            return res.json(sampleProducts);
        }

        // Add image_url to each product
        const productsWithUrls = products.map(product => ({
            ...product,
            image_url: product.image ? `http://localhost:5000/api/images/${product.image}` : null
        }));

        res.json(productsWithUrls);

    } catch (error) {
        console.error('❌ Database error:', error);

        // Return sample data if database query fails
        const fallbackProducts = [{
                product_id: 1,
                name: "MacBook Pro 14\"",
                price: 1999.99,
                description: "Apple MacBook Pro with M3 chip",
                image: "laptop.jpg",
                category: "Laptops",
                stock_quantity: 10
            },
            {
                product_id: 2,
                name: "Wireless Mouse",
                price: 49.99,
                description: "Ergonomic wireless mouse",
                image: "mouse.jpg",
                category: "Accessories",
                stock_quantity: 25
            }
        ];

        res.json(fallbackProducts);
    }
});

// Get single product
router.get('/:id', async(req, res) => {
    try {
        const [products] = await db.query(
            'SELECT * FROM products WHERE product_id = ?', [req.params.id]
        );

        if (products.length === 0) {
            return res.status(404).json({ error: 'Product not found' });
        }

        res.json(products[0]);
    } catch (error) {
        console.error('Error fetching product:', error);
        res.status(500).json({ error: 'Failed to fetch product' });
    }
});

module.exports = router;
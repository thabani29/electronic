const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const multer = require('multer');
const mysql2 = require('mysql2');
const db = require('./db');

// Load environment variables at the very top
dotenv.config();

const productsRouter = require('./routes/products');
const ordersRouter = require('./routes/orders');

const app = express();

// CORS setup - FIXED VERSION
const allowedOrigins = [
    'https://electronicstore.infinityfree.me',
    'http://localhost:3000',
    'http://localhost:5173',
    'http://localhost:5174',
    'https://electronic-vzq5.onrender.com'
];

// Use cors middleware with proper configuration
app.use(cors({
    origin: function(origin, callback) {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);

        if (allowedOrigins.indexOf(origin) !== -1) {
            return callback(null, true);
        } else {
            console.log('CORS blocked for origin:', origin);
            return callback(new Error('Not allowed by CORS'), false);
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// Handle preflight requests
app.options('*', cors());

// Manual CORS headers as backup (simplified)
app.use((req, res, next) => {
    const origin = req.headers.origin;
    if (allowedOrigins.includes(origin)) {
        res.header('Access-Control-Allow-Origin', origin);
    }
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
    res.header('Access-Control-Allow-Credentials', 'true');

    // Handle preflight
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }
    next();
});

app.use(express.json());

// Serve uploaded images (local testing only)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Multer setup for image uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        // Create uploads directory if it doesn't exist
        const fs = require('fs');
        if (!fs.existsSync('uploads')) {
            fs.mkdirSync('uploads');
        }
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});
const upload = multer({
    storage,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    }
});

// Upload route
app.post('/api/upload', upload.single('image'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: 'No image uploaded' });
    }

    // Use deployed backend URL in production or localhost for dev
    const baseUrl = process.env.BACKEND_URL || 'https://electronic-vzq5.onrender.com';
    const imageUrl = `${baseUrl}/uploads/${req.file.filename}`;
    res.json({ image_url: imageUrl });
});

// NEW: Serve product images from database
app.get('/api/images/:imageName', (req, res) => {
    const imageName = req.params.imageName;

    // Security check - prevent directory traversal
    if (imageName.includes('..') || imageName.includes('/') || imageName.includes('\\')) {
        return res.status(400).json({ error: 'Invalid image name' });
    }

    const imagePath = path.join(__dirname, 'uploads', imageName);

    // Check if file exists
    const fs = require('fs');
    if (fs.existsSync(imagePath)) {
        // Determine content type based on file extension
        const ext = path.extname(imageName).toLowerCase();
        const contentTypes = {
            '.jpg': 'image/jpeg',
            '.jpeg': 'image/jpeg',
            '.png': 'image/png',
            '.gif': 'image/gif',
            '.webp': 'image/webp',
            '.svg': 'image/svg+xml'
        };

        const contentType = contentTypes[ext] || 'image/jpeg';
        res.setHeader('Content-Type', contentType);

        // Serve the image file
        res.sendFile(imagePath);
    } else {
        // Return a default placeholder image if file doesn't exist
        const placeholderSvg = `
            <svg xmlns="http://www.w3.org/2000/svg" width="200" height="150" viewBox="0 0 200 150">
                <rect width="200" height="150" fill="#f3f4f6"/>
                <text x="100" y="75" text-anchor="middle" dominant-baseline="middle" font-family="Arial" font-size="14" fill="#6b7280">
                    Image Not Found
                </text>
            </svg>
        `;
        res.setHeader('Content-Type', 'image/svg+xml');
        res.send(placeholderSvg);
    }
});

// NEW: Get all available images
app.get('/api/images', async(req, res) => {
    try {
        const fs = require('fs').promises;
        const uploadsDir = path.join(__dirname, 'uploads');

        // Read all files in uploads directory
        const files = await fs.readdir(uploadsDir);

        // Filter image files
        const imageFiles = files.filter(file => {
            const ext = path.extname(file).toLowerCase();
            return ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'].includes(ext);
        });

        // Create full URLs for each image
        const baseUrl = process.env.BACKEND_URL || 'https://electronic-vzq5.onrender.com';
        const images = imageFiles.map(file => ({
            filename: file,
            url: `${baseUrl}/api/images/${file}`,
            thumbnail_url: `${baseUrl}/api/images/${file}?size=thumbnail`
        }));

        res.json({
            success: true,
            count: images.length,
            images: images
        });
    } catch (error) {
        console.error('Error reading images directory:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to read images directory'
        });
    }
});

// API routes
app.use('/api/products', productsRouter);
app.use('/api/orders', ordersRouter);

// Health check with CORS
app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'OK',
        message: 'Server is healthy',
        timestamp: new Date().toISOString(),
        allowedOrigins: allowedOrigins
    });
});

// Test CORS route
app.get('/api/test-cors', (req, res) => {
    res.json({
        message: 'CORS is working!',
        origin: req.headers.origin,
        allowed: allowedOrigins.includes(req.headers.origin)
    });
});

// Default route
app.get('/', (req, res) => res.send('Electronic Store API running 🚀'));

// Error handling middleware
app.use((err, req, res, next) => {
    if (err.message === 'Not allowed by CORS') {
        return res.status(403).json({
            error: 'CORS Error',
            message: `Origin ${req.headers.origin} not allowed`,
            allowedOrigins: allowedOrigins
        });
    }
    console.error('Server error:', err);
    res.status(500).json({ error: 'Internal Server Error' });
});

// Start server
const PORT = process.env.PORT || 'https://electronic-vzq5.onrender.com';
app.listen(PORT, () => {
    console.log(`✅ Server running on port ${PORT}`);
    console.log(`🌐 Allowed CORS origins:`, allowedOrigins);
    console.log(`🔗 Health check:   https://electronic-vzq5.onrender.com/health`);
    console.log(`🔗 CORS test:   https://electronic-vzq5.onrender.com/api/test-cors`);
    console.log(`🖼️  Images API:   https://electronic-vzq5.onrender.com/api/images`);
});
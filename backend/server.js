const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const multer = require('multer');
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

app.use(express.json());

// Serve uploaded images
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Multer setup for image uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
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
        fileSize: 5 * 1024 * 1024
    }
});

// Upload route
app.post('/api/upload', upload.single('image'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: 'No image uploaded' });
    }

    const baseUrl = process.env.BACKEND_URL || 'https://electronic-vzq5.onrender.com';
    const imageUrl = `${baseUrl}/uploads/${req.file.filename}`;
    res.json({ image_url: imageUrl });
});

// Serve product images
app.get('/api/images/:imageName', (req, res) => {
    const imageName = req.params.imageName;

    // Security check
    if (imageName.includes('..') || imageName.includes('/') || imageName.includes('\\')) {
        return res.status(400).json({ error: 'Invalid image name' });
    }

    const imagePath = path.join(__dirname, 'uploads', imageName);
    const fs = require('fs');

    if (fs.existsSync(imagePath)) {
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
        res.sendFile(imagePath);
    } else {
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

// Get all available images
app.get('/api/images', async(req, res) => {
    try {
        const fs = require('fs').promises;
        const uploadsDir = path.join(__dirname, 'uploads');
        const files = await fs.readdir(uploadsDir);
        const imageFiles = files.filter(file => {
            const ext = path.extname(file).toLowerCase();
            return ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'].includes(ext);
        });

        const baseUrl = process.env.BACKEND_URL || 'https://electronic-vzq5.onrender.com';
        const images = imageFiles.map(file => ({
            filename: file,
            url: `${baseUrl}/api/images/${file}`
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

// Health check
app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'OK',
        message: 'Server is healthy',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development'
    });
});

// Default route
app.get('/', (req, res) => res.send('Electronic Store API running 🚀'));

// Error handling middleware
app.use((err, req, res, next) => {
    if (err.message === 'Not allowed by CORS') {
        return res.status(403).json({
            error: 'CORS Error',
            message: `Origin ${req.headers.origin} not allowed`
        });
    }
    console.error('Server error:', err);
    res.status(500).json({ error: 'Internal Server Error' });
});

// Start server - FIXED PORT CONFIGURATION
const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`✅ Server running on port ${PORT}`);
    console.log(`🌐 Environment: ${process.env.NODE_ENV || 'development'}`);

    if (process.env.NODE_ENV === 'production') {
        console.log(`🔗 Production URL: https://electronic-vzq5.onrender.com`);
        console.log(`🔗 Health check: https://electronic-vzq5.onrender.com/health`);
    } else {
        console.log(`🔗 Local URL: http://localhost:${PORT}`);
        console.log(`🔗 Health check: http://localhost:${PORT}/health`);
    }
});
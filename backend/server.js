const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const multer = require('multer');

const productsRouter = require('./routes/products');
const ordersRouter = require('./routes/orders');

dotenv.config();
const app = express();

// ✅ FIXED CORS Configuration
app.use(cors({
  origin: [
    'https://electronicstore.infinityfree.me',
    'http://electronicstore.infinityfree.me',
    'http://localhost:3000',
    'http://localhost:5173'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
}));

app.use(express.json());

// ✅ Serve uploaded images publicly
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ✅ Multer setup for image uploads
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function(req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});
const upload = multer({ storage });

// ✅ FIXED Upload route - Use absolute URL for Render
app.post('/api/upload', upload.single('image'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: 'No image uploaded' });
    }

    // ✅ FIX: Use your Render URL instead of dynamic host
    const imageUrl = `https://electronic-vzq5.onrender.com/uploads/${req.file.filename}`;

    // Return full URL for frontend
    res.json({ image_url: imageUrl });
});

// ✅ Product and Order Routes
app.use('/api/products', productsRouter);
app.use('/api/orders', ordersRouter);

// ✅ Default route
app.get('/', (req, res) => res.send('Electronic Store API running 🚀'));

// ✅ Health check route (important for Render)
app.get('/health', (req, res) => {
    res.status(200).json({ 
        status: 'OK', 
        message: 'Server is healthy',
        timestamp: new Date().toISOString()
    });
});

// ✅ Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));

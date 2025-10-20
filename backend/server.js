const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const productsRouter = require('./routes/products');
const ordersRouter = require('./routes/orders');

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/products', productsRouter);
app.use('/api/orders', ordersRouter);

app.get('/', (req, res) => res.send('Electronic Store API'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

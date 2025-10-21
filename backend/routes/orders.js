const express = require('express');
const router = express.Router();
const db = require('../db');

// create order
router.post('/', async(req, res) => {
    try {
        const { user_id = null, total, items } = req.body;
        const itemsJson = JSON.stringify(items || []);
        const [result] = await db.query('INSERT INTO orders (user_id, total, items_json) VALUES (?, ?, ?)', [user_id, total, itemsJson]);
        res.json({ success: true, orderId: result.insertId });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
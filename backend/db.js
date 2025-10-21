const mysql = require('mysql2');
require('dotenv').config();

const connectionConfig = {
    host: process.env.DB_HOST || 'https://electronic-vzq5.onrender.com',
    user: process.env.DB_USER || 'render_user',
    password: process.env.DB_PASSWORD || 'cd0930b8a14ececd022edadc7ad6ccfc',
    database: process.env.DB_NAME || 'electronicstore',
    port: process.env.DB_PORT || 3306,
    waitForConnections: true,
    connectionLimit: 10
};

const pool = mysql.createPool(connectionConfig);

pool.getConnection((err, conn) => {
    if (err) {
        console.error('❌ MySQL connection error:', err.message || err);
    } else {
        console.log('✅ Connected to MySQL (pool)');
        conn.release();
    }
});

module.exports = pool.promise();
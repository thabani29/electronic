const mysql = require('mysql2');
require('dotenv').config(); // Must be first

// Create a connection pool using Clever Cloud environment variables
const pool = mysql.createPool({
    host: process.env.MYSQL_ADDON_HOST,
    user: process.env.MYSQL_ADDON_USER,
    password: process.env.MYSQL_ADDON_PASSWORD,
    database: process.env.MYSQL_ADDON_DB,
    port: process.env.MYSQL_ADDON_PORT || 3306,
    waitForConnections: true,
    connectionLimit: 10
});

// Test connection
pool.getConnection((err, conn) => {
    if (err) {
        console.error('❌ MySQL connection error:', err.message || err);
    } else {
        console.log('✅ Connected to MySQL (pool)');
        conn.release();
    }
});

module.exports = pool.promise();
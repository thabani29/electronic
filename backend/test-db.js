const db = require('./db');

(async() => {
    try {
        const [rows] = await db.query('SELECT 1+1 AS result');
        console.log('✅ DB test result:', rows);
        process.exit(0); // exit after test
    } catch (err) {
        console.error('❌ DB test error:', err);
        process.exit(1);
    }
})();
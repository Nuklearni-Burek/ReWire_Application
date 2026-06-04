const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 6361;

// Middleware
app.use(cors());
app.use(express.json()); // Allows Express to read JSON data sent from React

// Create MySQL Database Connection Pool
const db = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// User Registration, inserting into the "users" table, and double validating password
app.post('/api/register', (req, res) => {
    const { username, password, confirmPassword } = req.body;

    // Validation checks
    if (!username || !password || !confirmPassword) {
        return res.status(400).json({ error: "All fields are required." });
    }
    if (password !== confirmPassword) {
        return res.status(400).json({ error: "Passwords do not match." });
    }

    // Insert user into your exact 'users' table
    const query = 'INSERT INTO users (username, password) VALUES (?, ?)';
    db.query(query, [username, password], (err, result) => {
        if (err) {
            if (err.code === 'ER_DUP_ENTRY') {
                return res.status(400).json({ error: "Username already exists." });
            }
            return res.status(500).json({ error: "Database error during registration." });
        }
        res.status(201).json({ message: "Registration successful!", userId: result.insertId });
    });
});


// 2. User Login
app.post('/api/login', (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ error: "All fields are required." });
    }

    const query = 'SELECT * FROM users WHERE username = ?';
    db.query(query, [username], (err, results) => {
        if (err) return res.status(500).json({ error: "Database error during login." });

        if (results.length === 0 || results[0].password !== password) {
            return res.status(401).json({ error: "Invalid username or password." });
        }

        const user = results[0];

        // Determine if they are the admin based on your requirement:
        // "The system supports two distinct types of users: standard users and a single, unique administrator."
        // We can define the admin by username (e.g., 'admin') or a specific ID
        const isAdmin = user.username.toLowerCase() === 'admin';

        res.json({
            message: "Login successful!",
            user: {
                id: user.id,
                username: user.username,
                role: isAdmin ? 'admin' : 'standard'
            }
        });
    });
});


// Test Database Connection
db.getConnection((err, connection) => {
    if (err) {
        console.error('❌ Database connection failed:', err.message);
    } else {
        console.log('✅ Connected successfully to the university MySQL database.');
        connection.release(); // Return connection to pool
    }
});

// Basic Live-Check Route
app.get('/api/health', (req, res) => {
    res.json({ 
        status: "success", 
        message: "ReWire Backend is running smoothly!",
        port: PORT 
    });
});

// Start Server
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});
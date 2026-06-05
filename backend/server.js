const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');
const session = require('express-session');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 6361;

// 1. MIDDLEWARE
app.use(cors({
    origin: 'http://88.200.63.148:5173', // Must match your exact frontend URL
    credentials: true // Allows cookies to travel back and forth
}));
app.use(express.json());

// Configure Express Session Middleware
app.use(session({
    secret: 'rewire_secret_key_2026', // A strong secret to sign the session ID cookie
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false, // Set to true only if using HTTPS
        httpOnly: true, // Prevents frontend JavaScript from reading the cookie (XSS protection)
        maxAge: 24 * 60 * 60 * 1000 // Cookie expires in 24 hours
    }
}));

// 2. DATABASE CONFIGURATION
const db = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// 3. CORE ENDPOINTS

// Check Auth Status (Called by frontend on page refresh)
app.get('/api/me', (req, res) => {
    if (req.session.user) {
        res.json({ loggedIn: true, user: req.session.user });
    } else {
        res.json({ loggedIn: false });
    }
});

// User Registration
app.post('/api/register', (req, res) => {
    const { username, password, confirmPassword } = req.body;
    if (!username || !password || !confirmPassword) {
        return res.status(400).json({ error: "All fields are required." });
    }
    if (password !== confirmPassword) {
        return res.status(400).json({ error: "Passwords do not match." });
    }

    const query = 'INSERT INTO users (username, password) VALUES (?, ?)';
    db.query(query, [username, password], (err, result) => {
        if (err) {
            if (err.code === 'ER_DUP_ENTRY') return res.status(400).json({ error: "Username already exists." });
            return res.status(500).json({ error: "Database error." });
        }
        res.status(201).json({ message: "Registration successful!" });
    });
});

// User Login (Saves data to session)
app.post('/api/login', (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) return res.status(400).json({ error: "All fields are required." });

    const query = 'SELECT * FROM users WHERE username = ?';
    db.query(query, [username], (err, results) => {
        if (err) return res.status(500).json({ error: "Database error." });
        if (results.length === 0 || results[0].password !== password) {
            return res.status(401).json({ error: "Invalid username or password." });
        }

        const user = results[0];
        const isAdmin = user.username.toLowerCase() === 'admin';

        // Save data explicitly into session memory
        req.session.user = {
            id: user.id,
            username: user.username,
            role: isAdmin ? 'admin' : 'standard'
        };

        res.json({ message: "Login successful!", user: req.session.user });
    });
});

// User Logout (Destroys session)
app.post('/api/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) return res.status(500).json({ error: "Could not log out." });
        res.clearCookie('connect.sid'); // Clear session cookie
        res.json({ message: "Logged out successfully." });
    });
});

// Fetch Marketplace Items
app.get('/api/items', (req, res) => {
    const query = `
        SELECT items.*, users.username FROM items 
        JOIN users ON items.user_id = users.id
        WHERE items.id NOT IN (SELECT item_id FROM purchases)
        ORDER BY items.created_at DESC`;
    db.query(query, (err, results) => {
        if (err) return res.status(500).json({ error: "Database error." });
        res.json(results);
    });
});

// List an Item
app.post('/api/items', (req, res) => {
    const { title, description, price, image_url, user_id } = req.body;
    if (!title || !description || !price || !user_id) return res.status(400).json({ error: "Missing fields." });

    const query = 'INSERT INTO items (title, description, price, image_url, user_id) VALUES (?, ?, ?, ?, ?)';
    db.query(query, [title, description, price, image_url || null, user_id], (err, result) => {
        if (err) return res.status(500).json({ error: "Database error." });
        res.status(201).json({ message: "Item listed successfully!" });
    });
});

app.listen(PORT, () => {
    console.log(`🚀 Session-secured Server running on port ${PORT}`);
});
/**
 * =========================================================================
 * SAPA INKLUSI — Express REST API Server
 * =========================================================================
 * Port: 3000 (Default)
 * Serves API endpoints and can also optionally serve the static frontend.
 */

const express = require('express');
const cors = require('cors');
const path = require('path');
const apiRoutes = require('./routes/api');

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request Logger
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
    next();
});

// API Routes
app.use('/api', apiRoutes);

// Serve Static Frontend (Optional fullstack mode)
const publicDir = path.join(__dirname, '..');
app.use(express.static(publicDir));

// Fallback to index.html
app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api')) return next();
    res.sendFile(path.join(publicDir, 'index.html'));
});

// Global Error Handler
app.use((err, req, res, next) => {
    console.error('Server error:', err);
    res.status(500).json({
        success: false,
        message: 'Internal Server Error',
        error: err.message
    });
});

app.listen(PORT, () => {
    console.log(`=========================================`);
    console.log(`SAPA INKLUSI Backend Server running on:`);
    console.log(`👉 http://localhost:${PORT}`);
    console.log(`👉 API Health: http://localhost:${PORT}/api/health`);
    console.log(`=========================================`);
});

module.exports = app;

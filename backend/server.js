require('dotenv').config();
const express = require('express');
const cors = require('cors');
const userManagementRoutes = require('./routes/user-management.routes');

const app = express();

// CORS Configuration
app.use(cors({
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    credentials: true,
    maxAge: 86400
}));

// Other Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api', userManagementRoutes);

// Error Handling Middleware
app.use((err, req, res, next) => {
    console.error('Error details:', {
        message: err.message,
        stack: err.stack,
        path: req.path,
        method: req.method,
        body: req.body
    });
    
    res.status(err.status || 500).json({
        success: false,
        error: process.env.NODE_ENV === 'development' 
            ? err.message 
            : 'Internal server error',
        details: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
});

// Start Server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
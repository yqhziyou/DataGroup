require('dotenv').config();
const express = require('express');
const cors = require('cors');
const userManagementRoutes = require('./routes/user-management.routes');

const app = express();

// CORS 配置
app.use(cors({
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    credentials: true,
    maxAge: 86400
}));

// 其他中间件
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 路由
app.use('/api', userManagementRoutes);

// 错误处理中间件
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

// 启动服务器
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// 请求拦截器
api.interceptors.request.use(
    (config) => {
        // 可以在这里添加token等认证信息
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// 响应拦截器
api.interceptors.response.use(
    (response) => response.data,
    (error) => {
        // 统一错误处理
        console.error('API Error:', error);
        return Promise.reject(error);
    }
);

export default api;
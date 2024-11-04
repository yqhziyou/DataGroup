import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request Interceptor
api.interceptors.request.use(
    (config) => {
        // Add token or other authentication information here
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

    // Response Interceptor
api.interceptors.response.use(
    (response) => response.data,
    (error) => {
        // Unified error handling
        console.error('API Error:', error);
        return Promise.reject(error);
    }
);

export default api;
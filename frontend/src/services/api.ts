import axios, { InternalAxiosRequestConfig } from 'axios';
import { getAuthToken } from './authService';

const api = axios.create({
    baseURL: process.env.REACT_APP_API_BASE_URL,
});

api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
    const token = getAuthToken();
    if (token) {
        config.headers.set('Authorization', `${token}`);
    }
    return config;
});

export default api;
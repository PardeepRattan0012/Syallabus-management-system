import axios from 'axios';
import { useAuthStore } from './store/authStore';

const api = axios.create({
  baseURL: "https://syallabus-management-system.onrender.com"
});

api.interceptors.request.use(config => {
    const user = useAuthStore.getState().user;
    if (user && user.token) {
        config.headers.Authorization = `Bearer ${user.token}`;
    }
    return config;
}, error => {
    return Promise.reject(error);
});

export default api;

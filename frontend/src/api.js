// src/api.js
import axios from 'axios';

const API = axios.create({
    baseURL: 'http://localhost:5000/api', // <-- Ensure this matches your Node.js port
    headers: {
        'Content-Type': 'application/json',
    }
});

// Utility to set Authorization header for secured routes
export const setToken = (token) => {
    if (token) {
        API.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
        delete API.defaults.headers.common['Authorization'];
    }
};

export default API;
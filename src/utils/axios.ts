import axios from 'axios';

const API_BASE_URL = 'https://ridenow.aitechstaging.com/api';




export const axiosInstance = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 10000,
});



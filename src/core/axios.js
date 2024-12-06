import axios from "axios";

export const url = 'http://localhost:4000/api';
const $api = axios.create({
    baseURL: url,
    headers: {
        'Content-Type': 'application/json',
    },
});

$api.interceptors.request.use(async config => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, error => {
    return Promise.reject(error);
});

export const fetcher = async (url, init = {}) => {
    try {
        const token = localStorage.getItem('token');
        
        const headers = {
            'Authorization': `Bearer ${token}`,
            ...init.headers
        };

        if (init.method === 'POST' && init.body instanceof FormData) {
            delete headers['Content-Type'];
        } else {
            headers['Content-Type'] = 'application/json';
        }

        const response = await fetch(url, { ...init, headers });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Response error:', errorText); 
            throw new Error(`Request failed with status ${response.status}`);
        }

        const contentType = response.headers.get('content-type');
        if (contentType?.includes('application/json')) {
            return await response.json();
        }

        return await response.text();
    } catch (error) {
        console.error('Error fetching data:', error);
        throw error; 
    }
};



export default $api
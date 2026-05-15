const API_URL = window.location.origin.includes('localhost') ? 'http://localhost:3000/api' : '/api';

const api = {
    token: localStorage.getItem('token'),

    headers() {
        const h = { 'Content-Type': 'application/json' };
        if (this.token) h['Authorization'] = `Bearer ${this.token}`;
        return h;
    },

    async post(endpoint, data) {
        const res = await fetch(`${API_URL}${endpoint}`, { method: 'POST', headers: this.headers(), body: JSON.stringify(data) });
        if (res.status === 401) { localStorage.removeItem('token'); location.hash = '#login'; }
        return res.json();
    },

    async get(endpoint) {
        const res = await fetch(`${API_URL}${endpoint}`, { headers: this.headers() });
        if (res.status === 401) { localStorage.removeItem('token'); location.hash = '#login'; }
        return res.json();
    },

    async put(endpoint, data) {
        const res = await fetch(`${API_URL}${endpoint}`, { method: 'PUT', headers: this.headers(), body: JSON.stringify(data) });
        return res.json();
    },

    async del(endpoint) {
        const res = await fetch(`${API_URL}${endpoint}`, { method: 'DELETE', headers: this.headers() });
        return res.json();
    },

    setToken(t) { this.token = t; localStorage.setItem('token', t); },
    clearToken() { this.token = null; localStorage.removeItem('token'); }
};

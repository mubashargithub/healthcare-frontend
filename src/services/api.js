import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || '';

const api = axios.create({
    baseURL: `${API_URL}/api`,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add a request interceptor to include JWT token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Add a response interceptor for global error handling
api.interceptors.response.use(
    (response) => response,
    (error) => {
        const originalRequest = error.config;
        if (error.response?.status === 401 && !originalRequest._retry && !originalRequest.url.includes('/auth/login')) {
            // Token expired or invalid, and not a login attempt
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            if (window.location.pathname !== '/login') {
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);

export const authService = {
    login: (credentials) => api.post('/auth/login', credentials),
    signup: (userData) => api.post('/auth/signup', userData),
};

export const aiService = {
    predict: (symptoms) => api.post('/ai/predict', { symptoms }),
    getSymptoms: () => api.get('/ai/symptoms'),
    savePrediction: (predictionData) => api.post('/ai/save', predictionData),
};

export const dataService = {
    getAllDoctors: (params) => api.get('/doctors', { params }),
    getDoctors: (params) => api.get('/doctors/recommend', { params }),
    getPharmacies: (params) => api.get('/pharmacies', { params }),
    getNearbyPharmacies: (params) => api.get('/pharmacies/nearby', { params }),
    geocodeLocation: (params) => api.get('/pharmacies/geocode', { params }),
    getHistory: () => api.get('/ai/history'),
};

export const adminService = {
    getUsers: (params) => api.get('/admin/users', { params }),
    createUser: (userData) => api.post('/admin/users', userData),
    updateUser: (id, userData) => api.put(`/admin/users/${id}`, userData),
    deleteUser: (id) => api.delete(`/admin/users/${id}`),
    promoteUser: (id) => api.put(`/admin/users/${id}/promote`),
    getAdmins: () => api.get('/admin/admins'),
    createAdmin: (adminData) => api.post('/admin/admins', adminData),
    revokeAdmin: (id) => api.put(`/admin/admins/${id}/revoke`),
    deleteAdmin: (id) => api.delete(`/admin/admins/${id}`),
    // Doctors
    getDoctors: (params) => api.get('/admin/doctors', { params }),
    createDoctor: (doctorData) => api.post('/admin/doctors', doctorData),
    updateDoctor: (id, doctorData) => api.put(`/admin/doctors/${id}`, doctorData),
    deleteDoctor: (id) => api.delete(`/admin/doctors/${id}`),
    // Pharmacies
    getPharmacies: (params) => api.get('/admin/pharmacies', { params }),
    updatePharmacy: (id, pharmacyData) => api.put(`/admin/pharmacies/${id}`, pharmacyData),
    deletePharmacy: (id) => api.delete(`/admin/pharmacies/${id}`),
};

export const activityService = {
    logActivity: (activityData) => api.post('/activities', activityData),
    getActivities: (params) => api.get('/activities', { params }),
    getActivityStats: () => api.get('/activities/stats'),
    getPopularDoctors: () => api.get('/activities/popular-doctors'),
};

export const contactService = {
    submitMessage: (messageData) => api.post('/contact', messageData)
};

export default api;

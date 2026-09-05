import axios from 'axios';

// Single Axios instance
const API = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Attach Token Interceptor
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('uniconnect_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor for Error Handling
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Optional auto-logout on token expiration
      // localStorage.removeItem('uniconnect_token');
    }
    return Promise.reject(error);
  }
);

// Auth Service Endpoints
export const authAPI = {
  login: (credentials) => API.post('/auth/login', credentials),
  register: (userData) => API.post('/auth/register', userData),
  getMe: () => API.get('/auth/me')
};

// Listings Service Endpoints
export const listingsAPI = {
  getAll: (params) => API.get('/listings', { params }),
  getById: (id) => API.get(`/listings/${id}`),
  create: (data) => API.post('/listings', data),
  update: (id, data) => API.put(`/listings/${id}`, data),
  delete: (id) => API.delete(`/listings/${id}`)
};

// Orders & Bookings Service Endpoints
export const ordersAPI = {
  create: (data) => API.post('/orders', data),
  getMyRequests: () => API.get('/orders/my-requests'),
  getMyIncoming: () => API.get('/orders/my-incoming'),
  updateStatus: (id, status) => API.patch(`/orders/${id}/status`, { status })
};

// Equipment Rentals Service Endpoints
export const rentalsAPI = {
  getCategories: () => API.get('/rentals/categories'),
  getItems: (params) => API.get('/rentals/items', { params }),
  getItemById: (id) => API.get(`/rentals/items/${id}`),
  createItem: (data) => API.post('/rentals/items', data),
  createBooking: (data) => API.post('/rentals/bookings', data),
  getBookings: () => API.get('/rentals/bookings')
};

// Part-Time Jobs Service Endpoints
export const jobsAPI = {
  getAll: (params) => API.get('/jobs', { params }),
  getById: (id) => API.get(`/jobs/${id}`),
  create: (data) => API.post('/jobs', data),
  apply: (id, applicationData) => API.post(`/jobs/${id}/apply`, applicationData)
};

export default API;

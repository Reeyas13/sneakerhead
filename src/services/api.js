import axios from 'axios';

const API_URL = 'http://localhost:5001/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include auth token in requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Auth API
const authAPI = {
  register: (userData) => api.post('/users/register', userData),
  login: (credentials) => api.post('/users/login', credentials),
  getProfile: () => api.get('/users/profile'),
  updateProfile: (userData) => api.put('/users/profile', userData),
};

// Products API
const productsAPI = {
  getProducts: (params) => api.get('/products', { params }),
  getProductById: (id) => api.get(`/products/${id}`),
  getRecommendations: (id) => api.get(`/products/${id}/recommendations`),
  createProduct: (productData) => api.post('/products', productData),
  updateProduct: (id, productData) => api.put(`/products/${id}`, productData),
  deleteProduct: (id) => api.delete(`/products/${id}`),
};

// Cart API
const cartAPI = {
  getCart: () => api.get('/cart'),
  addToCart: (item) => api.post('/cart', item),
  updateCartItem: (id, data) => api.put(`/cart/${id}`, data),
  removeFromCart: (id) => api.delete(`/cart/${id}`),
  clearCart: () => api.delete('/cart'),
};

// Orders API
const ordersAPI = {
  createOrder: (orderData) => api.post('/orders', orderData),
  getOrders: () => api.get('/users/orders'),
  getOrderById: (id) => api.get(`/orders/${id}`),
  updateOrderToPaid: (id, paymentResult) => api.put(`/orders/${id}/pay`, paymentResult),
};

// Payment API
const paymentAPI = {
  createEsewaPayment: (paymentData) => api.post('/payments/esewa/create', paymentData),
  verifyEsewaPayment: (verificationData) => api.post('/payments/esewa/verify', verificationData),
};

// Admin API
const adminAPI = {
  getUsers: () => api.get('/users'),
  getAllOrders: () => api.get('/orders'),
  updateOrderStatus: (id, status) => api.put(`/orders/${id}/status`, { status }),
};

export { authAPI, productsAPI, cartAPI, ordersAPI, paymentAPI, adminAPI };

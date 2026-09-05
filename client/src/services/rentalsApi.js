import API from './api';

export const rentalsAPI = {
  getCategories: () => API.get('/rentals/categories'),
  getItems: (params) => API.get('/rentals/items', { params }),
  getItemById: (id) => API.get(`/rentals/items/${id}`),
  createItem: (data) => API.post('/rentals/items', data),
  createBooking: (data) => API.post('/rentals/bookings', data),
  getMyRequests: () => API.get('/rentals/bookings/my-requests'),
  getMyIncoming: () => API.get('/rentals/bookings/my-incoming'),
  updateStatus: (id, status) => API.patch(`/rentals/bookings/${id}/status`, { status })
};

export default rentalsAPI;

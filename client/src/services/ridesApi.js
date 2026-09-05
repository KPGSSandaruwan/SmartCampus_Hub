import API from './api';

export const ridesAPI = {
  getRiderProfile: () => API.get('/rides/rider/profile'),
  registerRider: (data) => API.post('/rides/register-rider', data),
  createRide: (data) => API.post('/rides/create', data),
  getAllRides: () => API.get('/rides'),
  getRideById: (id) => API.get(`/rides/${id}`),
  requestRide: (rideId) => API.post('/rides/request', { rideId }),
  acceptRequest: (requestId) => API.post('/rides/accept-request', { requestId }),
  completeRide: (rideId) => API.post('/rides/complete', { rideId }),
  rateRide: (data) => API.post('/rides/rate', data)
};

export default ridesAPI;

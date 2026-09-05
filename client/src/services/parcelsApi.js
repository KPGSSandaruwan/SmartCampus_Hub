import API from './api';

export const parcelsAPI = {
  createParcel: (data) => API.post('/parcels/create', data),
  getAllParcels: () => API.get('/parcels'),
  getParcelById: (id) => API.get(`/parcels/${id}`),
  trackParcel: (trackingCode) => API.get(`/parcels/track/${trackingCode}`),
  assignParcel: (parcelId, riderId) => API.post('/parcels/assign', { parcelId, riderId }),
  updateParcelStatus: (parcelId, status) => API.patch(`/parcels/${parcelId}/status`, { status }),
  completeDelivery: (parcelId) => API.post('/parcels/complete', { parcelId })
};

export default parcelsAPI;

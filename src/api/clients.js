import apiClient from './axiosConfig';




export const clientsApi = {
  
  getClients: (params) => apiClient.get('/clients/', { params }),

  
  getClient: (id) => apiClient.get(`/clients/${id}/`),

  
  createClient: (data) => apiClient.post('/clients/', data),

  
  updateClient: (id, data) => apiClient.patch(`/clients/${id}/`, data),

  
  deleteClient: (id) => apiClient.delete(`/clients/${id}/`),

  
  addContact: (clientId, data) =>
    apiClient.post(`/clients/${clientId}/add-contact/`, data),

  
  getContacts: (clientId) =>
    apiClient.get(`/clients/${clientId}/contacts/`),
};

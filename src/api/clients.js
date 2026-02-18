import apiClient from './axiosConfig';

/**
 * Clients API endpoints
 */

export const clientsApi = {
  // Fetch all clients
  getClients: (params) => apiClient.get('/clients/', { params }),

  // Fetch single client
  getClient: (id) => apiClient.get(`/clients/${id}/`),

  // Create client
  createClient: (data) => apiClient.post('/clients/', data),

  // Update client
  updateClient: (id, data) => apiClient.patch(`/clients/${id}/`, data),

  // Delete client
  deleteClient: (id) => apiClient.delete(`/clients/${id}/`),

  // Add contact to client
  addContact: (clientId, data) =>
    apiClient.post(`/clients/${clientId}/add-contact/`, data),

  // Get client contacts
  getContacts: (clientId) =>
    apiClient.get(`/clients/${clientId}/contacts/`),
};

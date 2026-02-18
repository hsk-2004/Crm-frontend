import apiClient from './axiosConfig';

/**
 * Leads API endpoints
 */

export const leadsApi = {
  // Fetch all leads
  getLeads: (params) => apiClient.get('/leads/', { params }),

  // Fetch single lead
  getLead: (id) => apiClient.get(`/leads/${id}/`),

  // Create lead
  createLead: (data) => apiClient.post('/leads/', data),

  // Update lead
  updateLead: (id, data) => apiClient.patch(`/leads/${id}/`, data),

  // Delete lead
  deleteLead: (id) => apiClient.delete(`/leads/${id}/`),

  // Convert lead to client (removes lead, creates client)
  convertToClient: (id) => apiClient.post(`/leads/${id}/convert-to-client/`),

  // Log activity for a lead
  logActivity: (leadId, data) =>
    apiClient.post(`/leads/${leadId}/log-activity/`, data),

  // Get lead activities
  getActivities: (leadId, params) =>
    apiClient.get(`/leads/${leadId}/activities/`, { params }),
};

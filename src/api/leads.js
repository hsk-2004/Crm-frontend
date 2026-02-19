import apiClient from './axiosConfig';




export const leadsApi = {
  
  getLeads: (params) => apiClient.get('/leads/', { params }),

  
  getLead: (id) => apiClient.get(`/leads/${id}/`),

  
  createLead: (data) => apiClient.post('/leads/', data),

  
  updateLead: (id, data) => apiClient.patch(`/leads/${id}/`, data),

  
  deleteLead: (id) => apiClient.delete(`/leads/${id}/`),

  
  convertToClient: (id) => apiClient.post(`/leads/${id}/convert-to-client/`),

  
  logActivity: (leadId, data) =>
    apiClient.post(`/leads/${leadId}/log-activity/`, data),

  
  getActivities: (leadId, params) =>
    apiClient.get(`/leads/${leadId}/activities/`, { params }),
};

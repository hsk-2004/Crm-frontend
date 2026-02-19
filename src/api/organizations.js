import apiClient from './axiosConfig';




export const organizationsApi = {
  
  getOrganizations: (params) =>
    apiClient.get('/organizations/', { params }),

  
  getOrganization: (id) => apiClient.get(`/organizations/${id}/`),

  
  createOrganization: (data) =>
    apiClient.post('/organizations/', data),

  
  updateOrganization: (id, data) =>
    apiClient.patch(`/organizations/${id}/`, data),

  
  getMembers: (orgId, params) =>
    apiClient.get(`/organizations/${orgId}/members/`, { params }),

  
  addMember: (orgId, data) =>
    apiClient.post(`/organizations/${orgId}/add-member/`, data),

  
  removeMember: (orgId, memberId) =>
    apiClient.delete(`/organizations/${orgId}/members/${memberId}/`),

  
  inviteMember: (orgId, data) =>
    apiClient.post(`/organizations/${orgId}/invite-member/`, data),
};

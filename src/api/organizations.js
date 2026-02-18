import apiClient from './axiosConfig';

/**
 * Organizations API endpoints
 */

export const organizationsApi = {
  // Get user's organizations
  getOrganizations: (params) =>
    apiClient.get('/organizations/', { params }),

  // Get single organization
  getOrganization: (id) => apiClient.get(`/organizations/${id}/`),

  // Create organization
  createOrganization: (data) =>
    apiClient.post('/organizations/', data),

  // Update organization
  updateOrganization: (id, data) =>
    apiClient.patch(`/organizations/${id}/`, data),

  // Get organization members
  getMembers: (orgId, params) =>
    apiClient.get(`/organizations/${orgId}/members/`, { params }),

  // Add member to organization
  addMember: (orgId, data) =>
    apiClient.post(`/organizations/${orgId}/add-member/`, data),

  // Remove member from organization
  removeMember: (orgId, memberId) =>
    apiClient.delete(`/organizations/${orgId}/members/${memberId}/`),

  // Invite user to organization
  inviteMember: (orgId, data) =>
    apiClient.post(`/organizations/${orgId}/invite-member/`, data),
};

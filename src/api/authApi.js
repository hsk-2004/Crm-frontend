import apiClient from './axiosConfig';

export const loginUser = (email, password) => {
  return apiClient.post('login/', {
    email,
    password,
  });
};

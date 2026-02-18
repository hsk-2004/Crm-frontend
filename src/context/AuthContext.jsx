import { createContext, useState, useEffect } from 'react';
import apiClient from '../api/axiosConfig';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ✅ Check authentication on app load
  // ✅ Check authentication on app load
  useEffect(() => {
    // TEMPORARY: Bypass login for demo
    setUser({
      first_name: 'Harman',
      email: 'harman@local.dev',
      authenticated: true
    });
    setLoading(false);

    /* 
    const token = localStorage.getItem('access_token');
    if (token) {
      setUser({ authenticated: true });
    }
    setLoading(false);
    */
  }, []);

  // ✅ LOGIN
  const login = async (email, password) => {
    try {
      setError(null);

      const response = await apiClient.post('login/', {
        email,
        password,
      });

      const { access, refresh } = response.data;

      // Store tokens
      localStorage.setItem('access_token', access);
      localStorage.setItem('refresh_token', refresh);

      setUser({ email, authenticated: true });

      return response.data;
    } catch (err) {
      setError(
        err.response?.data?.detail ||
        'Invalid email or password'
      );
      throw err;
    }
  };

  // ✅ REGISTER
  const register = async (userData) => {
    try {
      setError(null);

      const response = await apiClient.post('register/', userData);

      return response.data;
    } catch (err) {
      setError(
        err.response?.data?.detail ||
        'Registration failed'
      );
      throw err;
    }
  };

  // ✅ LOGOUT
  const logout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    setUser(null);
  };

  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        register,
        logout,
        loading,
        error,
        isAuthenticated,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

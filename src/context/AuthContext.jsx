import { createContext, useState, useEffect } from 'react';
import apiClient from '../api/axiosConfig';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ── TEMP: Auth disabled — always authenticated ──
  useEffect(() => {
    setUser({
      first_name: 'Harman',
      last_name: 'Singh',
      email: 'harman@local.dev',
      authenticated: true,
    });
    setLoading(false);
  }, []);

  // ── TEMP: login/register/logout are no-ops ──
  const login = async () => { };
  const register = async () => { };
  const logout = () => { };

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

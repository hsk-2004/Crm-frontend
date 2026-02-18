import React, { createContext, useState, useCallback } from 'react';

export const OrganizationContext = createContext(null);

export function OrganizationProvider({ children }) {
  const [currentOrganization, setCurrentOrganization] = useState(() => {
    const stored = localStorage.getItem('current_organization');
    return stored ? JSON.parse(stored) : null;
  });

  const selectOrganization = useCallback((org) => {
    setCurrentOrganization(org);
    localStorage.setItem('current_organization', JSON.stringify(org));
  }, []);

  const clearOrganization = useCallback(() => {
    setCurrentOrganization(null);
    localStorage.removeItem('current_organization');
  }, []);

  const value = {
    currentOrganization,
    selectOrganization,
    clearOrganization,
  };

  return (
    <OrganizationContext.Provider value={value}>
      {children}
    </OrganizationContext.Provider>
  );
}

import React, { createContext, useState, useContext, useEffect } from 'react';
import { logout as apiLogout } from '../utils/api';

interface AuthContextType {
  authToken: string | null;
  setAuthToken: (token: string | null) => void;
  userRole: string | null;
  setUserRole: (role: string | null) => void;
  isAuthenticated: boolean;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  authToken: null,
  setAuthToken: () => {},
  userRole: null,
  setUserRole: () => {},
  isAuthenticated: false,
  logout: async () => {}
});

export const AuthProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [authToken, setAuthToken] = useState<string | null>(() => {
    return localStorage.getItem('authToken');
  });
  const [userRole, setUserRole] = useState<string | null>(() => {
    return localStorage.getItem('userRole');
  });

  useEffect(() => {
    if (authToken) {
      localStorage.setItem('authToken', authToken);
    } else {
      localStorage.removeItem('authToken');
    }
  }, [authToken]);

  useEffect(() => {
    if (userRole) {
      localStorage.setItem('userRole', userRole);
    } else {
      localStorage.removeItem('userRole');
    }
  }, [userRole]);

  const logout = async () => {
    try {
      // Call the logout endpoint if we have a token
      if (authToken) {
        await apiLogout({
          headers: {
            'Authorization': `Token ${authToken}`,
            'Content-Type': 'application/json'
          }
        });
      }
    } catch (error) {
      console.error('Error logging out:', error);
    } finally {
      // Clear the token and role regardless of whether the API call succeeded
      setAuthToken(null);
      setUserRole(null);
    }
  };

  return (
    <AuthContext.Provider 
      value={{
        authToken,
        setAuthToken,
        userRole,
        setUserRole,
        isAuthenticated: !!authToken,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
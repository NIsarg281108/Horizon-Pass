// src/context/AuthContext.jsx
import { createContext, useContext, useState } from 'react';
import { mockUsers } from '../Data/mockUsers';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  // Load user from localStorage if available
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem('horizon_user');
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const login = (email, password) => {
    const found = mockUsers.find(
      (u) => u.email === email && u.password === password
    );
    if (found) {
      setUser(found);
      localStorage.setItem('horizon_user', JSON.stringify(found));
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('horizon_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
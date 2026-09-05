// src/context/AuthContext.jsx
import { createContext, useContext, useState, useEffect } from 'react';
import { mockUsers } from '../data/mockUsers';

const AuthContext = createContext();

const loadRegisteredUsers = () => {
  const stored = localStorage.getItem('horizon_registered_users');
  return stored ? JSON.parse(stored) : [];
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem('horizon_user');
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const [registeredUsers, setRegisteredUsers] = useState(loadRegisteredUsers);

  useEffect(() => {
    localStorage.setItem('horizon_registered_users', JSON.stringify(registeredUsers));
  }, [registeredUsers]);

  const login = (email, password) => {
    const allUsers = [...mockUsers, ...registeredUsers];
    const found = allUsers.find(
      (u) => u.email === email && u.password === password
    );
    if (found) {
      setUser(found);
      localStorage.setItem('horizon_user', JSON.stringify(found));
      return true;
    }
    return false;
  };

  const register = (userData) => {
    const exists = [...mockUsers, ...registeredUsers].some(
      (u) => u.email === userData.email
    );
    if (exists) {
      return { success: false, message: 'Email already registered' };
    }

    const newUser = {
      id: Date.now().toString(),
      role: 'user',
      ...userData,
    };

    setRegisteredUsers((prev) => [...prev, newUser]);
    return { success: true };
  };

  // NEW: Delete a registered user by ID
  const deleteUser = (userId) => {
    setRegisteredUsers((prev) => prev.filter((u) => u.id !== userId));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('horizon_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, registeredUsers, deleteUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
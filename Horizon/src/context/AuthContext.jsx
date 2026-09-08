import { createContext, useContext, useState, useEffect } from 'react';
import { mockUsers } from '../data/mockUsers';

const AuthContext = createContext();

const loadRegisteredUsers = () => {
  const stored = localStorage.getItem('horizon_registered_users');
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch (e) {
      return [];
    }
  }
  return [];
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

  const deleteUser = (userId) => {
    setRegisteredUsers((prev) => prev.filter((u) => u.id !== userId));
  };

  const updateUser = (updatedData) => {
    if (!user) return;
    const updatedUser = { ...user, ...updatedData };
    setUser(updatedUser);
    localStorage.setItem('horizon_user', JSON.stringify(updatedUser));

    if (user.role === 'user' && registeredUsers.some(u => u.id === user.id)) {
      setRegisteredUsers((prev) =>
        prev.map((u) => (u.id === user.id ? updatedUser : u))
      );
    }
  };

  const promoteUser = (userId) => {
    setRegisteredUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, role: 'admin' } : u))
    );
    // If the promoted user is currently logged in, update current user too
    if (user && user.id === userId) {
      setUser((prev) => ({ ...prev, role: 'admin' }));
      localStorage.setItem('horizon_user', JSON.stringify({ ...user, role: 'admin' }));
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('horizon_user');
  };

  return (
    <AuthContext.Provider value={{
      user, login, register, logout, registeredUsers, deleteUser, updateUser, promoteUser
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
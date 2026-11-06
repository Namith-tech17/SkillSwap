import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [allUsers, setAllUsers] = useState([]);
  const [authToken, setAuthToken] = useState(localStorage.getItem('skillswap_jwt_token') || null);
  const [loading, setLoading] = useState(true);
  const [authModalOpen, setAuthModalOpen] = useState(false);

  // Load all users and active user on mount
  useEffect(() => {
    async function initAuth() {
      try {
        const users = await api.getUsers();
        setAllUsers(users);

        // If we already have a JWT token, attempt to verify it
        const savedToken = localStorage.getItem('skillswap_jwt_token');
        const storedUserId = localStorage.getItem('skillswap_user_id') || 'usr_1';

        if (savedToken) {
          try {
            const meRes = await api.getMe();
            if (meRes.user) {
              setCurrentUser(meRes.user);
              setAuthToken(savedToken);
              return;
            }
          } catch (e) {
            console.warn('Saved JWT token expired or invalid, refreshing default session.');
          }
        }

        // Fallback default user session
        const found = users.find(u => u.user_id === storedUserId) || users[0];
        setCurrentUser(found);

        // Generate demo JWT token if none exists so authenticated requests succeed
        if (!savedToken && found) {
          const quick = await api.quickLogin(found.user_id);
          localStorage.setItem('skillswap_jwt_token', quick.token);
          setAuthToken(quick.token);
        }
      } catch (err) {
        console.error('Failed to initialize auth state:', err);
      } finally {
        setLoading(false);
      }
    }

    initAuth();
  }, []);

  // Switch student profile with real JWT issuance
  const switchUser = async (userId) => {
    try {
      const res = await api.quickLogin(userId);
      setCurrentUser(res.user);
      setAuthToken(res.token);
      localStorage.setItem('skillswap_jwt_token', res.token);
      localStorage.setItem('skillswap_user_id', res.user.user_id);
    } catch (err) {
      console.error('Failed to switch user:', err);
    }
  };

  // Login handler
  const login = async (emailOrUsn, password) => {
    const res = await api.login(emailOrUsn, password);
    setCurrentUser(res.user);
    setAuthToken(res.token);
    localStorage.setItem('skillswap_jwt_token', res.token);
    localStorage.setItem('skillswap_user_id', res.user.user_id);
    setAuthModalOpen(false);
    return res.user;
  };

  // Register handler
  const register = async (userData) => {
    const res = await api.register(userData);
    setCurrentUser(res.user);
    setAuthToken(res.token);
    localStorage.setItem('skillswap_jwt_token', res.token);
    localStorage.setItem('skillswap_user_id', res.user.user_id);
    setAllUsers(prev => [res.user, ...prev]);
    setAuthModalOpen(false);
    return res.user;
  };

  // Logout handler
  const logout = () => {
    localStorage.removeItem('skillswap_jwt_token');
    setAuthToken(null);
    // Switch to first student default
    if (allUsers.length > 0) {
      switchUser(allUsers[0].user_id);
    }
  };

  const updateProfile = async (updatedFields) => {
    if (!currentUser) return;
    try {
      const response = await api.updateUser(currentUser.user_id, updatedFields);
      setCurrentUser(response.user);
      setAllUsers(prev => prev.map(u => u.user_id === response.user.user_id ? response.user : u));
      return response.user;
    } catch (err) {
      console.error('Update profile failed:', err);
      throw err;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        allUsers,
        authToken,
        switchUser,
        login,
        register,
        logout,
        updateProfile,
        loading,
        authModalOpen,
        setAuthModalOpen
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

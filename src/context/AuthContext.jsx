import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';
import { MOCK_USERS } from '../data/mockData';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [currentCompany, setCurrentCompany] = useState(null);
  const [currentProfile, setCurrentProfile] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize real session from Express API / Supabase Auth on mount
  useEffect(() => {
    const initAuth = async () => {
      setIsLoading(true);
      try {
        const sessionData = await authService.getSession();
        if (sessionData && sessionData.user) {
          setCurrentUser(sessionData.user);
          setCurrentProfile(sessionData.profile || null);
          setCurrentCompany(sessionData.company || null);
          setIsAuthenticated(true);
        } else {
          setCurrentUser(null);
          setCurrentProfile(null);
          setCurrentCompany(null);
          setIsAuthenticated(false);
        }
      } catch (e) {
        console.warn('Session verification failed on mount:', e.message);
        setCurrentUser(null);
        setCurrentCompany(null);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  /**
   * Login user with email & password via Express API
   */
  const login = async (email, password) => {
    setIsLoading(true);
    try {
      const data = await authService.login(email, password);
      setCurrentUser(data.user);
      setCurrentProfile(data.profile || null);
      setCurrentCompany(data.company || null);
      setIsAuthenticated(true);
      return data;
    } catch (err) {
      setIsAuthenticated(false);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Register new corporate user facility via Express API
   */
  const register = async (params) => {
    setIsLoading(true);
    try {
      const data = await authService.register(params);
      setCurrentUser(data.user);
      setCurrentProfile(data.profile || null);
      setCurrentCompany(data.company || null);
      setIsAuthenticated(true);
      return data;
    } catch (err) {
      setIsAuthenticated(false);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Send password reset
   */
  const resetPassword = async (email) => {
    return await authService.resetPassword(email);
  };

  /**
   * Logout current user
   */
  const logout = async () => {
    await authService.logout();
    setCurrentUser(null);
    setCurrentProfile(null);
    setCurrentCompany(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        currentCompany,
        currentProfile,
        user: currentUser,
        session: isAuthenticated ? { user: currentUser } : null,
        isAuthenticated,
        isLoading,
        availableUsers: MOCK_USERS,
        login,
        register,
        logout,
        resetPassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
export default AuthContext;


// src/context/AuthContext.js
import React, { createContext, useContext, useReducer, useEffect } from 'react';
import apiService from '../config/api';

// Initial state
const initialState = {
  user: null,
  isLoading: true,
  isAuthenticated: false,
  error: null,
};

// Action types
const AUTH_ACTIONS = {
  SET_LOADING: 'SET_LOADING',
  SET_USER: 'SET_USER',
  SET_ERROR: 'SET_ERROR',
  LOGOUT: 'LOGOUT',
  CLEAR_ERROR: 'CLEAR_ERROR',
};

// Reducer
const authReducer = (state, action) => {
  switch (action.type) {
    case AUTH_ACTIONS.SET_LOADING:
      return {
        ...state,
        isLoading: action.payload,
      };
    case AUTH_ACTIONS.SET_USER:
      return {
        ...state,
        user: action.payload,
        isAuthenticated: !!action.payload,
        isLoading: false,
        error: null,
      };
    case AUTH_ACTIONS.SET_ERROR:
      return {
        ...state,
        error: action.payload,
        isLoading: false,
      };
    case AUTH_ACTIONS.LOGOUT:
      return {
        ...initialState,
        isLoading: false,
      };
    case AUTH_ACTIONS.CLEAR_ERROR:
      return {
        ...state,
        error: null,
      };
    default:
      return state;
  }
};

// Create context
const AuthContext = createContext();

// Provider component
export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Debug logging
  const log = (message, data = null) => {
    console.log(`[AuthContext] ${message}`, data);
  };

  // Check for existing authentication on app start
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      log('Checking auth status...');
      dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: true });
      
      // Check if user data exists in storage
      const storedUser = await apiService.getUser();
      const token = await apiService.getToken();
      
      log('Stored data:', { hasUser: !!storedUser, hasToken: !!token });
      
      if (storedUser && token) {
        // Validate token by fetching current user
        try {
          log('Validating token...');
          const currentUser = await apiService.getCurrentUser();
          log('Token valid, user authenticated:', currentUser);
          dispatch({ type: AUTH_ACTIONS.SET_USER, payload: currentUser });
        } catch (error) {
          // Token might be expired, clear everything
          log('Token validation failed, clearing tokens:', error.message);
          await apiService.clearTokens();
          dispatch({ type: AUTH_ACTIONS.LOGOUT });
        }
      } else {
        log('No stored auth data found');
        dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: false });
      }
    } catch (error) {
      log('Auth check error:', error.message);
      dispatch({ type: AUTH_ACTIONS.SET_ERROR, payload: error.message });
    }
  };

  const login = async (email, password, userType) => {
    try {
      dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: true });
      dispatch({ type: AUTH_ACTIONS.CLEAR_ERROR });
      
      const response = await apiService.login(email, password, userType);
      dispatch({ type: AUTH_ACTIONS.SET_USER, payload: response.user });
      // Log the user after login
      console.log('Logged in user (context):', response.user);
      return response;
    } catch (error) {
      dispatch({ type: AUTH_ACTIONS.SET_ERROR, payload: error.message });
      throw error;
    }
  };

  const register = async (userData) => {
    try {
      log('Starting registration process...', {
        username: userData.username,
        email: userData.email,
        user_type: userData.user_type
      });
      dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: true });
      dispatch({ type: AUTH_ACTIONS.CLEAR_ERROR });
      
      const response = await apiService.register(userData);
      log('Registration successful:', response.user);
      dispatch({ type: AUTH_ACTIONS.SET_USER, payload: response.user });
      // Log the user after registration
      console.log('Registered user (context):', response.user);
      return response;
    } catch (error) {
      log('Registration failed:', error.message);
      dispatch({ type: AUTH_ACTIONS.SET_ERROR, payload: error.message });
      throw error;
    }
  };

  const logout = async () => {
    try {
      log('Starting logout process...');
      dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: true });
      await apiService.logout();
      log('Logout successful');
      dispatch({ type: AUTH_ACTIONS.LOGOUT });
    } catch (error) {
      log('Logout error:', error.message);
      // Still logout locally even if server call fails
      dispatch({ type: AUTH_ACTIONS.LOGOUT });
    }
  };
  
  const updateUser = async (profileData) => {
    try {
      log('Updating user profile...');
      const updatedUser = await apiService.updateProfile(profileData);
      await apiService.storeUser(updatedUser);
      dispatch({ type: AUTH_ACTIONS.SET_USER, payload: updatedUser });
      log('Profile updated successfully');
      return updatedUser;
    } catch (error) {
      log('Profile update failed:', error.message);
      dispatch({ type: AUTH_ACTIONS.SET_ERROR, payload: error.message });
      throw error;
    }
  };

  const clearError = () => {
    dispatch({ type: AUTH_ACTIONS.CLEAR_ERROR });
  };

  const value = {
    // State
    user: state.user,
    isLoading: state.isLoading,
    isAuthenticated: state.isAuthenticated,
    error: state.error,
    
    // Actions
    login,
    register,
    logout,
    updateUser,
    clearError,
    checkAuthStatus,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
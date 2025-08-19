// src/context/LanguageContext.js
import React, { createContext, useContext, useReducer, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Initial state
const initialState = {
  language: 'en', // 'vi' for Vietnamese, 'en' for English
  currency: 'SGD', // 'VND' or 'SGD'
  isLoading: true,
};

// Action types
const LANGUAGE_ACTIONS = {
  SET_LANGUAGE: 'SET_LANGUAGE',
  SET_CURRENCY: 'SET_CURRENCY',
  SET_LOADING: 'SET_LOADING',
  INITIALIZE: 'INITIALIZE',
};

// Reducer
const languageReducer = (state, action) => {
  switch (action.type) {
    case LANGUAGE_ACTIONS.SET_LANGUAGE:
      return {
        ...state,
        language: action.payload,
      };
    case LANGUAGE_ACTIONS.SET_CURRENCY:
      return {
        ...state,
        currency: action.payload,
      };
    case LANGUAGE_ACTIONS.SET_LOADING:
      return {
        ...state,
        isLoading: action.payload,
      };
    case LANGUAGE_ACTIONS.INITIALIZE:
      return {
        ...state,
        language: action.payload.language,
        currency: action.payload.currency,
        isLoading: false,
      };
    default:
      return state;
  }
};

// Create context
const LanguageContext = createContext();

// Provider component
export const LanguageProvider = ({ children }) => {
  const [state, dispatch] = useReducer(languageReducer, initialState);

  // Load saved preferences on app start
  useEffect(() => {
    loadPreferences();
  }, []);

  const loadPreferences = async () => {
    try {
      const savedLanguage = await AsyncStorage.getItem('app_language');
      const savedCurrency = await AsyncStorage.getItem('app_currency');
      
      dispatch({
        type: LANGUAGE_ACTIONS.INITIALIZE,
        payload: {
          language: savedLanguage || 'en',
          currency: savedCurrency || 'SGD',
        },
      });
    } catch (error) {
      console.error('Failed to load language preferences:', error);
      dispatch({ type: LANGUAGE_ACTIONS.SET_LOADING, payload: false });
    }
  };

  const setLanguage = async (language) => {
    try {
      await AsyncStorage.setItem('app_language', language);
      dispatch({ type: LANGUAGE_ACTIONS.SET_LANGUAGE, payload: language });
    } catch (error) {
      console.error('Failed to save language preference:', error);
    }
  };

  const setCurrency = async (currency) => {
    try {
      await AsyncStorage.setItem('app_currency', currency);
      dispatch({ type: LANGUAGE_ACTIONS.SET_CURRENCY, payload: currency });
    } catch (error) {
      console.error('Failed to save currency preference:', error);
    }
  };

  const value = {
    // State
    language: state.language,
    currency: state.currency,
    isLoading: state.isLoading,
    
    // Actions
    setLanguage,
    setCurrency,
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

// Custom hook to use language context
export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export default LanguageContext;

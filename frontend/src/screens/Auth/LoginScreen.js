// src/screens/Auth/LoginScreen.js
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useAuth } from '../../context/AuthContext.js';
import { useTranslation } from '../../hooks/useTranslation';

const LoginScreen = ({ navigation }) => {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [userType, setUserType] = useState('student');
  
  const { login, isLoading, error, clearError, isAuthenticated } = useAuth();

  // Navigate to main app if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigation.replace('MainApp');
    }
  }, [isAuthenticated, navigation]);

  // Clear error when component mounts or user types
  useEffect(() => {
    clearError();
  }, [email, password, userType]);

  const handleLogin = async () => {
    // Validation
    if (!email.trim()) {
      Alert.alert(t('common.error', 'Error'), t('login.enterEmail', 'Please enter your email'));
      return;
    }

    if (!password.trim()) {
      Alert.alert(t('common.error', 'Error'), t('login.enterPassword', 'Please enter your password'));
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      Alert.alert(t('common.error', 'Error'), t('login.invalidEmail', 'Invalid email'));
      return;
    }

    try {
      await login(email.trim().toLowerCase(), password, userType);
      // Navigation will be handled by useEffect when isAuthenticated changes
    } catch (error) {
      // Error handling
      let errorMessage = t('login.failed', 'Login failed');
      
      if (error.message.includes('Invalid email or password')) {
        errorMessage = t('login.invalidCredentials', 'Invalid email or password');
      } else if (error.message.includes('Incorrect account type')) {
        errorMessage = userType === 'student'
          ? t('login.notStudent', 'This account is not a student')
          : t('login.notTutor', 'This account is not a tutor');
      } else if (error.message.includes('User account is disabled')) {
        errorMessage = t('login.disabled', 'Account has been disabled');
      } else if (error.message.includes('Network')) {
        errorMessage = t('login.networkError', 'Network error. Please try again');
      }
      
      Alert.alert(t('login.errorTitle', 'Login Error'), errorMessage);
    }
  };

  const handleForgotPassword = () => {
    Alert.alert(
      t('login.forgotTitle', 'Forgot Password'),
      t('login.forgotDesc', 'This feature will be updated soon. Please contact support.'),
      [{ text: t('common.ok', 'OK') }]
    );
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.content}>
        {/* Logo Section */}
        <View style={styles.logoSection}>
          <Text style={styles.logoText}>TutorConnect</Text>
          <Text style={styles.subtitle}>{t('login.subtitle', 'Connecting tutors and students')}</Text>
        </View>

        {/* Form Section */}
        <View style={styles.formSection}>
          {/* User Type Selector - Moved to top for better UX */}
          <View style={styles.userTypeSection}>
            <Text style={styles.userTypeLabel}>{t('login.userTypeLabel', 'You are:')}</Text>
            <View style={styles.userTypeButtons}>
              <TouchableOpacity
                style={[
                  styles.userTypeButton,
                  userType === 'student' && styles.userTypeButtonActive
                ]}
                onPress={() => setUserType('student')}
                disabled={isLoading}
              >
                <Text style={[
                  styles.userTypeButtonText,
                  userType === 'student' && styles.userTypeButtonTextActive
                ]}>
                  {t('login.student', 'Student')}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.userTypeButton,
                  userType === 'tutor' && styles.userTypeButtonActive
                ]}
                onPress={() => setUserType('tutor')}
                disabled={isLoading}
              >
                <Text style={[
                  styles.userTypeButtonText,
                  userType === 'tutor' && styles.userTypeButtonTextActive
                ]}>
                  {t('login.tutor', 'Tutor')}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>{t('login.email', 'Email')}</Text>
            <TextInput
              style={[styles.input, error && styles.inputError]}
              placeholder="email@example.com"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              editable={!isLoading}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>{t('login.password', 'Password')}</Text>
            <View style={[styles.passwordContainer, error && styles.inputError]}>
              <TextInput
                style={styles.passwordInput}
                placeholder="••••••••"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                editable={!isLoading}
              />
              <TouchableOpacity
                style={styles.eyeButton}
                onPress={() => setShowPassword(!showPassword)}
                disabled={isLoading}
              >
                <Icon 
                  name={showPassword ? 'visibility-off' : 'visibility'} 
                  size={20} 
                  color="#6b7280" 
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Error Message */}
          {error && (
            <View style={styles.errorContainer}>
              <Icon name="error" size={16} color="#dc2626" />
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}

          <TouchableOpacity
            style={[styles.loginButton, isLoading && styles.loginButtonDisabled]}
            onPress={handleLogin}
            disabled={isLoading}
          >
            {isLoading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator color="white" size="small" />
                <Text style={styles.loginButtonText}>{t('login.loggingIn', 'Logging in...')}</Text>
              </View>
            ) : (
              <Text style={styles.loginButtonText}>{t('login.login', 'Login')}</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.forgotPasswordButton}
            onPress={handleForgotPassword}
            disabled={isLoading}
          >
            <Text style={styles.forgotPasswordText}>{t('login.forgot', 'Forgot password?')}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.registerButton, isLoading && styles.registerButtonDisabled]}
            onPress={() => navigation.navigate('Register')}
            disabled={isLoading}
          >
            <Text style={[styles.registerButtonText, isLoading && styles.registerButtonTextDisabled]}>
              {t('login.createAccount', 'Create new account')}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  logoSection: {
    alignItems: 'center',
    marginBottom: 48,
  },
  logoText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#2563eb',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#6b7280',
  },
  formSection: {
    gap: 16,
  },
  userTypeSection: {
    alignItems: 'center',
    marginBottom: 8,
  },
  userTypeLabel: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 8,
    fontWeight: '500',
  },
  userTypeButtons: {
    flexDirection: 'row',
    gap: 16,
  },
  userTypeButton: {
    backgroundColor: '#e5e7eb',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    minWidth: 80,
    alignItems: 'center',
  },
  userTypeButtonActive: {
    backgroundColor: '#2563eb',
  },
  userTypeButtonText: {
    color: '#374151',
    fontSize: 14,
    fontWeight: '500',
  },
  userTypeButtonTextActive: {
    color: 'white',
  },
  inputContainer: {
    gap: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
  },
  input: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: 'white',
  },
  inputError: {
    borderColor: '#dc2626',
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    backgroundColor: 'white',
  },
  passwordInput: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
  },
  eyeButton: {
    paddingHorizontal: 12,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 4,
  },
  errorText: {
    color: '#dc2626',
    fontSize: 14,
    flex: 1,
  },
  loginButton: {
    backgroundColor: '#2563eb',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  loginButtonDisabled: {
    backgroundColor: '#9ca3af',
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  loginButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },
  forgotPasswordButton: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  forgotPasswordText: {
    color: '#2563eb',
    fontSize: 14,
  },
  registerButton: {
    borderWidth: 1,
    borderColor: '#2563eb',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  registerButtonDisabled: {
    borderColor: '#9ca3af',
  },
  registerButtonText: {
    color: '#2563eb',
    fontSize: 16,
    fontWeight: '500',
  },
  registerButtonTextDisabled: {
    color: '#9ca3af',
  },
});

export default LoginScreen;
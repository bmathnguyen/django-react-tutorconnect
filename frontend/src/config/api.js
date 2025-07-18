// src/config/api.js
import AsyncStorage from '@react-native-async-storage/async-storage';

// Replace with your VPS server URL
// const BASE_URL = 'http://YOUR_VPS_IP:8000/api'; // Update this with your actual VPS IP
// const BASE_URL = 'http://157.66.47.161/api'

const BASE_URL = 'http://127.0.0.1/api'
class ApiService {
  constructor() {
    this.baseURL = BASE_URL;
  }

  // Get stored token
  async getToken() {
    try {
      return await AsyncStorage.getItem('access_token');
    } catch (error) {
      console.error('Error getting token:', error);
      return null;
    }
  }

  // Get refresh token
  async getRefreshToken() {
    try {
      return await AsyncStorage.getItem('refresh_token');
    } catch (error) {
      console.error('Error getting refresh token:', error);
      return null;
    }
  }

  // Store tokens
  async storeTokens(accessToken, refreshToken) {
    try {
      await AsyncStorage.setItem('access_token', accessToken);
      await AsyncStorage.setItem('refresh_token', refreshToken);
    } catch (error) {
      console.error('Error storing tokens:', error);
    }
  }

  // Clear tokens
  async clearTokens() {
    try {
      await AsyncStorage.removeItem('access_token');
      await AsyncStorage.removeItem('refresh_token');
      await AsyncStorage.removeItem('user');
    } catch (error) {
      console.error('Error clearing tokens:', error);
    }
  }

  // Store user data
  async storeUser(userData) {
    try {
      await AsyncStorage.setItem('user', JSON.stringify(userData));
    } catch (error) {
      console.error('Error storing user:', error);
    }
  }

  // Get user data
  async getUser() {
    try {
      const userData = await AsyncStorage.getItem('user');
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error('Error getting user:', error);
      return null;
    }
  }

  // Refresh access token
  async refreshAccessToken() {
    try {
      const refreshToken = await this.getRefreshToken();
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }

      const response = await fetch(`${this.baseURL}/auth/refresh/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          refresh: refreshToken,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        await AsyncStorage.setItem('access_token', data.access);
        return data.access;
      } else {
        throw new Error('Failed to refresh token');
      }
    } catch (error) {
      console.error('Error refreshing token:', error);
      await this.clearTokens();
      throw error;
    }
  }

  // Make authenticated API request
  async request(endpoint, options = {}) {
    let token = await this.getToken();
    
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    // Add authorization header if token exists
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }

    try {
      let response = await fetch(`${this.baseURL}${endpoint}`, config);

      // If unauthorized, try to refresh token
      if (response.status === 401 && token) {
        try {
          token = await this.refreshAccessToken();
          config.headers['Authorization'] = `Bearer ${token}`;
          response = await fetch(`${this.baseURL}${endpoint}`, config);
        } catch (refreshError) {
          // Redirect to login if refresh fails
          throw new Error('Authentication failed');
        }
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Authentication methods
  async login(email, password, userType) {
    try {
      const response = await fetch(`${this.baseURL}/auth/login/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Login failed');
      }

      const data = await response.json();
      
      // Verify user type matches
      if (data.user.user_type !== userType) {
        throw new Error(`Incorrect account type. Expected ${userType}, got ${data.user.user_type}`);
      }

      // Store tokens and user data
      await this.storeTokens(data.tokens.access, data.tokens.refresh);
      await this.storeUser(data.user);

      return data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  async register(userData) {
    try {
      const response = await fetch(`${this.baseURL}/auth/register/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Registration failed');
      }

      const data = await response.json();

      // Store tokens and user data
      await this.storeTokens(data.tokens.access, data.tokens.refresh);
      await this.storeUser(data.user);

      return data;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  }

  async logout() {
    try {
      const refreshToken = await this.getRefreshToken();
      
      if (refreshToken) {
        // Call backend logout to blacklist token
        await this.request('/auth/logout/', {
          method: 'POST',
          body: JSON.stringify({
            refresh: refreshToken,
          }),
        });
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear local storage regardless of backend call success
      await this.clearTokens();
    }
  }

  async getCurrentUser() {
    try {
      return await this.request('/auth/me/');
    } catch (error) {
      console.error('Get current user error:', error);
      throw error;
    }
  }

  // Tutor methods
  async getTutors(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const endpoint = `/tutors/${queryString ? `?${queryString}` : ''}`;
    return await this.request(endpoint);
  }

  async getTutorDetail(tutorId) {
    return await this.request(`/tutors/${tutorId}/`);
  }

  async likeTutor(tutorId) {
    return await this.request(`/tutors/${tutorId}/like/`, {
      method: 'POST',
    });
  }

  async unlikeTutor(tutorId) {
    return await this.request(`/tutors/${tutorId}/like/`, {
      method: 'DELETE',
    });
  }

  async saveTutor(tutorId) {
    return await this.request(`/tutors/${tutorId}/save/`, {
      method: 'POST',
    });
  }

  async unsaveTutor(tutorId) {
    return await this.request(`/tutors/${tutorId}/save/`, {
      method: 'DELETE',
    });
  }

  async getSavedTutors() {
    return await this.request('/users/saved-tutors/');
  }

  async getLikedTutors() {
    return await this.request('/users/liked-tutors/');
  }

  // Chat methods
  async getChatRooms() {
    return await this.request('/chats/');
  }

  async createChatRoom(tutorId) {
    return await this.request('/chats/create/', {
      method: 'POST',
      body: JSON.stringify({
        tutor_id: tutorId,
      }),
    });
  }

  async getChatMessages(roomId) {
    return await this.request(`/chats/${roomId}/messages/`);
  }

  async sendMessage(roomId, content) {
    return await this.request(`/chats/${roomId}/send/`, {
      method: 'POST',
      body: JSON.stringify({
        content,
      }),
    });
  }

  // Review methods
  async getTutorReviews(tutorId) {
    return await this.request(`/tutors/${tutorId}/reviews/`);
  }

  async createReview(tutorId, rating, comment) {
    return await this.request(`/tutors/${tutorId}/reviews/create/`, {
      method: 'POST',
      body: JSON.stringify({
        rating,
        comment,
      }),
    });
  }

  // Profile methods
  async updateProfile(profileData) {
    return await this.request('/users/profile/', {
      method: 'PATCH',
      body: JSON.stringify(profileData),
    });
  }

  async uploadProfileImage(imageUri) {
    const formData = new FormData();
    formData.append('image', {
      uri: imageUri,
      type: 'image/jpeg',
      name: 'profile.jpg',
    });

    const token = await this.getToken();
    
    const response = await fetch(`${this.baseURL}/upload/profile-image/`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
      },
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Upload failed');
    }

    return await response.json();
  }

  // Metadata methods
  async getSubjects() {
    return await this.request('/subjects/');
  }

  async getPlatformStats() {
    return await this.request('/platform/stats/');
  }
}

// Create and export singleton instance
const apiService = new ApiService();
export default apiService;
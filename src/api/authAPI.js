import { authAPI as axiosAuthAPI } from '../utils/axiosInstance';

const authAPI = {
  // Sign up
  signUp: async (userData) => {
    const response = await axiosAuthAPI.post('/sign-up', userData);
    
    // Store tokens in localStorage
    if (response.data.data?.tokens) {
      localStorage.setItem('accessToken', response.data.data.tokens.accessToken);
      localStorage.setItem('refreshToken', response.data.data.tokens.refreshToken);
      localStorage.setItem('userId', response.data.data.user._id);
    }
    
    return response;
  },

  // Sign in
  signIn: async (credentials) => {
    const response = await axiosAuthAPI.post('/sign-in', credentials);
    
    // Store tokens in localStorage
    if (response.data.data?.tokens) {
      localStorage.setItem('accessToken', response.data.data.tokens.accessToken);
      localStorage.setItem('refreshToken', response.data.data.tokens.refreshToken);
      localStorage.setItem('userId', response.data.data.user._id);
    }
    
    return response;
  },

  // Sign out
  signOut: async (accessToken) => {
    const response = await axiosAuthAPI.post('/sign-out', {});
    
    // Clear tokens from localStorage
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('userId');
    
    return response;
  },

  // Refresh token
  refreshToken: async ({ userId, refreshToken }) => {
    const response = await axiosAuthAPI.post('/refresh-token', {
      userId,
      refreshToken,
    });
    
    // Update tokens in localStorage
    if (response.data.data?.tokens) {
      localStorage.setItem('accessToken', response.data.data.tokens.accessToken);
      localStorage.setItem('refreshToken', response.data.data.tokens.refreshToken);
    }
    
    return response;
  },

  // Get current user (if you have this endpoint)
  getCurrentUser: async () => {
    const response = await axiosAuthAPI.get('/me');
    return response;
  },
};

export default authAPI; 
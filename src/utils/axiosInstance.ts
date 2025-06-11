import axios from 'axios';

// Create axios instance
const API_BASE_URL = 'http://localhost:3000/api/v1';

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 seconds timeout
});

// Request interceptor to add auth token
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token refresh and global error handling
axiosInstance.interceptors.response.use(
  (response) => {
    // Return successful responses as-is
    return response;
  },
  async (error: any) => {
    const originalRequest = error.config;
    
    // Handle token refresh for 401 errors
    if (
      error.response?.status === 401 &&
      originalRequest &&
      !originalRequest._retry &&
      !originalRequest.url?.includes('/auth/sign-in') &&
      !originalRequest.url?.includes('/auth/refresh-token')
    ) {
      originalRequest._retry = true;
      
      try {
        const refreshToken = localStorage.getItem('refreshToken');
        const userId = localStorage.getItem('userId');
        
        if (refreshToken && userId) {
          const response: any = await axios.post(
            `${API_BASE_URL}/auth/refresh-token`,
            { userId, refreshToken },
            {
              headers: {
                'Content-Type': 'application/json',
              },
            }
          );
          
          const accessToken = response.data?.data?.tokens?.accessToken;
          if (accessToken) {
            localStorage.setItem('accessToken', accessToken);
            
            // Retry original request with new token
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${accessToken}`;
            }
            return axiosInstance(originalRequest);
          }
        }
      } catch (refreshError) {
        // Refresh failed, clear tokens and redirect to login
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('userId');
        
        // Only redirect if we're not already on the login page
        if (!window.location.pathname.includes('/auth/sign-in')) {
          window.location.href = '/auth/sign-in';
        }
        
        return Promise.reject(refreshError);
      }
    }
    
    // Handle other HTTP errors
    if (error.response) {
      // Server responded with error status
      const errorMessage = error.response.data?.message || 'An error occurred';
      console.error('API Error:', {
        status: error.response.status,
        message: errorMessage,
        url: error.config?.url,
      });
    } else if (error.request) {
      // Network error
      console.error('Network Error:', error.message);
    } else {
      // Other error
      console.error('Error:', error.message);
    }
    
    return Promise.reject(error);
  }
);

// Helper function to create API endpoints with specific base paths
export const createAPIEndpoint = (basePath: string) => {
  return {
    get: (url: string, config?: any) => axiosInstance.get(`${basePath}${url}`, config),
    post: (url: string, data?: any, config?: any) => axiosInstance.post(`${basePath}${url}`, data, config),
    put: (url: string, data?: any, config?: any) => axiosInstance.put(`${basePath}${url}`, data, config),
    patch: (url: string, data?: any, config?: any) => axiosInstance.patch(`${basePath}${url}`, data, config),
    delete: (url: string, config?: any) => axiosInstance.delete(`${basePath}${url}`, config),
  };
};

// Pre-configured API endpoints for common use cases
export const authAPI = createAPIEndpoint('/auth');
export const userAPI = createAPIEndpoint('/users');
export const facilityAPI = createAPIEndpoint('/facilities');
export const donationAPI = createAPIEndpoint('/donations');
export const giftAPI = createAPIEndpoint('/gifts');
export const staffAPI = createAPIEndpoint('/staff');
export const adminAPI = createAPIEndpoint('/admin');

// Export the main instance for custom usage
export default axiosInstance;

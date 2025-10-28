import axios from 'axios';
import { useAuthStore } from '@/features/authentication/useAuthStore'; // Import the store

// Define your backend API's base URL
// Make sure this matches the URL your FastAPI server is running on
// Use the environment variable, providing a fallback
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api'; // <-- Use this

const axiosInstance = axios.create({
  baseURL: API_BASE_URL, // <-- Use the variable here
  headers: {
    'Content-Type': 'application/json',
  },
});

// --- Request Interceptor ---
axiosInstance.interceptors.request.use(
  (config) => {
    // Get the token from the Zustand store ON EACH request
    const token = useAuthStore.getState().token;

    if (token) {
      // If a token exists, add the Authorization header
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config; // Continue with the request configuration
  },
  (error) => {
    // Handle request errors (optional)
    console.error('Axios request error:', error);
    return Promise.reject(error);
  }
);

// --- Response Interceptor (Optional but Recommended for 401 handling) ---
axiosInstance.interceptors.response.use(
  (response) => {
    // Any status code that lie within the range of 2xx cause this function to trigger
    return response;
  },
  (error) => {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    if (error.response && error.response.status === 401) {
      // If we get a 401 Unauthorized, the token is likely invalid or expired
      console.warn('Received 401 Unauthorized. Logging out.');
      // Call the logout function from the store to clear credentials
      useAuthStore.getState().logout();
      // Optionally redirect to login page
      // Check if we are already on the login page to avoid loops
      if (window.location.pathname !== '/login') {
         window.location.href = '/login'; // Force redirect
      }
    }
    return Promise.reject(error); // Pass the error along
  }
);


export default axiosInstance;
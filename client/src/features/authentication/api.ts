import axios from '@/lib/axios'; // Import our pre-configured axios instance
import { LoginRequest, Token, UserRead } from './types'; // We'll define these types next

// Base URL prefix for auth endpoints (adjust if your router prefix changes)
const AUTH_API_PREFIX = '/auth';
const USERS_API_PREFIX = '/users';

/**
 * Calls the backend API to log in a user.
 * @param credentials - The user's email (as username) and password.
 * @returns A promise that resolves with the token object { access_token, token_type }.
 */
export const loginUser = async (credentials: LoginRequest): Promise<Token> => {
  // Use FormData because the backend expects OAuth2PasswordRequestForm
  const formData = new URLSearchParams();
  formData.append('username', credentials.email); // Map email to username field
  formData.append('password', credentials.password);

  const response = await axios.post<Token>(`${AUTH_API_PREFIX}/login`, formData, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });
  return response.data;
};

/**
 * Calls the backend API to get the current authenticated user's details.
 * Requires a valid JWT to be sent in the Authorization header (handled by axios interceptor).
 * @returns A promise that resolves with the user data (UserRead schema).
 */
export const getCurrentUser = async (): Promise<UserRead> => {
  const response = await axios.get<UserRead>(`${USERS_API_PREFIX}/me`);
  return response.data;
};
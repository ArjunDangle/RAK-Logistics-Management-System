import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthState {
  token: string | null;
  userRole: 'logistics' | 'support' | null;
  userName: string | null;
  // The login function is now asynchronous and returns a Promise
  login: (username: string, password: string, role: 'logistics' | 'support') => Promise<boolean>;
  logout: () => void;
  isAuthenticated: () => boolean;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      token: null,
      userRole: null,
      userName: null,

      /**
       * Replaces the mock login with a real API call to the backend.
       * @param username The user's email address.
       * @param password The user's plain-text password.
       * @param role The role selected in the UI ('logistics' or 'support').
       * @returns A promise that resolves to true on successful login, false otherwise.
       */
      login: async (username: string, password: string, role: 'logistics' | 'support'): Promise<boolean> => {
        try {
          // Step 1: Send credentials to the /auth/login endpoint to get a token.
          // FastAPI's OAuth2PasswordRequestForm expects data in 'x-www-form-urlencoded' format.
          // We use URLSearchParams to easily create this format.
          const loginDetails = new URLSearchParams();
          loginDetails.append('username', username); // The form expects the email in the 'username' field.
          loginDetails.append('password', password);

          const loginResponse = await fetch('http://127.0.0.1:8000/auth/login', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: loginDetails,
          });

          if (!loginResponse.ok) {
            console.error('Login failed:', loginResponse.statusText);
            return false;
          }

          const tokenData = await loginResponse.json();
          const accessToken = tokenData.access_token;

          // Step 2: Use the received token to fetch the authenticated user's details.
          const userResponse = await fetch('http://127.0.0.1:8000/users/me', {
            headers: {
              'Authorization': `Bearer ${accessToken}`
            }
          });

          if (!userResponse.ok) {
            console.error('Failed to fetch user details');
            return false;
          }

          const userData = await userResponse.json(); // Contains { id, full_name, email, role }

          // Step 3: Verify that the user's role from the database matches the role they selected in the UI.
          // This prevents a 'logistics' user from logging in via the 'support' tab.
          if (userData.role !== role) {
            console.error(`Role mismatch: User has role '${userData.role}', but tried to log in as '${role}'.`);
            return false;
          }
          
          // Step 4: If everything is successful, update the state with the token and user info.
          set({
            token: accessToken,
            userRole: userData.role,
            userName: userData.full_name,
          });

          return true;

        } catch (error) {
          console.error('An error occurred during the login process:', error);
          return false;
        }
      },

      logout: () => {
        set({
          token: null,
          userRole: null,
          userName: null,
        });
      },

      isAuthenticated: () => {
        return get().token !== null;
      },
    }),
    {
      name: 'auth-storage', // This key is used for persisting the state in local storage.
    }
  )
);
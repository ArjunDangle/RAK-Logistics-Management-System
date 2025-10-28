import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Define the structure for user data we'll store
interface UserData {
  role: 'logistics' | 'support';
  name: string;
  // Add other relevant user fields if needed, e.g., email, id
}

interface AuthState {
  token: string | null;
  user: UserData | null; // Store user details in an object
  login: (token: string, userData: UserData) => void; // Updated login signature
  logout: () => void;
  isAuthenticated: () => boolean;
  // Expose userRole and userName via selectors for easier access
  userRole: () => 'logistics' | 'support' | null;
  userName: () => string | null;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      token: null,
      user: null, // Initialize user as null

      // NEW: login function only stores the provided token and user data
      login: (token: string, userData: UserData) => {
        set({
          token: token,
          user: userData,
        });
      },

      logout: () => {
        set({
          token: null,
          user: null, // Clear user data on logout
        });
      },

      isAuthenticated: () => {
        return get().token !== null;
      },

      // NEW: Selectors to get specific user properties
      userRole: () => get().user?.role || null,
      userName: () => get().user?.name || null,
    }),
    {
      name: 'auth-storage', // Keep the same storage key
      // Optional: Store only the token and user in localStorage
      // partialize: (state) => ({ token: state.token, user: state.user }),
    }
  )
);

// Optional but recommended: Export selectors for cleaner component usage
export const useCurrentUserRole = () => useAuthStore((state) => state.userRole());
export const useCurrentUserName = () => useAuthStore((state) => state.userName());
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthState {
  token: string | null;
  userRole: 'logistics' | 'support' | null;
  userName: string | null;
  login: (username: string, password: string, role: 'logistics' | 'support') => boolean;
  logout: () => void;
  isAuthenticated: () => boolean;
}

// Mock credentials for development only
const MOCK_USERS = {
  logistics: { username: 'logistics', password: 'logistics123', name: 'Logistics Team' },
  support: { username: 'support', password: 'support123', name: 'Support Team' },
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      token: null,
      userRole: null,
      userName: null,

      login: (username: string, password: string, role: 'logistics' | 'support') => {
        const user = MOCK_USERS[role];
        
        if (user && username === user.username && password === user.password) {
          // Mock JWT token (just base64 encoded data for demo)
          const mockToken = btoa(JSON.stringify({ role, username, name: user.name }));
          
          set({
            token: mockToken,
            userRole: role,
            userName: user.name,
          });
          
          return true;
        }
        
        return false;
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
      name: 'auth-storage',
    }
  )
);

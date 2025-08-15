import { create } from 'zustand';

interface User {
  id: string;
  name: string;
  email: string;
  initials: string;
}

interface AuthStore {
  // State
  user: User | null;
  isAuthenticated: boolean;
  
  // Actions
  login: (user: User) => void;
  logout: () => void;
  setUser: (user: User | null) => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  // Initial state
  user: null,
  isAuthenticated: false,

  // Login user
  login: (user: User) => {
    set({ 
      user, 
      isAuthenticated: true 
    });
    
    // Store in session storage only (not localStorage per requirements)
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('studi-fi-user', JSON.stringify(user));
    }
  },

  // Logout user
  logout: () => {
    set({ 
      user: null, 
      isAuthenticated: false 
    });
    
    // Clear session storage
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('studi-fi-user');
    }
  },

  // Set user (for restoration from session storage)
  setUser: (user: User | null) => {
    set({ 
      user, 
      isAuthenticated: !!user 
    });
  },
}));

// Helper function to restore user from session storage
export const restoreUserFromSession = () => {
  if (typeof window === 'undefined') return null;
  
  try {
    const storedUser = sessionStorage.getItem('studi-fi-user');
    return storedUser ? JSON.parse(storedUser) : null;
  } catch {
    return null;
  }
};

export type { User };

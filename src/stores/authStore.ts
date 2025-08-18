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
  isLoginModalOpen: boolean;
  isSignUpModalOpen: boolean;
  isChartModalOpen: boolean;
  
  // Actions
  login: (user: User) => void;
  logout: () => void;
  setUser: (user: User | null) => void;
  openLoginModal: () => void;
  closeLoginModal: () => void;
  openSignUpModal: () => void;
  closeSignUpModal: () => void;
  openChartModal: () => void;
  closeChartModal: () => void;
  switchToSignUp: () => void;
  switchToLogin: () => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  // Initial state
  user: null,
  isAuthenticated: false,
  isLoginModalOpen: false,
  isSignUpModalOpen: false,
  isChartModalOpen: false,

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

  // Modal actions
  openLoginModal: () => set({ isLoginModalOpen: true, isSignUpModalOpen: false }),
  closeLoginModal: () => set({ isLoginModalOpen: false }),
  openSignUpModal: () => set({ isSignUpModalOpen: true, isLoginModalOpen: false }),
  closeSignUpModal: () => set({ isSignUpModalOpen: false }),
  openChartModal: () => set({ isChartModalOpen: true }),
  closeChartModal: () => set({ isChartModalOpen: false }),
  switchToSignUp: () => set({ isLoginModalOpen: false, isSignUpModalOpen: true }),
  switchToLogin: () => set({ isSignUpModalOpen: false, isLoginModalOpen: true }),
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

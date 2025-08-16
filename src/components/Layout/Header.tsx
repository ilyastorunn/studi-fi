'use client';

import { useAuthStore, restoreUserFromSession } from '@/stores/authStore';
import { useEffect } from 'react';

export function Header() {
  const { user, isAuthenticated, login, logout, setUser } = useAuthStore();

  // Restore user from session storage on mount
  useEffect(() => {
    const storedUser = restoreUserFromSession();
    if (storedUser) {
      setUser(storedUser);
    }
  }, [setUser]);

  // Mock login function for demo purposes
  const handleLogin = () => {
    const mockUser = {
      id: '1',
      name: 'Jane Doe',
      email: 'jane@example.com',
      initials: 'JD'
    };
    login(mockUser);
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      {/* Logo Card - 174x57px, 50px top, 70px left */}
      <div 
        className="absolute"
        style={{
          top: '24px',
          left: '48px',
          width: '120px',
          height: '52px',
          backgroundColor: 'rgba(234, 234, 242, 0.3)',
          backdropFilter: 'blur(10px)',
          borderRadius: '50px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <span 
          style={{
            fontFamily: 'var(--font-comfortaa)',
            fontSize: '18px',
            color: '#15142F',
            fontWeight: '600'
          }}
        >
          studi-fi
        </span>
      </div>

      {/* Login Button Card - 142x57px, 50px top, 70px right */}
      <div 
        className="absolute cursor-pointer"
        style={{
          top: '24px',
          right: '48px',
          width: '120px',
          height: '52px',
          backgroundColor: 'rgba(234, 234, 242, 0.3)',
          backdropFilter: 'blur(10px)',
          borderRadius: '50px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
        onClick={isAuthenticated ? handleLogout : handleLogin}
      >
        <span 
          style={{
            fontFamily: 'var(--font-comfortaa)',
            fontSize: '18px',
            color: '#15142F',
            fontWeight: '600'
          }}
        >
          {isAuthenticated ? 'logout' : 'login'}
        </span>
      </div>
    </header>
  );
}

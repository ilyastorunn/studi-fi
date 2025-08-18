'use client';

import { useAuthStore, restoreUserFromSession } from '@/stores/authStore';
import { useEffect } from 'react';
import { AuthModals } from '@/components/Auth/AuthModals';

export function Header() {
  const { user, isAuthenticated, logout, setUser, openLoginModal } = useAuthStore();

  // Restore user from session storage on mount
  useEffect(() => {
    const storedUser = restoreUserFromSession();
    if (storedUser) {
      setUser(storedUser);
    }
  }, [setUser]);

  const handleLoginClick = () => {
    openLoginModal();
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

      {/* Auth Button Card - 142x57px, 50px top, 70px right */}
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
          justifyContent: 'center',
          gap: '8px'
        }}
        onClick={isAuthenticated ? handleLogout : handleLoginClick}
      >
        {isAuthenticated && user ? (
          <>
            {/* User Avatar */}
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                backgroundColor: '#4A90E2',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontSize: '12px',
                fontWeight: '600',
                fontFamily: 'var(--font-comfortaa)',
              }}
            >
              {user.initials}
            </div>
            <span 
              style={{
                fontFamily: 'var(--font-comfortaa)',
                fontSize: '16px',
                color: '#15142F',
                fontWeight: '600'
              }}
            >
              logout
            </span>
          </>
        ) : (
          <span 
            style={{
              fontFamily: 'var(--font-comfortaa)',
              fontSize: '18px',
              color: '#15142F',
              fontWeight: '600'
            }}
          >
            login
          </span>
        )}
      </div>

      {/* Auth Modals */}
      <AuthModals />
    </header>
  );
}

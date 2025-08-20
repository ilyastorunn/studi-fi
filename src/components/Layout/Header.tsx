'use client';

import { useAuthStore, restoreUserFromSession } from '@/stores/authStore';
import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { AuthModals } from '@/components/Auth/AuthModals';
import { adminHelpers } from '@/lib/admin';
import { authHelpers, convertSupabaseUser } from '@/lib/auth';
import { ChartLine } from 'lucide-react';

export function Header() {
  const { user, isAuthenticated, logout, setUser, openLoginModal, openChartModal, login } = useAuthStore();
  const router = useRouter();
  const searchParams = useSearchParams();

  // Restore user from session storage and listen to auth changes
  useEffect(() => {
    // First, restore from session storage
    const storedUser = restoreUserFromSession();
    if (storedUser) {
      setUser(storedUser);
    }

    // Set up authentication state listener
    const { data: { subscription } } = authHelpers.onAuthStateChange((authUser) => {
      if (authUser) {
        console.log('Auth state changed: user logged in', authUser.email);
        login(authUser);
      } else {
        console.log('Auth state changed: user logged out');
        // Don't auto-logout here, let user manually logout
      }
    });

    // Check for auth success from URL params (from Google OAuth callback)
    const authStatus = searchParams.get('auth');
    if (authStatus === 'success') {
      // Give a moment for the session to be available
      setTimeout(async () => {
        try {
          const session = await authHelpers.getSession();
          if (session?.user) {
            const authUser = convertSupabaseUser(session.user);
            login(authUser);
            console.log('Google auth successful, user logged in:', authUser.email);
            
            // Clean up the URL
            const url = new URL(window.location.href);
            url.searchParams.delete('auth');
            window.history.replaceState({}, '', url.toString());
          }
        } catch (error) {
          console.error('Error getting session after auth callback:', error);
        }
      }, 100);
    }

    // Cleanup subscription
    return () => {
      subscription?.unsubscribe();
    };
  }, [setUser, login, searchParams]);

  const handleLoginClick = () => {
    openLoginModal();
  };

  const handleLogout = async () => {
    await logout();
  };

  const handleChartClick = () => {
    if (isAuthenticated) {
      openChartModal();
    } else {
      // Redirect to login if not authenticated
      openLoginModal();
    }
  };

  const isAdmin = adminHelpers.isAdmin(user?.email);

  return (
    <>
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
          className="absolute cursor-pointer transition-all duration-200 hover:scale-105 hover:bg-white/40"
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

        {/* Admin Button - Only show for admin users */}
        {isAuthenticated && isAdmin && (
          <div 
            className="absolute cursor-pointer transition-all duration-200 hover:scale-105 hover:bg-white/40"
            style={{
              top: '24px',
              right: '200px', // Position to the left of auth button
              width: '80px',
              height: '52px',
              backgroundColor: 'rgba(234, 234, 242, 0.3)',
              backdropFilter: 'blur(10px)',
              borderRadius: '50px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            onClick={() => router.push('/admin')}
          >
            <span 
              style={{
                fontFamily: 'var(--font-comfortaa)',
                fontSize: '16px',
                color: '#15142F',
                fontWeight: '600'
              }}
            >
              admin
            </span>
          </div>
        )}

        {/* Auth Modals */}
        <AuthModals />
      </header>

      {/* Chart Button - Fixed bottom right */}
      <div 
        className="fixed bottom-8 right-8 cursor-pointer transition-all duration-200 hover:scale-105 hover:bg-white/40 z-50"
        style={{
          width: '56px',
          height: '56px',
          backgroundColor: 'rgba(234, 234, 242, 0.3)',
          backdropFilter: 'blur(10px)',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
        onClick={handleChartClick}
        title={isAuthenticated ? 'View Study Statistics' : 'Login to view statistics'}
      >
        <ChartLine size={24} color="#15142F" />
      </div>
    </>
  );
}

import { useEffect, useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';

export function useAuth() {
  const {
    isAuthenticated,
    isLoading,
    user,
    loginWithRedirect,
    loginWithPopup,
    logout
  } = useAuth0();

  useEffect(() => {
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    const hasAuth0Tokens = Object.keys(localStorage).some((key) =>
      key.includes('auth0spajs')
    );
    const isRedirecting =
      typeof window !== 'undefined' &&
      window.location.search.includes('code=') &&
      window.location.search.includes('state=');

    if (
      isIOS &&
      !isLoading &&
      !isAuthenticated &&
      hasAuth0Tokens &&
      !isRedirecting
    ) {
      Object.keys(localStorage).forEach((key) => {
        if (key.includes('auth0spajs')) {
          localStorage.removeItem(key);
        }
      });
      window.location.href = '/';
    }
  }, [isLoading, isAuthenticated]);

  useEffect(() => {
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    if (!isLoading && !isAuthenticated) {
      loginWithRedirect({
        authorizationParams: {
          prompt: isIOS ? 'login' : undefined,
          response_mode: isIOS ? 'web_message' : undefined
        }
      });
    }
  }, [isLoading, isAuthenticated, loginWithRedirect]);

  useEffect(() => {
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 500;
    const triedPopup = sessionStorage.getItem('popupAttempted');
    if (!isLoading && !isAuthenticated && isMobile && !triedPopup) {
      sessionStorage.setItem('popupAttempted', 'true');
      loginWithPopup().catch(() => loginWithRedirect());
    }
  }, [isLoading, isAuthenticated, loginWithPopup, loginWithRedirect]);

  const [authAttempts, setAuthAttempts] = useState(0);
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      if (authAttempts > 2) {
        Object.keys(localStorage).forEach((key) => {
          if (key.includes('auth0spajs')) {
            localStorage.removeItem(key);
          }
        });
        loginWithRedirect({
          authorizationParams: {
            prompt: 'login',
            response_mode: 'web_message'
          }
        });
        return;
      }
      setAuthAttempts((a) => a + 1);
      loginWithRedirect();
    }
  }, [isLoading, isAuthenticated, authAttempts, loginWithRedirect]);

  return {
    isAuthenticated,
    isLoading,
    user,
    loginWithRedirect,
    loginWithPopup,
    logout
  };
}

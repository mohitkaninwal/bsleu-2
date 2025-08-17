import { useState, useEffect, useCallback } from 'react';
import { authAPI, isAuthenticated, type User } from '@/services/api';

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  isLoading: boolean;
  isAuthorized: boolean;
}

export function usePersistentAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    user: null,
    isLoading: true,
    isAuthorized: false
  });

  // Check authentication status on mount and when tokens change
  const checkAuth = useCallback(async () => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true }));
      
      if (!isAuthenticated()) {
        setAuthState({
          isAuthenticated: false,
          user: null,
          isLoading: false,
          isAuthorized: false
        });
        return;
      }

      // Verify token is still valid by fetching current user
      const response = await authAPI.getCurrentUser();
      
      if (!response.success || !response.user) {
        // Token is invalid, clear it
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('currentUser');
        
        setAuthState({
          isAuthenticated: false,
          user: null,
          isLoading: false,
          isAuthorized: false
        });
        return;
      }

      // Save user data to localStorage for persistence
      localStorage.setItem('currentUser', JSON.stringify(response.user));
      
      const isAdmin = response.user.role?.toLowerCase() === 'admin';
      
      setAuthState({
        isAuthenticated: true,
        user: response.user,
        isLoading: false,
        isAuthorized: isAdmin
      });
      
    } catch (error) {
      console.error('Auth check failed:', error);
      // On error, clear auth state but don't remove tokens immediately
      // as it might be a network issue
      setAuthState({
        isAuthenticated: false,
        user: null,
        isLoading: false,
        isAuthorized: false
      });
    }
  }, []);

  // Initial auth check on mount
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // Listen for storage changes (e.g., logout in another tab)
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'accessToken' || e.key === 'currentUser') {
        checkAuth();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [checkAuth]);

  // Login function
  const login = useCallback(async (email: string, password: string) => {
    try {
      const response = await authAPI.login(email, password);
      
      if (response.success) {
        // Recheck auth state after successful login
        await checkAuth();
      }
      
      return response;
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  }, [checkAuth]);

  // Logout function
  const logout = useCallback(async () => {
    try {
      await authAPI.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear auth state regardless of API call result
      setAuthState({
        isAuthenticated: false,
        user: null,
        isLoading: false,
        isAuthorized: false
      });
    }
  }, []);

  // Refresh auth state (useful for manual refresh)
  const refreshAuth = useCallback(() => {
    return checkAuth();
  }, [checkAuth]);

  return {
    ...authState,
    login,
    logout,
    refreshAuth,
    checkAuth
  };
}

import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@/contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

const PROFILE_TIMEOUT_MS = 10000; // 10 seconds timeout for profile loading

export default function ProtectedRoute({ children, requireAdmin = false }: ProtectedRouteProps) {
  const { user, profile, loading, refreshUserData } = useAuth();
  const router = useRouter();
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [profileTimedOut, setProfileTimedOut] = useState(false);

  // Timeout for profile loading on admin routes
  useEffect(() => {
    if (requireAdmin && user && !profile && !profileTimedOut) {
      const timer = setTimeout(() => {
        console.warn('Profile loading timed out');
        setProfileTimedOut(true);
      }, PROFILE_TIMEOUT_MS);
      
      return () => clearTimeout(timer);
    }
  }, [requireAdmin, user, profile, profileTimedOut]);

  // Retry fetching profile if it times out
  useEffect(() => {
    if (profileTimedOut && user && !profile) {
      refreshUserData?.();
    }
  }, [profileTimedOut, user, profile, refreshUserData]);

  useEffect(() => {
    if (!loading && !isRedirecting) {
      if (!user) {
        // Not logged in, redirect to login
        setIsRedirecting(true);
        router.push('/login');
      } else if (requireAdmin && profile && profile.role !== 'admin') {
        // Not an admin, redirect to dashboard
        setIsRedirecting(true);
        router.push('/dashboard');
      } else if (requireAdmin && profileTimedOut && !profile) {
        // Profile timed out, redirect to dashboard as fallback
        setIsRedirecting(true);
        router.push('/dashboard');
      }
    }
  }, [user, profile, loading, router, requireAdmin, isRedirecting, profileTimedOut]);

  // Show loading state while checking auth
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-delaware-blue mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Don't render children until we've verified auth
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-delaware-blue mx-auto mb-4"></div>
          <p className="text-gray-600">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  // For admin routes, wait for profile to load before rendering
  if (requireAdmin) {
    // Profile still loading
    if (!profile) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-delaware-blue mx-auto mb-4"></div>
            <p className="text-gray-600">Verifying permissions...</p>
          </div>
        </div>
      );
    }
    
    // Profile loaded but not admin
    if (profile.role !== 'admin') {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-delaware-blue mx-auto mb-4"></div>
            <p className="text-gray-600">Access denied. Redirecting...</p>
          </div>
        </div>
      );
    }
  }

  return <>{children}</>;
}


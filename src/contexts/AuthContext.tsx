import { createContext, useContext, useEffect, useState, ReactNode, useRef } from 'react';
import { User, Session, AuthError } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/router';

interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  company_name: string | null;
  phone: string | null;
  avatar_url: string | null;
  role: string;
  created_at: string;
  updated_at: string;
}

interface Subscription {
  id: string;
  user_id: string;
  tier: 'free' | 'pro' | 'business';
  status: 'active' | 'cancelled' | 'expired' | 'trial';
  search_limit: number | null;
  save_limit: number | null;
  export_limit: number | null;
  billing_cycle_start: string | null;
  billing_cycle_end: string | null;
  trial_ends_at: string | null;
  created_at: string;
  updated_at: string;
}

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  subscription: Subscription | null;
  session: Session | null;
  loading: boolean;
  signUp: (email: string, password: string, fullName: string) => Promise<{ error: AuthError | null }>;
  signIn: (email: string, password: string) => Promise<{ error: AuthError | null }>;
  signOut: () => Promise<void>;
  updateProfile: (updates: Partial<Profile>) => Promise<{ error: Error | null }>;
  refreshUserData: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Fetch user profile
  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) throw error;
      setProfile(data);
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  // Fetch user subscription
  const fetchSubscription = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', userId)
        .eq('status', 'active')
        .single();

      if (error) throw error;
      setSubscription(data);
    } catch (error) {
      console.error('Error fetching subscription:', error);
    }
  };

  // Refresh all user data
  const refreshUserData = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user) {
      await Promise.all([
        fetchProfile(session.user.id),
        fetchSubscription(session.user.id),
      ]);
    }
  };

  // Track if initialization is complete
  const initCompleteRef = useRef(false);

  // Initialize auth state
  useEffect(() => {
    let isMounted = true;
    
    // Timeout to prevent infinite loading - uses ref to check status
    const timeoutId = setTimeout(() => {
      if (isMounted && !initCompleteRef.current) {
        console.warn('Auth initialization timed out after 10 seconds');
        initCompleteRef.current = true;
        setLoading(false);
      }
    }, 10000);

    // Get initial session with error handling
    const initAuth = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (!isMounted) return;
        
        if (error) {
          console.error('Error getting session:', error);
        }
        
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          await Promise.all([
            fetchProfile(session.user.id),
            fetchSubscription(session.user.id),
          ]);
        }
        
        if (isMounted) {
          initCompleteRef.current = true;
          setLoading(false);
        }
      } catch (error) {
        console.error('Failed to get session:', error);
        if (isMounted) {
          initCompleteRef.current = true;
          setLoading(false); // Ensure loading is set to false even on error
        }
      }
    };

    initAuth();

    return () => {
      isMounted = false;
      clearTimeout(timeoutId);
    };
  }, []); // Empty dependency array - only run once on mount

  // Listen for auth changes (separate effect)
  useEffect(() => {
    const {
      data: { subscription: authSubscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event);
      
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);

      // Redirect immediately without waiting for data
      if (event === 'SIGNED_IN') {
        router.push('/dashboard');
        // Fetch data in background after redirect
        if (session?.user) {
          Promise.all([
            fetchProfile(session.user.id),
            fetchSubscription(session.user.id),
          ]);
        }
      } else if (event === 'SIGNED_OUT') {
        setProfile(null);
        setSubscription(null);
        router.push('/');
      } else if (session?.user) {
        // For other events, fetch data normally
        await Promise.all([
          fetchProfile(session.user.id),
          fetchSubscription(session.user.id),
        ]);
      } else {
        setProfile(null);
        setSubscription(null);
      }
    });

    return () => {
      authSubscription.unsubscribe();
    };
  }, [router]);

  // Sign up
  const signUp = async (email: string, password: string, fullName: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
        },
      });

      if (error) return { error };

      // Profile and subscription are created automatically via database triggers
      return { error: null };
    } catch (error) {
      return { error: error as AuthError };
    }
  };

  // Sign in
  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) return { error };
      return { error: null };
    } catch (error) {
      return { error: error as AuthError };
    }
  };

  // Sign out
  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
    setSubscription(null);
    router.push('/');
  };

  // Update profile
  const updateProfile = async (updates: Partial<Profile>) => {
    if (!user) return { error: new Error('No user logged in') };

    try {
      const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user.id);

      if (error) throw error;

      // Refresh profile data
      await fetchProfile(user.id);
      return { error: null };
    } catch (error) {
      return { error: error as Error };
    }
  };

  const value: AuthContextType = {
    user,
    profile,
    subscription,
    session,
    loading,
    signUp,
    signIn,
    signOut,
    updateProfile,
    refreshUserData,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}


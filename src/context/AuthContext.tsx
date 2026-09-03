import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

interface AuthContextType {
  currentUser: User | null;
  isLoading: boolean;
  isAuthModalOpen: boolean;
  authModalMode: 'login' | 'signup' | 'forgot_password';
  authGateReason: string;
  isSupabaseConfigured: boolean;
  login: (email: string, pass: string, remember: boolean) => Promise<{ success: boolean; error?: string }>;
  register: (name: string, email: string, pass: string) => Promise<{ success: boolean; error?: string }>;
  loginWithGoogle: () => Promise<{ success: boolean; error?: string }>;
  forgotPassword: (email: string) => Promise<{ success: boolean; error?: string; message?: string }>;
  logout: () => void;
  updateProfile: (updated: Partial<User>) => void;
  openAuthModal: (mode?: 'login' | 'signup' | 'forgot_password', reason?: string) => void;
  closeAuthModal: () => void;
  requireAuth: (action: () => void, reason?: string) => void;
}

const STORAGE_KEY_USER = 'furtrace_auth_user';
const STORAGE_KEY_ACCOUNTS = 'furtrace_registered_users';

const INITIAL_DEMO_USERS: Record<string, { user: User; passwordHash: string }> = {
  'demo@furtrace.org': {
    user: {
      id: 'usr-demo-001',
      name: 'Community Spotter',
      email: 'demo@furtrace.org',
      avatarUrl: 'https://api.dicebear.com/7.x/bottts/svg?seed=demo',
      provider: 'email',
      createdAt: '2026-08-20',
      phone: '+63 900 000 0000',
      notificationsEnabled: true,
      myLostPetIds: [],
      mySightingIds: []
    },
    passwordHash: 'Password123!'
  }
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'signup' | 'forgot_password'>('login');
  const [authGateReason, setAuthGateReason] = useState<string>('');

  // Load persisted session on mount (Supabase first if configured, else localStorage)
  useEffect(() => {
    let isMounted = true;

    async function initSession() {
      if (isSupabaseConfigured && supabase) {
        try {
          const { data: { session } } = await supabase.auth.getSession();
          if (session?.user && isMounted) {
            const mappedUser: User = {
              id: session.user.id,
              name: session.user.user_metadata?.full_name || session.user.user_metadata?.name || session.user.email?.split('@')[0] || 'Community Member',
              email: session.user.email || '',
              avatarUrl: session.user.user_metadata?.avatar_url || `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(session.user.email || 'user')}`,
              provider: (session.user.app_metadata?.provider as 'google' | 'email') || 'email',
              createdAt: session.user.created_at.split('T')[0],
              notificationsEnabled: true,
              myLostPetIds: [],
              mySightingIds: []
            };
            setCurrentUser(mappedUser);
            setIsLoading(false);
            return;
          }
        } catch {
          // Fall back to local storage
        }

        // Subscribe to auth state changes in Supabase
        const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
          if (session?.user) {
            const mappedUser: User = {
              id: session.user.id,
              name: session.user.user_metadata?.full_name || session.user.user_metadata?.name || session.user.email?.split('@')[0] || 'Community Member',
              email: session.user.email || '',
              avatarUrl: session.user.user_metadata?.avatar_url || `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(session.user.email || 'user')}`,
              provider: (session.user.app_metadata?.provider as 'google' | 'email') || 'email',
              createdAt: session.user.created_at.split('T')[0],
              notificationsEnabled: true,
              myLostPetIds: [],
              mySightingIds: []
            };
            setCurrentUser(mappedUser);
          } else {
            setCurrentUser(null);
          }
        });

        return () => {
          authListener?.subscription.unsubscribe();
        };
      }

      // Local fallback initialization
      try {
        const stored = localStorage.getItem(STORAGE_KEY_USER);
        if (stored && isMounted) {
          const parsed = JSON.parse(stored);
          if (parsed && (parsed.email === 'johnmaraledon823@gmail.com' || parsed.id === 'usr-001')) {
            // Automatically clear developer account from stored local session for privacy & security
            localStorage.removeItem(STORAGE_KEY_USER);
            setCurrentUser(null);
          } else {
            setCurrentUser(parsed);
          }
        }
      } catch {
        // Ignore storage error
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    initSession();

    return () => {
      isMounted = false;
    };
  }, []);

  const getSavedUsers = (): Record<string, { user: User; passwordHash: string }> => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_ACCOUNTS);
      if (saved) {
        return { ...INITIAL_DEMO_USERS, ...JSON.parse(saved) };
      }
    } catch {
      // Ignore
    }
    return INITIAL_DEMO_USERS;
  };

  const persistUser = (user: User | null, remember: boolean = true) => {
    setCurrentUser(user);
    if (user && remember) {
      localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEY_USER);
    }
  };

  const login = async (email: string, pass: string, remember: boolean): Promise<{ success: boolean; error?: string }> => {
    const trimmedEmail = email.trim().toLowerCase();

    // If Supabase is configured, authenticate via Supabase
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: trimmedEmail,
          password: pass
        });
        if (error) {
          return { success: false, error: error.message };
        }
        if (data.user) {
          const user: User = {
            id: data.user.id,
            name: data.user.user_metadata?.full_name || data.user.user_metadata?.name || data.user.email?.split('@')[0] || 'Community Member',
            email: data.user.email || trimmedEmail,
            avatarUrl: data.user.user_metadata?.avatar_url || `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(trimmedEmail)}`,
            provider: 'email',
            createdAt: data.user.created_at.split('T')[0],
            notificationsEnabled: true,
            myLostPetIds: [],
            mySightingIds: []
          };
          persistUser(user, remember);
          setIsAuthModalOpen(false);
          return { success: true };
        }
      } catch (err: unknown) {
        return { success: false, error: (err as Error).message || 'Authentication failed' };
      }
    }

    // Local fallback
    const users = getSavedUsers();
    const account = users[trimmedEmail];

    if (!account) {
      return { success: false, error: 'No account found with this email address. Please sign up first.' };
    }

    if (account.passwordHash !== pass) {
      return { success: false, error: 'Incorrect password. Please try again or use password reset.' };
    }

    persistUser(account.user, remember);
    setIsAuthModalOpen(false);
    return { success: true };
  };

  const register = async (name: string, email: string, pass: string): Promise<{ success: boolean; error?: string }> => {
    const trimmedEmail = email.trim().toLowerCase();

    // If Supabase is configured, sign up via Supabase
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase.auth.signUp({
          email: trimmedEmail,
          password: pass,
          options: {
            data: {
              name: name.trim(),
              full_name: name.trim(),
              avatar_url: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(trimmedEmail)}`
            }
          }
        });
        if (error) {
          return { success: false, error: error.message };
        }
        if (data.user) {
          const newUser: User = {
            id: data.user.id,
            name: name.trim(),
            email: trimmedEmail,
            avatarUrl: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(trimmedEmail)}`,
            provider: 'email',
            createdAt: new Date().toISOString().split('T')[0],
            notificationsEnabled: true,
            myLostPetIds: [],
            mySightingIds: []
          };
          persistUser(newUser, true);
          setIsAuthModalOpen(false);
          return { success: true };
        }
      } catch (err: unknown) {
        return { success: false, error: (err as Error).message || 'Registration failed' };
      }
    }

    // Local fallback
    const users = getSavedUsers();

    if (users[trimmedEmail]) {
      return { success: false, error: 'An account with this email address already exists. Please log in.' };
    }

    const newUser: User = {
      id: `usr-${Date.now()}`,
      name: name.trim(),
      email: trimmedEmail,
      avatarUrl: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(trimmedEmail)}`,
      provider: 'email',
      createdAt: new Date().toISOString().split('T')[0],
      notificationsEnabled: true,
      myLostPetIds: [],
      mySightingIds: []
    };

    users[trimmedEmail] = {
      user: newUser,
      passwordHash: pass
    };

    try {
      localStorage.setItem(STORAGE_KEY_ACCOUNTS, JSON.stringify(users));
    } catch {
      // Ignore
    }

    persistUser(newUser, true);
    setIsAuthModalOpen(false);
    return { success: true };
  };

  const loginWithGoogle = async (): Promise<{ success: boolean; error?: string }> => {
    if (isSupabaseConfigured && supabase) {
      try {
        const { error } = await supabase.auth.signInWithOAuth({
          provider: 'google',
          options: {
            redirectTo: window.location.origin
          }
        });
        if (error) return { success: false, error: error.message };
        return { success: true };
      } catch (err: unknown) {
        return { success: false, error: (err as Error).message };
      }
    }

    // Simulated Google OAuth response with generic community member profile
    const guestSeed = Math.floor(1000 + Math.random() * 9000);
    const googleUser: User = {
      id: `usr-google-${guestSeed}`,
      name: 'Community Member',
      email: `community.member.${guestSeed}@gmail.com`,
      avatarUrl: `https://api.dicebear.com/7.x/bottts/svg?seed=community-${guestSeed}`,
      provider: 'google',
      createdAt: new Date().toISOString().split('T')[0],
      phone: '',
      notificationsEnabled: true,
      myLostPetIds: [],
      mySightingIds: []
    };

    persistUser(googleUser, true);
    setIsAuthModalOpen(false);
    return { success: true };
  };

  const forgotPassword = async (email: string): Promise<{ success: boolean; error?: string; message?: string }> => {
    const trimmedEmail = email.trim().toLowerCase();

    if (isSupabaseConfigured && supabase) {
      try {
        const { error } = await supabase.auth.resetPasswordForEmail(trimmedEmail, {
          redirectTo: `${window.location.origin}/reset-password`
        });
        if (error) return { success: false, error: error.message };
        return {
          success: true,
          message: `Password reset link sent to ${trimmedEmail}. Please check your inbox.`
        };
      } catch (err: unknown) {
        return { success: false, error: (err as Error).message };
      }
    }

    const users = getSavedUsers();

    if (!users[trimmedEmail]) {
      return { success: false, error: 'No registered account found with that email.' };
    }

    return {
      success: true,
      message: `Password reset instructions have been dispatched to ${trimmedEmail}. Please check your inbox.`
    };
  };

  const logout = async () => {
    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.auth.signOut();
      } catch {
        // Ignore
      }
    }
    persistUser(null, false);
  };

  const updateProfile = (updated: Partial<User>) => {
    if (!currentUser) return;
    const next = { ...currentUser, ...updated };
    persistUser(next, true);

    const users = getSavedUsers();
    if (users[next.email]) {
      users[next.email].user = next;
      try {
        localStorage.setItem(STORAGE_KEY_ACCOUNTS, JSON.stringify(users));
      } catch {
        // Ignore
      }
    }
  };

  const openAuthModal = (mode: 'login' | 'signup' | 'forgot_password' = 'login', reason: string = '') => {
    setAuthModalMode(mode);
    setAuthGateReason(reason);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
    setAuthGateReason('');
  };

  const requireAuth = (action: () => void, reason: string = 'Please sign in to access this feature.') => {
    if (currentUser) {
      action();
    } else {
      openAuthModal('login', reason);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isLoading,
        isAuthModalOpen,
        authModalMode,
        authGateReason,
        isSupabaseConfigured,
        login,
        register,
        loginWithGoogle,
        forgotPassword,
        logout,
        updateProfile,
        openAuthModal,
        closeAuthModal,
        requireAuth
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};


import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { 
  User, 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut 
} from 'firebase/auth';
import { auth } from '../services/firebase';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAdmin: boolean;
  authProviderDisabled: boolean;
  login: (emailOrUser: string, password: string) => Promise<User>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [authProviderDisabled, setAuthProviderDisabled] = useState(false);

  // Auto-bootstrap the admin user on load if it doesn't exist
  useEffect(() => {
    const bootstrapAdmin = async () => {
      try {
        // Try creating the admin user. If it already exists, Firebase will throw an auth/email-already-in-use error, which we safely catch.
        await createUserWithEmailAndPassword(auth, 'admin@torneo.local', 'boscatello');
        console.log('Admin user bootstrapped successfully.');
      } catch (error: any) {
        if (error.code === 'auth/email-already-in-use') {
          console.log('Admin user already exists.');
        } else if (error.code === 'auth/operation-not-allowed') {
          console.error('Admin bootstrap error: Email/Password provider is disabled in Firebase console.');
          setAuthProviderDisabled(true);
        } else {
          console.error('Admin bootstrap error:', error);
        }
      }
    };
    bootstrapAdmin();
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const login = async (emailOrUser: string, password: string) => {
    // If user enters 'admin', convert it to 'admin@torneo.local'
    const email = emailOrUser.trim().toLowerCase() === 'admin' 
      ? 'admin@torneo.local' 
      : emailOrUser;
    
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  };

  const logout = async () => {
    await signOut(auth);
  };

  const isAdmin = user !== null && user.email === 'admin@torneo.local';

  return (
    <AuthContext.Provider value={{ user, loading, isAdmin, authProviderDisabled, login, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { User, onAuthStateChanged, signInWithPopup, GoogleAuthProvider, signOut as firebaseSignOut } from 'firebase/auth';
import { auth, db } from '../lib/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';

interface UserData {
  id: string;
  role: string;
  email: string;
  firstName: string;
  lastName: string;
  createdAt: string;
}

interface AuthContextType {
  user: User | null;
  userData: UserData | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      
      if (currentUser) {
        try {
          const fetchDocPromise = getDoc(doc(db, 'users', currentUser.uid));
          const timeoutPromise = new Promise((_, reject) => 
            setTimeout(() => reject(new Error('Firestore fetch timeout')), 3000)
          );
          
          const userDoc = (await Promise.race([fetchDocPromise, timeoutPromise])) as any;
          if (userDoc && userDoc.exists && userDoc.exists()) {
            setUserData(userDoc.data() as UserData);
          } else {
            // If it's a new user and they sign in via Google, we might not know their role initially.
            // But we will create a default record.
            const newUserData: UserData = {
              id: currentUser.uid,
              role: 'student', // default role, they can be redirected to onboarding
              email: currentUser.email || '',
              firstName: currentUser.displayName?.split(' ')[0] || '',
              lastName: currentUser.displayName?.split(' ').slice(1).join(' ') || '',
              createdAt: new Date().toISOString()
            };
            try {
              await setDoc(doc(db, 'users', currentUser.uid), newUserData);
            } catch (err) {
              console.warn("Could not save user data to Firestore:", err);
            }
            setUserData(newUserData);
          }
        } catch (error) {
          console.warn("Firestore user data fetch failed or timed out, using fallback user profile:", error);
          const fallbackUserData: UserData = {
            id: currentUser.uid,
            role: 'student',
            email: currentUser.email || '',
            firstName: currentUser.displayName?.split(' ')[0] || 'User',
            lastName: currentUser.displayName?.split(' ').slice(1).join(' ') || '',
            createdAt: new Date().toISOString()
          };
          setUserData(fallbackUserData);
        }
      } else {
        setUserData(null);
      }
      
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider);
  };

  const signOut = async () => {
    await firebaseSignOut(auth);
  };

  return (
    <AuthContext.Provider value={{ user, userData, loading, signInWithGoogle, signOut }}>
      {children}
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

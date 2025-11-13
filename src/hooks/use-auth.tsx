
"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import type { User } from "@/lib/types";
import { getUserById } from "@/lib/data";
import { auth } from "@/lib/firebase";
import { signInWithEmailAndPassword, signOut, onAuthStateChanged } from "firebase/auth";
import { Loader2 } from "lucide-react";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<User | null>;
  logout: () => void;
  // No signup here, that's a separate action
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // Optionally fetch user details from Firestore using UID
        const fetchedUser = await getUserById(firebaseUser.uid);
        setUser(fetchedUser || null);
      } else {
        setUser(null);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const login = async (email: string, password: string): Promise<User | null> => {
    try {
      const credential = await signInWithEmailAndPassword(auth, email, password);
      const firebaseUser = credential.user;
      // Optionally fetch user details from Firestore using UID
      const fetchedUser = await getUserById(firebaseUser.uid);
      setUser(fetchedUser || null);
      return fetchedUser || null;
    } catch (error) {
      console.error("Login failed:", error);
      setUser(null);
      return null;
    }
  };

  const logout = () => {
    signOut(auth);
    setUser(null);
  };

  const value = { user, loading, login, logout };

  return (
    <AuthContext.Provider value={value}>
      {loading ? (
        <div className="h-screen w-screen flex items-center justify-center">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </div>
      ) : children }
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

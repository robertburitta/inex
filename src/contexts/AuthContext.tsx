"use client";

import { createContext, useContext, useEffect, useState } from "react";
import {
  User,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  confirmPasswordReset,
  AuthError,
} from "firebase/auth";
import { auth } from "@/lib/firebase";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signInWithGoogle: () => Promise<boolean>;
  signInWithEmail: (email: string, password: string) => Promise<boolean>;
  signUpWithEmail: (email: string, password: string) => Promise<boolean>;
  resetPassword: (email: string) => Promise<boolean>;
  confirmResetPassword: (
    oobCode: string,
    newPassword: string
  ) => Promise<boolean>;
  logout: () => Promise<void>;
  error: string | null;
  success: string | null;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const useAuth = () => useContext(AuthContext);

const getErrorMessage = (error: AuthError): string => {
  switch (error.code) {
    case "auth/email-already-in-use":
      return "Ten adres email jest już używany. Spróbuj się zalogować lub użyj innego adresu email.";
    case "auth/invalid-email":
      return "Nieprawidłowy adres email.";
    case "auth/operation-not-allowed":
      return "Ta metoda logowania nie jest włączona. Skontaktuj się z administratorem.";
    case "auth/weak-password":
      return "Hasło jest zbyt słabe. Użyj co najmniej 6 znaków.";
    case "auth/user-disabled":
      return "To konto zostało wyłączone. Skontaktuj się z administratorem.";
    case "auth/user-not-found":
      return "Nie znaleziono użytkownika z tym adresem email.";
    case "auth/wrong-password":
      return "Nieprawidłowe hasło.";
    case "auth/invalid-credential":
      return "Nieprawidłowy email lub hasło.";
    case "auth/too-many-requests":
      return "Zbyt wiele prób logowania. Spróbuj ponownie później.";
    case "auth/network-request-failed":
      return "Problem z połączeniem sieciowym. Sprawdź swoje połączenie internetowe.";
    case "auth/popup-closed-by-user":
      return "Okno logowania zostało zamknięte. Spróbuj ponownie.";
    case "auth/popup-blocked":
      return "Okno logowania zostało zablokowane przez przeglądarkę. Sprawdź ustawienia przeglądarki.";
    case "auth/cancelled-popup-request":
      return "Operacja została anulowana. Spróbuj ponownie.";
    case "auth/account-exists-with-different-credential":
      return "Konto z tym adresem email już istnieje, ale używa innej metody logowania.";
    default:
      return "Wystąpił nieoczekiwany błąd. Spróbuj ponownie później.";
  }
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
      if (user) {
        user.getIdToken().then((token) => {
          document.cookie = `auth-token=${token}; path=/; max-age=3600; SameSite=Lax`;
        });
      } else {
        document.cookie = "auth-token=; path=/; max-age=0; SameSite=Lax";
      }
    });

    return unsubscribe;
  }, []);

  const signInWithGoogle = async () => {
    setError(null);
    setSuccess(null);
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      setSuccess("Pomyślnie zalogowano przez Google");
      return true;
    } catch (error) {
      console.error("Błąd logowania:", error);
      setError(getErrorMessage(error as AuthError));
      return false;
    }
  };

  const signInWithEmail = async (email: string, password: string) => {
    setError(null);
    setSuccess(null);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      setSuccess("Pomyślnie zalogowano");
      return true;
    } catch (error) {
      console.error("Błąd logowania:", error);
      setError(getErrorMessage(error as AuthError));
      return false;
    }
  };

  const signUpWithEmail = async (email: string, password: string) => {
    setError(null);
    setSuccess(null);
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      setSuccess("Konto zostało utworzone pomyślnie");
      return true;
    } catch (error) {
      console.error("Błąd rejestracji:", error);
      setError(getErrorMessage(error as AuthError));
      return false;
    }
  };

  const resetPassword = async (email: string) => {
    setError(null);
    setSuccess(null);
    try {
      await sendPasswordResetEmail(auth, email, {
        url: `${window.location.origin}/reset-password`,
      });
      setSuccess(
        "Link do resetowania hasła został wysłany na podany adres email"
      );
      return true;
    } catch (error) {
      console.error("Błąd resetowania hasła:", error);
      setError(getErrorMessage(error as AuthError));
      return false;
    }
  };

  const confirmResetPassword = async (oobCode: string, newPassword: string) => {
    setError(null);
    setSuccess(null);
    try {
      await confirmPasswordReset(auth, oobCode, newPassword);
      setSuccess("Hasło zostało zmienione pomyślnie");
      return true;
    } catch (error) {
      console.error("Błąd zmiany hasła:", error);
      setError(getErrorMessage(error as AuthError));
      return false;
    }
  };

  const logout = async () => {
    setError(null);
    setSuccess(null);
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Błąd wylogowania:", error);
      setError(getErrorMessage(error as AuthError));
    }
  };

  const value = {
    user,
    loading,
    signInWithGoogle,
    signInWithEmail,
    signUpWithEmail,
    resetPassword,
    confirmResetPassword,
    logout,
    error,
    success,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

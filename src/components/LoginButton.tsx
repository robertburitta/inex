'use client';

import { useAuth } from '@/contexts/AuthContext';

export const LoginButton = () => {
  const { user, signInWithGoogle, logout } = useAuth();

  return (
    <button
      onClick={user ? logout : signInWithGoogle}
      className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
    >
      {user ? 'Wyloguj się' : 'Zaloguj się przez Google'}
    </button>
  );
}; 
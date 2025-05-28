'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter, usePathname } from 'next/navigation';
import { useState } from 'react';
import Link from 'next/link';

export default function Header() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  const renderDesktopMenu = () => {
    if (user) {
      return (
        <>
          <span className="text-gray-600">Witaj, {user.email}</span>
          <button
            onClick={() => router.push('/dashboard')}
            className="px-4 py-2 text-gray-600 hover:text-gray-900"
          >
            Panel użytkownika
          </button>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
          >
            Wyloguj się
          </button>
        </>
      );
    }

    return (
      <>
        <button
          onClick={() => router.push('/login')}
          className="px-4 py-2 text-gray-600 hover:text-gray-900"
        >
          Zaloguj się
        </button>
        <button
          onClick={() => router.push('/register')}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          Rozpocznij za darmo
        </button>
      </>
    );
  };

  const renderMobileMenu = () => {
    if (user) {
      return (
        <>
          <div className="px-3 py-2 text-gray-600">
            Witaj, {user.email}
          </div>
          <button
            onClick={() => {
              router.push('/dashboard');
              setIsMenuOpen(false);
            }}
            className="block w-full text-left px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md"
          >
            Panel użytkownika
          </button>
          <button
            onClick={() => {
              handleLogout();
              setIsMenuOpen(false);
            }}
            className="block w-full text-left px-3 py-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-md"
          >
            Wyloguj się
          </button>
        </>
      );
    }

    return (
      <>
        <button
          onClick={() => {
            router.push('/login');
            setIsMenuOpen(false);
          }}
          className="block w-full text-left px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md"
        >
          Zaloguj się
        </button>
        <button
          onClick={() => {
            router.push('/register');
            setIsMenuOpen(false);
          }}
          className="block w-full text-left px-3 py-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-md"
        >
          Rozpocznij za darmo
        </button>
      </>
    );
  };

  return (
    <nav className="bg-white/90 shadow-sm sticky top-0 z-30 backdrop-blur">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="text-xl font-bold text-gray-900 hover:text-gray-800 transition-colors">
              InEx
            </Link>
          </div>

          {/* Menu dla desktop */}
          <div className="hidden md:flex items-center space-x-4">
            {renderDesktopMenu()}
          </div>

          {/* Przycisk hamburger dla mobile */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
            >
              <span className="sr-only">Otwórz menu</span>
              {!isMenuOpen ? (
                <svg className="block h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              ) : (
                <svg className="block h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Menu mobilne */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {renderMobileMenu()}
          </div>
        </div>
      )}
    </nav>
  );
} 
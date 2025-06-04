"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useRouter, usePathname } from "next/navigation";
import { useState, useRef, useEffect, Fragment } from "react";
import Link from "next/link";
import Image from "next/image";
import { Transition } from "@headlessui/react";

function getInitials(nameOrEmail: string) {
  if (!nameOrEmail) return "?";
  const parts = nameOrEmail.split(" ");
  if (parts.length > 1) return (parts[0][0] + parts[1][0]).toUpperCase();
  if (nameOrEmail.includes("@")) return nameOrEmail[0].toUpperCase();
  return nameOrEmail.slice(0, 2).toUpperCase();
}

export default function Header() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleLogout = async () => {
    await logout();
    router.push("/");
  };

  // Zamykaj dropdown po kliknięciu poza
  useEffect(() => {
    if (!isDropdownOpen) return;
    function handleClick(e: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [isDropdownOpen]);

  // Menu główne (desktop)
  const mainMenu = [
    { label: "Panel", href: "/dashboard" },
    { label: "Salda/Konta", href: "/accounts" },
    { label: "Statystyki", href: "/stats" },
    // Dodaj kolejne w przyszłości
  ];

  return (
    <header className=" bg-white shadow-sm sticky top-0 z-50 backdrop-blur">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <Link
            href="/"
            className="text-2xl font-bold text-gray-900 hover:text-gray-800 transition-colors"
          >
            InEx
          </Link>

          {/* Menu główne (desktop) */}
          <div className="hidden md:flex items-center space-x-6">
            {user &&
              mainMenu.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
                >
                  {item.label}
                </Link>
              ))}
          </div>

          {/* Prawa strona */}
          <div className="flex items-center space-x-4">
            {/* Avatar + dropdown tylko na desktopie */}
            {user ? (
              <div className="relative hidden md:block" ref={dropdownRef}>
                <button
                  onClick={() => setIsDropdownOpen((v) => !v)}
                  className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center border-2 border-gray-300 hover:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all"
                  aria-label="Menu użytkownika"
                >
                  {user.photoURL ? (
                    <Image
                      src={user.photoURL}
                      alt="avatar"
                      width={40}
                      height={40}
                      className="w-10 h-10 rounded-full object-cover"
                      priority={false}
                    />
                  ) : (
                    <span className="text-lg font-bold text-gray-700">
                      {getInitials(user.displayName || user.email || "")}
                    </span>
                  )}
                </button>
                <Transition
                  as={Fragment}
                  show={isDropdownOpen}
                  enter="transition ease-out duration-100"
                  enterFrom="transform opacity-0 scale-95"
                  enterTo="transform opacity-100 scale-100"
                  leave="transition ease-in duration-75"
                  leaveFrom="transform opacity-100 scale-100"
                  leaveTo="transform opacity-0 scale-95"
                >
                  <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg py-2 z-50">
                    <Link
                      href="/settings"
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      Ustawienia konta
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 transition-colors"
                    >
                      Wyloguj się
                    </button>
                  </div>
                </Transition>
              </div>
            ) : (
              <div className="hidden md:flex items-center space-x-2">
                <button
                  onClick={() => router.push("/login")}
                  className="px-4 py-2 text-gray-600 hover:text-gray-900"
                >
                  Zaloguj się
                </button>
                <button
                  onClick={() => router.push("/register")}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  Rozpocznij za darmo
                </button>
              </div>
            )}
            {/* Hamburger na mobile */}
            <div className="md:hidden flex items-center">
              <button
                onClick={() => setIsMenuOpen((v) => !v)}
                className="relative w-10 h-10 flex items-center justify-center focus:outline-none group"
                aria-label={isMenuOpen ? "Zamknij menu" : "Otwórz menu"}
              >
                {/* Hamburger/X animowany */}
                <span
                  className={`absolute left-2 right-2 h-0.5 bg-gray-800 rounded transition-all duration-300 ease-in-out
                    ${isMenuOpen ? "rotate-45 top-5" : "top-3"}`}
                />
                <span
                  className={`absolute left-2 right-2 h-0.5 bg-gray-800 rounded transition-all duration-300 ease-in-out
                    ${isMenuOpen ? "opacity-0 top-5" : "opacity-100 top-5"}`}
                />
                <span
                  className={`absolute left-2 right-2 h-0.5 bg-gray-800 rounded transition-all duration-300 ease-in-out
                    ${isMenuOpen ? "-rotate-45 top-5" : "top-7"}`}
                />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Menu mobilne */}
      <Transition
        as="div"
        show={isMenuOpen}
        enter="transition ease-out duration-200"
        enterFrom="opacity-0 -translate-y-4"
        enterTo="opacity-100 translate-y-0"
        leave="transition ease-in duration-150"
        leaveFrom="opacity-100 translate-y-0"
        leaveTo="opacity-0 -translate-y-4"
      >
        {/* Panel wysuwany spod nagłówka */}
        <div className="fixed left-0 right-0 z-50 bg-white shadow-xl px-6 py-8 flex flex-col md:hidden">
          <nav className="flex-1 flex flex-col gap-2">
            {mainMenu.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`block rounded-lg px-4 py-3 text-lg font-semibold leading-7 transition-colors ${
                  pathname === item.href
                    ? "text-blue-600 bg-blue-50"
                    : "text-gray-900 hover:bg-gray-50"
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="mt-8 border-t border-gray-200 pt-6 flex flex-col gap-2">
            {user ? (
              <>
                <Link
                  href="/settings"
                  className="block rounded-lg px-4 py-3 text-lg font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Ustawienia konta
                </Link>
                <button
                  className="block w-full text-left rounded-lg px-4 py-3 text-lg font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                  onClick={() => {
                    handleLogout();
                    setIsMenuOpen(false);
                  }}
                >
                  Wyloguj się
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => {
                    router.push("/login");
                    setIsMenuOpen(false);
                  }}
                  className="block w-full text-left rounded-lg px-4 py-3 text-lg font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                >
                  Zaloguj się
                </button>
                <button
                  onClick={() => {
                    router.push("/register");
                    setIsMenuOpen(false);
                  }}
                  className="block w-full text-left rounded-lg px-4 py-3 text-lg font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                >
                  Rozpocznij za darmo
                </button>
              </>
            )}
          </div>
        </div>
      </Transition>
    </header>
  );
}

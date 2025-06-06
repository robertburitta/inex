"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Fragment, useEffect, useRef, useState } from "react";
import { Transition } from "@headlessui/react";
import { useAuth } from "@/contexts/AuthContext";

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

  useEffect(() => {
    if (!isDropdownOpen) return;
    function handleClick(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [isDropdownOpen]);

  const mainMenu = [
    { label: "Panel", href: "/dashboard" },
    { label: "Konta", href: "/accounts" },
    { label: "Kategorie", href: "/categories" },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm backdrop-blur">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link
            href="/"
            className="text-2xl font-bold text-gray-900 transition-colors hover:text-gray-800"
          >
            InEx
          </Link>

          <div className="hidden items-center space-x-6 md:flex">
            {user &&
              mainMenu.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`font-medium transition-colors hover:text-blue-600 ${
                    pathname === item.href ? "text-blue-600" : "text-gray-700"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
          </div>

          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <div className="hidden md:flex">Witaj, {user.displayName?.split(" ")[0] || user.email?.split("@")[0]}</div>
                <div
                  className="relative hidden md:block"
                  ref={dropdownRef}
                >
                  <button
                    onClick={() => setIsDropdownOpen((v) => !v)}
                    className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-gray-300 bg-gray-200 transition-all hover:border-blue-500 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                    aria-label="Menu użytkownika"
                  >
                    {user.photoURL ? (
                      <Image
                        src={user.photoURL}
                        alt="avatar"
                        width={40}
                        height={40}
                        className="rounded-full object-cover"
                        priority={false}
                      />
                    ) : (
                      <span className="text-lg font-bold text-gray-700">{getInitials(user.displayName || user.email || "")}</span>
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
                    <div className="absolute right-0 z-50 mt-2 w-48 rounded-lg border border-gray-200 bg-white py-2 shadow-lg">
                      <Link
                        href="/settings"
                        className="block px-4 py-2 text-gray-700 transition-colors hover:bg-gray-50"
                        onClick={() => setIsDropdownOpen(false)}
                      >
                        Ustawienia konta
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="block w-full px-4 py-2 text-left text-red-600 transition-colors hover:bg-red-50"
                      >
                        Wyloguj się
                      </button>
                    </div>
                  </Transition>
                </div>
              </>
            ) : (
              <div className="hidden items-center space-x-2 md:flex">
                <button
                  onClick={() => router.push("/login")}
                  className="px-4 py-2 text-gray-600 hover:text-gray-900"
                >
                  Zaloguj się
                </button>
                <button
                  onClick={() => router.push("/register")}
                  className="rounded-lg bg-blue-500 px-4 py-2 text-white transition-colors hover:bg-blue-600"
                >
                  Rozpocznij za darmo
                </button>
              </div>
            )}

            <div className="flex items-center md:hidden">
              <button
                onClick={() => setIsMenuOpen((v) => !v)}
                className="group relative flex h-10 w-10 items-center justify-center focus:outline-none"
                aria-label={isMenuOpen ? "Zamknij menu" : "Otwórz menu"}
              >
                <span
                  className={`absolute right-2 left-2 h-0.5 rounded bg-gray-800 transition-all duration-300 ease-in-out ${isMenuOpen ? "top-5 rotate-45" : "top-3"}`}
                />
                <span
                  className={`absolute right-2 left-2 h-0.5 rounded bg-gray-800 transition-all duration-300 ease-in-out ${isMenuOpen ? "top-5 opacity-0" : "top-5 opacity-100"}`}
                />
                <span
                  className={`absolute right-2 left-2 h-0.5 rounded bg-gray-800 transition-all duration-300 ease-in-out ${isMenuOpen ? "top-5 -rotate-45" : "top-7"}`}
                />
              </button>
            </div>
          </div>
        </div>
      </div>

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
        <div className="fixed right-0 left-0 z-50 flex flex-col bg-white px-6 py-8 shadow-xl md:hidden">
          {user && (
            <>
              <div className="mb-6 flex items-center justify-between border-b border-gray-200 px-4 pb-8 text-lg leading-7">
                Witaj, {user.displayName?.split(" ")[0] || user.email?.split("@")[0]}
                <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-gray-300 bg-gray-200">
                  {user.photoURL ? (
                    <Image
                      src={user.photoURL}
                      alt="avatar"
                      width={40}
                      height={40}
                      className="rounded-full object-cover"
                      priority={false}
                    />
                  ) : (
                    <span className="text-lg font-bold text-gray-700">{getInitials(user.displayName || user.email || "")}</span>
                  )}
                </div>
              </div>
              <nav className="mb-6 flex flex-1 flex-col gap-2 border-b border-gray-200 pb-8">
                {mainMenu.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`block rounded-lg px-4 py-3 text-lg leading-7 font-semibold transition-colors ${
                      pathname === item.href ? "bg-blue-50 text-blue-600" : "text-gray-900 hover:bg-gray-50"
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>
            </>
          )}
          <div className="flex flex-col gap-2">
            {user ? (
              <>
                <Link
                  href="/settings"
                  className="block rounded-lg px-4 py-3 text-lg leading-7 font-semibold text-gray-900 hover:bg-gray-50"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Ustawienia konta
                </Link>
                <button
                  className="block w-full rounded-lg px-4 py-3 text-left text-lg leading-7 font-semibold text-gray-900 hover:bg-gray-50"
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
                  className="block w-full rounded-lg px-4 py-3 text-left text-lg leading-7 font-semibold text-gray-900 hover:bg-gray-50"
                >
                  Zaloguj się
                </button>
                <button
                  onClick={() => {
                    router.push("/register");
                    setIsMenuOpen(false);
                  }}
                  className="block w-full rounded-lg px-4 py-3 text-left text-lg leading-7 font-semibold text-gray-900 hover:bg-gray-50"
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

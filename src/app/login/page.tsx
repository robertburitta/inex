"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import AuthHeader from "@/components/AuthHeader";
import Loader from "@/components/Loader";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isResetting, setIsResetting] = useState(false);
  const { user, loading, signInWithGoogle, signInWithEmail, resetPassword, error, success } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      router.push("/dashboard");
    }
  }, [user, loading, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isResetting) {
      const success = await resetPassword(email);
      if (success) {
        setEmail("");
        setIsResetting(false);
      }
    } else {
      const success = await signInWithEmail(email, password);
      if (success) {
        setEmail("");
        setPassword("");
      }
    }
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="flex min-h-screen flex-col bg-gray-100">
      <AuthHeader />
      <div className="flex flex-grow flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">{isResetting ? "Zresetuj hasło" : "Zaloguj się"}</h2>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="border border-gray-200 bg-white px-4 py-8 shadow-xl sm:rounded-lg sm:px-10">
            {error && (
              <div
                className="relative mb-4 rounded border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600"
                role="alert"
              >
                <span className="block sm:inline">{error}</span>
              </div>
            )}

            {success && (
              <div
                className="relative mb-4 rounded border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-600"
                role="alert"
              >
                <span className="block sm:inline">{success}</span>
              </div>
            )}

            <form
              className="space-y-6"
              onSubmit={handleSubmit}
            >
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                >
                  Adres email
                </label>
                <div className="mt-1">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full appearance-none rounded-md border border-gray-300 bg-gray-50 px-3 py-2 text-gray-900 placeholder-gray-500 shadow-sm focus:border-blue-500 focus:ring-blue-500 focus:outline-none sm:text-sm"
                  />
                </div>
              </div>

              {!isResetting && (
                <div>
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Hasło
                  </label>
                  <div className="mt-1">
                    <input
                      id="password"
                      name="password"
                      type="password"
                      autoComplete="current-password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="block w-full appearance-none rounded-md border border-gray-300 bg-gray-50 px-3 py-2 text-gray-900 placeholder-gray-500 shadow-sm focus:border-blue-500 focus:ring-blue-500 focus:outline-none sm:text-sm"
                    />
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setIsResetting(!isResetting)}
                  className="text-sm text-blue-600 hover:text-blue-500"
                >
                  {isResetting ? "Wróć do logowania" : "Zapomniałeś hasła?"}
                </button>
              </div>

              <div>
                <button
                  type="submit"
                  className="flex w-full justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none"
                >
                  {isResetting ? "Wyślij link do resetowania" : "Zaloguj się"}
                </button>
              </div>
            </form>

            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="bg-white px-2 text-gray-500">Lub</span>
                </div>
              </div>

              <div className="mt-6">
                <button
                  onClick={signInWithGoogle}
                  className="flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none"
                >
                  <svg
                    className="mr-2 h-5 w-5"
                    viewBox="0 0 24 24"
                  >
                    <path
                      fill="currentColor"
                      d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z"
                    />
                  </svg>
                  Kontynuuj przez Google
                </button>
              </div>
            </div>

            <div className="mt-6">
              <Link
                href="/register"
                className="block w-full text-center text-sm text-gray-600 hover:text-gray-900"
              >
                Nie masz konta? Zarejestruj się
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

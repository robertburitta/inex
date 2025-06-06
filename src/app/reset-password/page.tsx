"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import AuthHeader from "@/components/AuthHeader";

export default function ResetPassword() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const { error, success, confirmResetPassword } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const oobCode = searchParams.get("oobCode");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError(null);

    if (password !== confirmPassword) {
      setPasswordError("Hasła nie są identyczne");
      return;
    }

    if (password.length < 6) {
      setPasswordError("Hasło musi mieć co najmniej 6 znaków");
      return;
    }

    const success = await confirmResetPassword(oobCode!, password);
    if (success) {
      setTimeout(() => {
        router.push("/login");
      }, 2000);
    }
  };

  if (!oobCode) {
    return (
      <div className="flex min-h-screen flex-col bg-gray-100">
        <AuthHeader />
        <div className="flex flex-grow flex-col justify-center py-12 sm:px-6 lg:px-8">
          <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
            <div className="border border-gray-200 bg-white px-4 py-8 shadow-xl sm:rounded-lg sm:px-10">
              <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <h2 className="text-center text-3xl font-extrabold text-gray-900">Nieprawidłowy link</h2>
                <p className="mt-2 text-center text-sm text-gray-600">Link do resetowania hasła jest nieprawidłowy lub wygasł.</p>
              </div>
              <div className="mt-8">
                <button
                  onClick={() => router.push("/login")}
                  className="flex w-full justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none"
                >
                  Wróć do logowania
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-gray-100">
      <AuthHeader />
      <div className="flex flex-grow flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Ustaw nowe hasło</h2>
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

            {passwordError && (
              <div
                className="relative mb-4 rounded border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600"
                role="alert"
              >
                <span className="block sm:inline">{passwordError}</span>
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
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700"
                >
                  Nowe hasło
                </label>
                <div className="mt-1">
                  <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full appearance-none rounded-md border border-gray-300 bg-gray-50 px-3 py-2 text-gray-900 placeholder-gray-500 shadow-sm focus:border-blue-500 focus:ring-blue-500 focus:outline-none sm:text-sm"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="confirm-password"
                  className="block text-sm font-medium text-gray-700"
                >
                  Potwierdź hasło
                </label>
                <div className="mt-1">
                  <input
                    id="confirm-password"
                    name="confirm-password"
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="block w-full appearance-none rounded-md border border-gray-300 bg-gray-50 px-3 py-2 text-gray-900 placeholder-gray-500 shadow-sm focus:border-blue-500 focus:ring-blue-500 focus:outline-none sm:text-sm"
                  />
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  className="flex w-full justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none"
                >
                  Ustaw nowe hasło
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import AuthHeader from "@/components/AuthHeader";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <AuthHeader />
      <div className="flex-grow flex flex-col justify-center items-center py-12 px-4 sm:px-6 lg:px-8">
        <h1 className="text-6xl font-extrabold text-blue-600 mb-4">404</h1>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Ups! Ta strona się zgubiła
        </h2>
        <p className="text-gray-500 mb-6 text-center max-w-lg">
          Strona, której szukasz, nie istnieje lub została przeniesiona.
          <br />
          Sprawdź adres lub wróć na stronę główną.
        </p>
        <Link
          href="/"
          className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg font-medium shadow hover:bg-blue-700 transition-colors"
        >
          Wróć na stronę główną
        </Link>
      </div>
    </div>
  );
}

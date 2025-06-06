"use client";

import Link from "next/link";
import AuthHeader from "@/components/AuthHeader";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col bg-gray-100">
      <AuthHeader />
      <div className="flex flex-grow flex-col items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
        <h1 className="mb-4 text-6xl font-extrabold text-blue-600">404</h1>
        <h2 className="mb-2 text-2xl font-bold text-gray-900">Ups! Ta strona się zgubiła</h2>
        <p className="mb-6 max-w-lg text-center text-gray-500">
          Strona, której szukasz, nie istnieje lub została przeniesiona.
          <br />
          Sprawdź adres lub wróć na stronę główną.
        </p>
        <Link
          href="/"
          className="inline-block rounded-lg bg-blue-600 px-6 py-3 font-medium text-white shadow transition-colors hover:bg-blue-700"
        >
          Wróć na stronę główną
        </Link>
      </div>
    </div>
  );
}

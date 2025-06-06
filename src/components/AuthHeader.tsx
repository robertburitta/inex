"use client";

import Link from "next/link";

export default function AuthHeader() {
  return (
    <header className="sticky top-0 z-30 w-full bg-white/90 shadow-sm backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="text-2xl font-bold text-gray-900 transition-colors hover:text-gray-800"
        >
          InEx
        </Link>
      </div>
    </header>
  );
}

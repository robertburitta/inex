"use client";

import Link from "next/link";

export default function AuthHeader() {
  return (
    <header className="bg-white/90 shadow-sm sticky top-0 z-30 backdrop-blur w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center">
        <Link
          href="/"
          className="text-2xl font-bold text-gray-900 hover:text-gray-800 transition-colors"
        >
          InEx
        </Link>
      </div>
    </header>
  );
}

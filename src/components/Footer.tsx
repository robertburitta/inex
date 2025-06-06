"use client";

export default function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-white">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <p className="text-center text-sm text-gray-500">© {new Date().getFullYear()} Robert Buritta</p>
      </div>
    </footer>
  );
}

"use client";

import React from "react";

export default function Loader({ text = "Ładowanie..." }: { text?: string }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[200px]">
      <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
      <span className="text-gray-600 text-lg">{text}</span>
    </div>
  );
}

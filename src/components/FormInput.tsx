"use client";

import React from "react";

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  className?: string;
}

export default function FormInput({
  label,
  error,
  className = "",
  ...props
}: FormInputProps) {
  return (
    <div className={className}>
      <label
        htmlFor={props.id}
        className="block text-sm font-medium text-gray-700"
      >
        {label}
      </label>
      <div className="mt-1">
        {props.type === "color" ? (
          <div className="relative w-full h-11 flex items-center border border-gray-300 rounded-md bg-gray-50 px-3 py-2 shadow-sm">
            <span
              className="inline-block w-full h-7 rounded-md border border-gray-200"
              style={{ backgroundColor: props.value as string }}
            />
            <input
              {...props}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
          </div>
        ) : (
          <input
            {...props}
            className={`appearance-none block w-full px-3 py-2 border ${
              error ? "border-red-400" : "border-gray-300"
            } rounded-md shadow-sm placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-gray-50`}
          />
        )}
      </div>
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
}

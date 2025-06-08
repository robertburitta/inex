"use client";

import React from "react";

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeHolder?: React.ReactNode;
  error?: string;
  className?: string;
}

export default function FormInput({ label, onChange, placeHolder, error, className = "", required = false, ...props }: FormInputProps) {
  return (
    <div className={className}>
      <label
        htmlFor={props.id}
        className="block text-sm font-medium text-gray-700"
      >
        {label}
        {required && <span className="ml-1 text-red-500">*</span>}
      </label>
      <div className="relative mt-1">
        {props.type === "color" ? (
          <div className="relative flex w-full items-center rounded-md border border-gray-300 bg-gray-50 px-3 py-2 shadow-sm">
            <span
              className="inline-block h-5 w-full rounded-md border border-gray-200"
              style={{ backgroundColor: props.value as string }}
            />
            <input
              {...props}
              className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
            />
          </div>
        ) : (
          <>
            {placeHolder && props.value === "" && (
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-sm text-gray-400">
                {placeHolder}
              </div>
            )}
            <input
              {...props}
              onChange={onChange}
              className={`block w-full appearance-none border px-3 py-2 ${
                error ? "border-red-400" : "border-gray-300"
              } rounded-md bg-gray-50 text-gray-900 placeholder-gray-500 shadow-sm focus:border-blue-500 focus:ring-blue-500 focus:outline-none sm:text-sm`}
            />
          </>
        )}
      </div>
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
}

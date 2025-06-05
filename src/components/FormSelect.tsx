import React from "react";

interface FormSelectProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  id: string;
  children: React.ReactNode;
}

const FormSelect: React.FC<FormSelectProps> = ({
  label,
  id,
  children,
  required = false,
  ...props
}) => (
  <div>
    <label
      htmlFor={id}
      className="block text-sm font-medium text-gray-700 mb-1"
    >
      {label}
      {required && <span className="text-red-500 ml-1">*</span>}
    </label>
    <div className="relative">
      <select
        id={id}
        className="appearance-none mt-1 block w-full pl-3 pr-10 py-2 rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:outline-none sm:text-sm bg-gray-50 transition"
        {...props}
      >
        {children}
      </select>
      <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 flex items-center text-gray-400">
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </div>
    </div>
  </div>
);

export default FormSelect;

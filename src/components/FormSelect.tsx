import React from "react";

interface FormSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  id: string;
  children: React.ReactNode;
}

const FormSelect: React.FC<FormSelectProps> = ({ label, id, children, required = false, ...props }) => (
  <div>
    <label
      htmlFor={id}
      className="mb-1 block text-sm font-medium text-gray-700"
    >
      {label}
      {required && <span className="ml-1 text-red-500">*</span>}
    </label>
    <div className="relative">
      <select
        id={id}
        className="mt-1 block w-full appearance-none rounded-md border border-gray-300 bg-gray-50 py-2 pr-10 pl-3 shadow-sm transition focus:border-blue-500 focus:outline-none sm:text-sm"
        {...props}
      >
        {children}
      </select>
      <div className="pointer-events-none absolute top-1/2 right-3 flex -translate-y-1/2 items-center text-gray-400">
        <svg
          className="h-5 w-5"
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

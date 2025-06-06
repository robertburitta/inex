import React, { useEffect, useRef, useState } from "react";
import * as Icons from "@heroicons/react/24/outline";

interface FormIconSelectProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  className?: string;
}

const AVAILABLE_ICONS = Object.entries(Icons).map(([key, Icon]) => ({
  name: key.replace(/Icon$/, ""),
  icon: Icon,
}));

const FormIconSelect: React.FC<FormIconSelectProps> = ({ label, value, onChange, required = false, className = "" }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearchQuery("");
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const selectedIcon = AVAILABLE_ICONS.find((icon) => icon.name === value) || AVAILABLE_ICONS[0];

  const filteredIcons = AVAILABLE_ICONS.filter((icon) => icon.name.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div
      className={`relative ${className}`}
      ref={dropdownRef}
    >
      <label className="block text-sm font-medium text-gray-700">
        {label}
        {required && <span className="ml-1 text-red-500">*</span>}
      </label>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="mt-1 flex w-full items-center justify-between rounded-md border border-gray-300 bg-gray-50 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:ring-blue-500 focus:outline-none"
      >
        <div className="flex items-center">
          <selectedIcon.icon className="mr-2 h-5 w-5 text-gray-600" />
          <span className="text-gray-900">{selectedIcon.name}</span>
        </div>
        <Icons.ChevronDownIcon className="h-5 w-5 text-gray-400" />
      </button>

      {isOpen && (
        <div className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md border border-gray-200 bg-white shadow-lg">
          <div className="border-b border-gray-200 p-2">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Wyszukaj ikonę..."
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-blue-500 focus:outline-none"
            />
          </div>
          <div className="grid grid-cols-7 gap-2 p-2">
            {filteredIcons.map(({ name, icon: Icon }) => (
              <button
                key={name}
                type="button"
                onClick={() => {
                  onChange(name);
                  setIsOpen(false);
                  setSearchQuery("");
                }}
                className={`flex items-center justify-center rounded-lg border p-2 ${
                  value === name ? "border-blue-500 bg-blue-50" : "border-gray-200 hover:border-gray-300"
                }`}
                title={name}
              >
                <Icon className="h-6 w-6 text-gray-600" />
              </button>
            ))}
            {filteredIcons.length === 0 && <span className="p-2 text-sm text-nowrap text-gray-500">Brak wyników</span>}
          </div>
        </div>
      )}
    </div>
  );
};

export default FormIconSelect;

import React, { useState, useRef, useEffect } from "react";
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

const FormIconSelect: React.FC<FormIconSelectProps> = ({
  label,
  value,
  onChange,
  required = false,
  className = "",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setSearchQuery("");
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const selectedIcon =
    AVAILABLE_ICONS.find((icon) => icon.name === value) || AVAILABLE_ICONS[0];

  const filteredIcons = AVAILABLE_ICONS.filter((icon) =>
    icon.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <label className="block text-sm font-medium text-gray-700">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between mt-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-50 text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
      >
        <div className="flex items-center">
          <selectedIcon.icon className="h-5 w-5 text-gray-600 mr-2" />
          <span className="text-gray-900">{selectedIcon.name}</span>
        </div>
        <Icons.ChevronDownIcon className="h-5 w-5 text-gray-400" />
      </button>

      {isOpen && (
        <div className="absolute z-10 mt-1 w-full bg-white shadow-lg rounded-md border border-gray-200 max-h-60 overflow-auto">
          <div className="p-2 border-b border-gray-200">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Wyszukaj ikonę..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
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
                className={`flex items-center justify-center p-2 rounded-lg border ${
                  value === name
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
                title={name}
              >
                <Icon className="h-6 w-6 text-gray-600" />
              </button>
            ))}
            {filteredIcons.length === 0 && (
              <span className="p-2 text-gray-500 text-sm text-nowrap">
                Brak wyników
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default FormIconSelect;

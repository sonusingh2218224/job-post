"use client"

import { useState, useRef, useEffect } from "react"
import { ChevronDownIcon, CheckIcon } from "@heroicons/react/24/outline"

interface Option {
  value: string
  label: string
  count?: number
}

interface CustomSelectProps {
  options: Option[]
  value: string
  onChange: (value: string) => void
  placeholder?: string
  name?: string
}

export const CustomSelect = ({
  options,
  value,
  onChange,
  placeholder = "Select an option",
  name,
}: CustomSelectProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const selectedOption = options.find((option) => option.value === value)

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="mt-1 w-full rounded-md p-2 border border-[#D0D5DD] bg-white text-left focus:border-[#5937B7] focus:ring-1 focus:ring-[#5937B7] focus:outline-none flex items-center justify-between"
      >
        <span className={selectedOption ? "text-gray-900" : "text-gray-500"}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronDownIcon
          className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {isOpen && (
        <div className="absolute z-50 mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-auto">
          {!value && (
            <div className="px-4 py-3 text-gray-400 cursor-not-allowed border-b border-gray-100">{placeholder}</div>
          )}
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => {
                onChange(option.value)
                setIsOpen(false)
              }}
              className={`w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center justify-between ${
                value === option.value ? "bg-[#F3F0FF] text-[#5937B7]" : "text-gray-900"
              }`}
            >
              <span className="flex items-center gap-2">
                {option.label}
                {option.count && <span className="text-gray-500">({option.count})</span>}
              </span>
              {value === option.value && <CheckIcon className="w-5 h-5 text-[#5937B7]" />}
            </button>
          ))}
        </div>
      )}

      {/* Hidden input for form compatibility */}
      <input type="hidden" name={name} value={value} />
    </div>
  )
}

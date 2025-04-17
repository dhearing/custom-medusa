"use client"

import React from "react"
import { useFormStatus } from "react-dom"

export function SubmitButton({
  children,
  variant = "primary",
  className,
  "data-testid": dataTestId,
}: {
  children: React.ReactNode
  variant?: "primary" | "secondary" | "transparent" | "danger" | null
  className?: string
  "data-testid"?: string
}) {
  const { pending } = useFormStatus()
  
  const getVariantClasses = () => {
    switch(variant) {
      case "primary": return "bg-blue-600 hover:bg-blue-700 text-white";
      case "secondary": return "bg-gray-200 hover:bg-gray-300 text-gray-800";
      case "danger": return "bg-red-600 hover:bg-red-700 text-white";
      case "transparent": return "bg-transparent hover:bg-gray-100";
      default: return "bg-blue-600 hover:bg-blue-700 text-white";
    }
  }

  return (
    <button
      type="submit"
      className={`px-4 py-2 rounded-md transition-colors ${getVariantClasses()} ${className || ""}`}
      disabled={pending}
      data-testid={dataTestId}
    >
      {pending ? (
        <span className="flex items-center justify-center">
          <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Loading...
        </span>
      ) : (
        children
      )}
    </button>
  )
}

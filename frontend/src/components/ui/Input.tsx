import type { InputHTMLAttributes } from 'react'

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label?: string
}

export const Input = ({ label, className = '', ...props }: InputProps) => {
  return (
    <label className="flex flex-col gap-1 text-sm text-gray-700 dark:text-gray-200">
      {label && <span>{label}</span>}
      <input
        className={`rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm outline-none ring-offset-2 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 ${className}`}
        {...props}
      />
    </label>
  )
}


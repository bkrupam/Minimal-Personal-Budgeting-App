import React, { forwardRef } from 'react';
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  prefix?: string;
}
export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, prefix, className = '', ...props }, ref) => {
    return (
      <div className="w-full">
        {label &&
        <label className="block text-sm font-medium text-[#1C1C1C]/70 mb-1.5">
            {label}
          </label>
        }

        <div
          className={`
          relative flex items-center
          border-b-2 border-[#1C1C1C]/10 
          transition-colors
          focus-within:border-[#6B8F71]
          ${error ? 'border-[#C75C5C] focus-within:border-[#C75C5C]' : ''}
          ${className}
        `}>

          {prefix &&
          <span className="text-[#1C1C1C]/40 select-none mr-1 whitespace-nowrap">
              {prefix}
            </span>
          }

          <input
            ref={ref}
            className={`
              block w-full bg-transparent border-none p-0
              text-[#1C1C1C] placeholder-[#1C1C1C]/30
              focus:ring-0 focus:outline-none
              disabled:opacity-50 disabled:cursor-not-allowed
            `}
            {...props} />

        </div>

        {error && <p className="mt-1 text-sm text-[#C75C5C]">{error}</p>}
        {helperText && !error &&
        <p className="mt-1 text-sm text-[#1C1C1C]/50">{helperText}</p>
        }
      </div>);

  }
);
Input.displayName = 'Input';
import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
interface ButtonProps extends HTMLMotionProps<'button'> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  children: React.ReactNode;
}
export function Button({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  children,
  className = '',
  disabled,
  ...props
}: ButtonProps) {
  const baseStyles =
  'inline-flex items-center justify-center rounded-xl font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';
  const variants = {
    primary: 'bg-[#6B8F71] text-white hover:bg-[#5A7A5E] focus:ring-[#6B8F71]',
    secondary:
    'bg-transparent border-2 border-[#1C1C1C]/10 text-[#1C1C1C] hover:bg-[#1C1C1C]/5 focus:ring-[#1C1C1C]',
    danger: 'bg-[#C75C5C] text-white hover:bg-[#B04B4B] focus:ring-[#C75C5C]',
    ghost:
    'bg-transparent text-[#1C1C1C] hover:bg-[#1C1C1C]/5 focus:ring-[#1C1C1C]'
  };
  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2.5 text-base',
    lg: 'px-6 py-3.5 text-lg'
  };
  const widthClass = fullWidth ? 'w-full' : '';
  return (
    <motion.button
      whileTap={
      disabled ?
      undefined :
      {
        scale: 0.98
      }
      }
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${widthClass} ${className}`}
      disabled={disabled}
      {...props}>

      {children}
    </motion.button>);

}
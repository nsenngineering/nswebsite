import React from 'react';
import { cn } from '@/lib/utils';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'purple';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', children, ...props }, ref) => {
    const baseStyles = 'inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';

    const variants = {
      primary: 'bg-white text-primary-700 hover:bg-gray-50 hover:shadow-lg focus:ring-white shadow-md',
      secondary: 'bg-secondary-400 text-gray-900 hover:bg-secondary-500 hover:shadow-lg focus:ring-secondary-400 shadow-md font-semibold',
      outline: 'border-2 border-white text-white hover:bg-white/10 focus:ring-white backdrop-blur-sm',
      ghost: 'text-white hover:bg-white/10 focus:ring-white',
      purple: 'bg-primary-600 text-white hover:bg-primary-700 hover:shadow-lg focus:ring-primary-500 shadow-md',
    };

    const sizes = {
      sm: 'px-4 py-2 text-sm',
      md: 'px-6 py-3 text-base',
      lg: 'px-8 py-4 text-lg',
    };

    return (
      <button
        ref={ref}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';

export default Button;

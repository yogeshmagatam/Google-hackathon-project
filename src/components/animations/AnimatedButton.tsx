'use client';

import { motion, MotionProps } from 'framer-motion';
import { ReactNode, forwardRef } from 'react';

interface AnimatedButtonProps extends Omit<MotionProps, 'children'> {
  children: ReactNode;
  variant?: 'default' | 'primary' | 'secondary' | 'ghost' | 'destructive';
  size?: 'sm' | 'md' | 'lg';
  animation?: 'scale' | 'bounce' | 'glow' | 'slide' | 'rotate';
  disabled?: boolean;
  className?: string;
  onClick?: () => void;
}

const variantClasses = {
  default: 'bg-white hover:bg-gray-50 border border-gray-200 text-gray-900',
  primary: 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg',
  secondary: 'bg-gray-100 hover:bg-gray-200 text-gray-900',
  ghost: 'hover:bg-gray-100 text-gray-700 border-transparent',
  destructive: 'bg-red-600 hover:bg-red-700 text-white'
};

const sizeClasses = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-base',
  lg: 'px-6 py-3 text-lg'
};

const animations = {
  scale: {
    whileHover: { scale: 1.05 },
    whileTap: { scale: 0.95 }
  },
  bounce: {
    whileHover: { 
      scale: 1.05,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 10
      }
    },
    whileTap: { 
      scale: 0.95,
      transition: {
        type: "spring",
        stiffness: 600,
        damping: 15
      }
    }
  },
  glow: {
    whileHover: { 
      boxShadow: "0 0 20px rgba(59, 130, 246, 0.5)",
      scale: 1.02
    },
    whileTap: { scale: 0.98 }
  },
  slide: {
    whileHover: { x: 5 },
    whileTap: { x: 0 }
  },
  rotate: {
    whileHover: { rotate: 5 },
    whileTap: { rotate: 0 }
  }
};

export const AnimatedButton = forwardRef<HTMLButtonElement, AnimatedButtonProps>(
  ({ 
    children, 
    variant = 'default', 
    size = 'md', 
    animation = 'scale',
    disabled = false,
    className = '',
    onClick,
    ...props 
  }, ref) => {
    const animationProps = animations[animation];
    
    return (
      <motion.button
        ref={ref}
        className={`
          inline-flex items-center justify-center gap-2 
          rounded-lg font-medium transition-colors
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
          disabled:opacity-50 disabled:cursor-not-allowed
          ${variantClasses[variant]}
          ${sizeClasses[size]}
          ${className}
        `}
        disabled={disabled}
        onClick={onClick}
        {...animationProps}
        {...props}
      >
        {children}
      </motion.button>
    );
  }
);

AnimatedButton.displayName = 'AnimatedButton';
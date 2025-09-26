'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface StaggeredGridProps {
  children: ReactNode;
  className?: string;
  stagger?: number;
  columns?: 1 | 2 | 3 | 4 | 5 | 6;
  animation?: 'slideUp' | 'fadeIn' | 'scale' | 'slideLeft';
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  slideUp: {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 20
      }
    }
  },
  fadeIn: {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: {
        duration: 0.4
      }
    }
  },
  scale: {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 20
      }
    }
  },
  slideLeft: {
    hidden: { opacity: 0, x: -20 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 20
      }
    }
  }
};

const gridClasses = {
  1: 'grid-cols-1',
  2: 'grid-cols-1 md:grid-cols-2',
  3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
  4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
  5: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-5',
  6: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-6'
};

export function StaggeredGrid({
  children,
  className = '',
  stagger = 0.1,
  columns = 3,
  animation = 'slideUp'
}: StaggeredGridProps) {
  const customContainerVariants = {
    ...containerVariants,
    visible: {
      ...containerVariants.visible,
      transition: {
        ...containerVariants.visible.transition,
        staggerChildren: stagger
      }
    }
  };

  return (
    <motion.div
      className={`grid gap-4 ${gridClasses[columns]} ${className}`}
      variants={customContainerVariants}
      initial="hidden"
      animate="visible"
    >
      {Array.isArray(children) ? 
        children.map((child, index) => (
          <motion.div
            key={index}
            variants={itemVariants[animation]}
          >
            {child}
          </motion.div>
        )) :
        <motion.div variants={itemVariants[animation]}>
          {children}
        </motion.div>
      }
    </motion.div>
  );
}

interface StaggeredListProps {
  children: ReactNode;
  className?: string;
  stagger?: number;
  animation?: 'slideUp' | 'fadeIn' | 'scale' | 'slideLeft';
}

export function StaggeredList({
  children,
  className = '',
  stagger = 0.1,
  animation = 'slideUp'
}: StaggeredListProps) {
  const customContainerVariants = {
    ...containerVariants,
    visible: {
      ...containerVariants.visible,
      transition: {
        ...containerVariants.visible.transition,
        staggerChildren: stagger
      }
    }
  };

  return (
    <motion.div
      className={`space-y-4 ${className}`}
      variants={customContainerVariants}
      initial="hidden"
      animate="visible"
    >
      {Array.isArray(children) ? 
        children.map((child, index) => (
          <motion.div
            key={index}
            variants={itemVariants[animation]}
          >
            {child}
          </motion.div>
        )) :
        <motion.div variants={itemVariants[animation]}>
          {children}
        </motion.div>
      }
    </motion.div>
  );
}
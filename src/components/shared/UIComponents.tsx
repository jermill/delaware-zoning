import { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  elevated?: boolean;
  interactive?: boolean;
}

export function Card({ children, className = '', hover = false, elevated = false, interactive = false }: CardProps) {
  const baseClasses = 'bg-white rounded-2xl border border-delaware-sage/20 transition-all duration-300';
  const variantClasses = interactive 
    ? 'shadow-md hover:shadow-xl hover:-translate-y-1 cursor-pointer' 
    : hover 
    ? 'shadow-md p-6 sm:p-8 hover:shadow-xl hover:-translate-y-1' 
    : elevated 
    ? 'shadow-lg p-6 sm:p-8' 
    : 'shadow-subtle p-6';
  
  return (
    <div className={`${baseClasses} ${variantClasses} ${className}`}>
      {children}
    </div>
  );
}

interface SectionProps {
  children: ReactNode;
  className?: string;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
  bg?: 'cream' | 'white' | 'navy' | 'sage';
}

export function Section({ children, className = '', maxWidth = 'xl', bg = 'white' }: SectionProps) {
  const maxWidthClasses = {
    'sm': 'max-w-4xl',
    'md': 'max-w-5xl',
    'lg': 'max-w-6xl',
    'xl': 'max-w-7xl',
    '2xl': 'max-w-8xl',
    'full': 'max-w-full',
  };
  
  const bgClasses = {
    'cream': 'bg-delaware-cream',
    'white': 'bg-white',
    'navy': 'bg-delaware-navy',
    'sage': 'bg-delaware-sage',
  };
  
  return (
    <section className={`${bgClasses[bg]} py-16 sm:py-20 lg:py-24`}>
      <div className={`${maxWidthClasses[maxWidth]} mx-auto px-4 sm:px-6 lg:px-8 ${className}`}>
        {children}
      </div>
    </section>
  );
}

interface IconContainerProps {
  children: ReactNode;
  size?: 'sm' | 'md' | 'lg';
  color?: 'blue' | 'gold' | 'sage' | 'navy' | 'cream';
  className?: string;
}

export function IconContainer({ children, size = 'md', color = 'blue', className = '' }: IconContainerProps) {
  const sizeClasses = {
    'sm': 'w-10 h-10',
    'md': 'w-14 h-14',
    'lg': 'w-16 h-16 sm:w-20 sm:h-20',
  };
  
  const colorClasses = {
    'blue': 'bg-delaware-blue',
    'gold': 'bg-delaware-gold',
    'sage': 'bg-delaware-sage',
    'navy': 'bg-delaware-navy',
    'cream': 'bg-delaware-cream',
  };
  
  return (
    <div className={`${sizeClasses[size]} ${colorClasses[color]} rounded-xl shadow-md flex items-center justify-center transition-all duration-300 ${className}`}>
      {children}
    </div>
  );
}


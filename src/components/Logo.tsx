import React from 'react';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'default' | 'white';
  hideText?: boolean;
}

export default function Logo({ className = '', size = 'md', variant = 'default', hideText = false }: LogoProps) {
  const sizeClasses = {
    sm: 'text-xl',
    md: 'text-2xl',
    lg: 'text-4xl',
    xl: 'text-6xl',
  };

  const colors = variant === 'white' 
    ? { o: '#FFFFFF', a: '#FFFFFF', i: '#FFFFFF', c1: '#FFFFFF', c2: '#FFFFFF' }
    : { o: '#001F5B', a: '#00ADEF', i: '#FF3B00', c1: '#FF6A00', c2: '#FFB400' };

  return (
    <div className={`font-display font-black tracking-tighter flex items-center ${sizeClasses[size]} ${className}`}>
      <span style={{ color: colors.o }}>o</span>
      <span style={{ color: colors.a }}>a</span>
      <span style={{ color: colors.i }} className="relative">
        i
        <span className="absolute -top-[0.15em] left-1/2 -translate-x-1/2 w-[0.2em] h-[0.2em] rounded-full" style={{ backgroundColor: colors.i }}></span>
      </span>
      {!hideText && (
        <>
          <span style={{ color: colors.c1 }}>c</span>
          <span style={{ color: colors.c2 }}>c</span>
        </>
      )}
    </div>
  );
}

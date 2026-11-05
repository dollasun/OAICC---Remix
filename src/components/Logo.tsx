import React from 'react';
import logoUrl from '../assets/logo/oaicc-logo-green.svg';
import markUrl from '../assets/logo/oaicc-mark.png';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  /** `white` renders a single-colour white version for use on coloured backgrounds. */
  variant?: 'default' | 'white';
  /** Shows only the turtle mark (used by collapsed sidebars). */
  hideText?: boolean;
}

const HEIGHT = { sm: 'h-7', md: 'h-9', lg: 'h-12', xl: 'h-20' } as const;

/** The OAICC logo ("OAICC logo green": wordmark + turtle mascot). */
export default function Logo({ className = '', size = 'md', variant = 'default', hideText = false }: LogoProps) {
  // The navy "o" is hard to see on dark surfaces, so give the default logo a soft light halo in dark mode.
  const tone = variant === 'white' ? 'brightness-0 invert' : 'dark:drop-shadow-[0_0_6px_rgba(255,255,255,0.35)]';
  return (
    <div className={`flex items-center ${className}`}>
      <img
        src={hideText ? markUrl : logoUrl}
        alt="OAICC"
        draggable={false}
        className={`${HEIGHT[size]} w-auto max-w-full select-none object-contain ${tone}`}
      />
    </div>
  );
}

'use client'

import { motion } from 'framer-motion'

interface IconProps {
  type: string
  className?: string
  animate?: boolean
}

export default function Icon({ type, className = "w-6 h-6", animate = true }: IconProps) {
  const iconPaths: Record<string, JSX.Element> = {
    // Brain/AI Icon
    brain: (
      <g>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
      </g>
    ),
    
    // Target/Goal Icon
    target: (
      <g>
        <circle cx="12" cy="12" r="10" strokeWidth={2} fill="none" />
        <circle cx="12" cy="12" r="6" strokeWidth={2} fill="none" />
        <circle cx="12" cy="12" r="2" fill="currentColor" />
      </g>
    ),
    
    // Lock/Privacy Icon
    lock: (
      <g>
        <rect x="5" y="11" width="14" height="10" rx="2" strokeWidth={2} fill="none" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11V7a5 5 0 0110 0v4" />
        <circle cx="12" cy="16" r="1" fill="currentColor" />
      </g>
    ),
    
    // Microphone/Voice Icon
    microphone: (
      <g>
        <rect x="9" y="2" width="6" height="11" rx="3" strokeWidth={2} fill="none" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10a7 7 0 0014 0M12 17v4m-4 0h8" />
      </g>
    ),
    
    // Chart/Analytics Icon
    chart: (
      <g>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </g>
    ),
    
    // Star/Quality Icon
    star: (
      <g>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" fill="currentColor" />
      </g>
    ),
    
    // Meditation/Wellness Icon
    meditation: (
      <g>
        <circle cx="12" cy="7" r="3" strokeWidth={2} fill="none" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10c-3 0-5 2-5 5v6h10v-6c0-3-2-5-5-5z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 15c-1-1-2-1-3 0M17 15c1-1 2-1 3 0" />
      </g>
    ),
    
    // User Female Icon
    userFemale: (
      <g>
        <circle cx="12" cy="8" r="4" strokeWidth={2} fill="none" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 21v-2a4 4 0 014-4h4a4 4 0 014 4v2" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 6c.5-1 1-1.5 2-1.5s1.5.5 2 1.5M14 6c.5-1 1-1.5 2-1.5" />
      </g>
    ),
    
    // User Male Icon
    userMale: (
      <g>
        <circle cx="12" cy="8" r="4" strokeWidth={2} fill="none" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 21v-2a4 4 0 014-4h4a4 4 0 014 4v2" />
        <rect x="10" y="6" width="4" height="2" rx="1" fill="currentColor" />
      </g>
    ),
    
    // Professional Icon
    professional: (
      <g>
        <circle cx="12" cy="8" r="4" strokeWidth={2} fill="none" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 21v-2a4 4 0 014-4h4a4 4 0 014 4v2" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 2h8v4H8z" />
        <rect x="9" y="5" width="6" height="2" rx="0.5" fill="currentColor" />
      </g>
    ),
    
    // Sparkle/Premium Icon
    sparkle: (
      <g>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 2l1.5 4.5L18 8l-4.5 1.5L12 14l-1.5-4.5L6 8l4.5-1.5L12 2z" fill="currentColor" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 14l1 2.5L22 17l-2 .5-1 2.5-1-2.5-2-.5 2-.5 1-2.5zM5 16l.5 1.5L7 18l-1.5.5L5 20l-.5-1.5L3 18l1.5-.5L5 16z" fill="currentColor" />
      </g>
    ),
    
    // Check/Success Icon
    check: (
      <g>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
      </g>
    ),
    
    // Shield/Security Icon
    shield: (
      <g>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 2l-8 3v7c0 5 3 9 8 11 5-2 8-6 8-11V5l-8-3z" fill="none" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4" />
      </g>
    ),
    
    // Heart/Care Icon
    heart: (
      <g>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" fill="currentColor" />
      </g>
    ),
    
    // Message/Chat Icon
    message: (
      <g>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" fill="none" />
        <line x1="8" y1="10" x2="16" y2="10" strokeWidth={2} strokeLinecap="round" />
        <line x1="8" y1="14" x2="13" y2="14" strokeWidth={2} strokeLinecap="round" />
      </g>
    ),
    
    // Email Icon
    email: (
      <g>
        <rect x="2" y="4" width="20" height="16" rx="2" strokeWidth={2} fill="none" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2 6l10 7 10-7" />
      </g>
    ),
    
    // Help/Support Icon
    help: (
      <g>
        <circle cx="12" cy="12" r="10" strokeWidth={2} fill="none" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3" />
        <circle cx="12" cy="17" r="1" fill="currentColor" />
      </g>
    ),
    
    // Award/Badge Icon
    award: (
      <g>
        <circle cx="12" cy="8" r="6" strokeWidth={2} fill="none" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.5 14l1.5 6-5-2-5 2 1.5-6" />
        <circle cx="12" cy="8" r="2" fill="currentColor" />
      </g>
    ),
    
    // Clock/24-7 Icon
    clock: (
      <g>
        <circle cx="12" cy="12" r="10" strokeWidth={2} fill="none" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6l4 2" />
      </g>
    )
  }

  const MotionSVG = motion.svg

  return (
    <MotionSVG
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      className={className}
      whileHover={animate ? { scale: 1.1, rotate: 5 } : {}}
      transition={{ type: "spring", stiffness: 300 }}
    >
      {iconPaths[type] || iconPaths.star}
    </MotionSVG>
  )
}

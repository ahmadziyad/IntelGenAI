// Modern Minimalistic Dark Theme System - Inspired by uxdesignerstockholm.se
export const aiTheme = {
  // Refined gradients - more subtle, less neon
  gradients: {
    primary: 'linear-gradient(135deg, #FFFFFF 0%, #D1D5DB 100%)', // White to Gray 300
    secondary: 'linear-gradient(135deg, #1F2937 0%, #111827 100%)', // Slate 800 to 950
    accent: 'linear-gradient(135deg, #F9FAFB 0%, #E5E7EB 100%)', // Gray 50 to 200
    neural: 'linear-gradient(135deg, #E5E7EB 0%, #9CA3AF 100%)', // Gray 200 to 400
    quantum: 'linear-gradient(135deg, #FFFFFF 0%, #F3F4F6 100%)',
    cyber: 'linear-gradient(135deg, #F9FAFB 0%, #D1D5DB 100%)',
    darkMesh: 'radial-gradient(at 0% 0%, hsla(0,0%,5%,1) 0, transparent 50%), radial-gradient(at 50% 0%, hsla(0,0%,8%,1) 0, transparent 50%), radial-gradient(at 100% 0%, hsla(0,0%,0%,1) 0, transparent 50%)',
  },

  // High-contrast monochromatic color palette
  colors: {
    // Base colors - Extreme dark (uxdesignerstockholm.se background)
    background: '#0D0D0D',
    surface: '#171717',
    surfaceHighlight: '#262626',

    // Text colors - High contrast white and subtle greys
    text: '#FFFFFF',
    textSecondary: '#A3A3A3', // Neutral 400
    textMuted: '#525252',  // Neutral 600

    // Minimalistic accent colors
    aiBlue: '#FFFFFF',
    aiPurple: '#E5E7EB',
    aiCyan: '#D1D5DB',
    aiGreen: '#F9FAFB',
    aiPink: '#FFFFFF',
    aiOrange: '#A3A3A3',

    // Status colors
    success: '#FFFFFF',
    warning: '#D1D5DB',
    error: '#FFFFFF',
    info: '#E5E7EB',
  },

  // Minimalist glass effects - subtle borders, less blur
  glass: {
    light: 'rgba(255, 255, 255, 0.03)',
    medium: 'rgba(255, 255, 255, 0.05)',
    heavy: 'rgba(0, 0, 0, 0.8)',
    blur: 'blur(12px)',
    border: 'rgba(255, 255, 255, 0.1)',
  },

  // Refined, more subtle shadows
  shadows: {
    glow: '0 0 15px rgba(255, 255, 255, 0.1)',
    aiGlow: '0 0 20px rgba(255, 255, 255, 0.15)',
    neon: '0 0 5px rgba(255, 255, 255, 0.2)',
    elevation: '0 10px 30px -10px rgba(0, 0, 0, 0.7)',
    floating: '0 20px 40px -10px rgba(0, 0, 0, 0.8)',
  },

  // Smooth animation configurations
  animations: {
    duration: {
      fast: '0.15s',
      normal: '0.35s',
      slow: '0.6s',
    },
    easing: {
      smooth: 'cubic-bezier(0.16, 1, 0.3, 1)', // Quintic out for premium feel
      bounce: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
    },
  },

  // Spacing system
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
    xxl: '3rem',
  },

  // Sharp border radius for a more professional look
  borderRadius: {
    sm: '0.25rem',
    md: '0.5rem',
    lg: '0.75rem',
    xl: '1rem',
    full: '9999px',
  },

  // Typography - Manrope/Inter as used on the reference site
  typography: {
    fontFamily: {
      primary: '"Manrope", "Inter", -apple-system, sans-serif',
      mono: '"Fira Code", monospace',
    },
    fontWeight: {
      light: 300,
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
    },
  },
};

export default aiTheme;

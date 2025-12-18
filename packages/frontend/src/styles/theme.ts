// Modern design system theme configuration
import { ProfileStyling } from '../types/profile';

// Modern design system theme configuration - Inspired by uxdesignerstockholm.se
export const defaultTheme: ProfileStyling = {
  colors: {
    primary: '#FFFFFF', // Clean white
    secondary: '#A3A3A3', // Neutral gray
    accent: '#525252', // Darker gray
    background: '#171717', // Neutral 900 surface
    text: '#FFFFFF',
    textSecondary: '#A3A3A3',
  },
  gradients: {
    primary: 'linear-gradient(135deg, #FFFFFF 0%, #A3A3A3 100%)',
    secondary: 'linear-gradient(135deg, #262626 0%, #0D0D0D 100%)',
    // New Dark Aesthetic Background
    background: 'linear-gradient(135deg, #0D0D0D 0%, #171717 50%, #262626 100%)',
  },
  typography: {
    fontFamily: '"Manrope", "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    headingFont: '"Manrope", sans-serif',
    fontSize: {
      small: '0.875rem',
      medium: '1.125rem', // Slightly larger for better readability
      large: '1.5rem',
      xlarge: '3rem', // Bold H1s
    },
  },
  spacing: {
    small: '0.75rem', // Increased whitespace
    medium: '1.5rem',
    large: '2.5rem',
    xlarge: '4rem',
  },
  borderRadius: '0.5rem', // Sharper corners
  shadows: {
    small: '0 1px 2px 0 rgba(0, 0, 0, 0.5)',
    medium: '0 4px 6px -1px rgba(0, 0, 0, 0.6), 0 2px 4px -1px rgba(0, 0, 0, 0.4)',
    large: '0 20px 25px -5px rgba(0, 0, 0, 0.8)',
  },
};

// Responsive breakpoints with mobile-first approach
export const breakpoints = {
  mobile: '320px',
  mobileLarge: '480px',
  tablet: '768px',
  tabletLarge: '1024px',
  desktop: '1200px',
  desktopLarge: '1440px',
  xlarge: '1920px',
};

// Media query helpers with mobile-first approach
export const media = {
  // Mobile-first min-width queries
  mobile: `@media (min-width: ${breakpoints.mobile})`,
  mobileLarge: `@media (min-width: ${breakpoints.mobileLarge})`,
  tablet: `@media (min-width: ${breakpoints.tablet})`,
  tabletLarge: `@media (min-width: ${breakpoints.tabletLarge})`,
  desktop: `@media (min-width: ${breakpoints.desktop})`,
  desktopLarge: `@media (min-width: ${breakpoints.desktopLarge})`,
  xlarge: `@media (min-width: ${breakpoints.xlarge})`,

  // Max-width queries for specific ranges
  mobileOnly: `@media (max-width: ${parseInt(breakpoints.tablet) - 1}px)`,
  tabletOnly: `@media (min-width: ${breakpoints.tablet}) and (max-width: ${parseInt(breakpoints.desktop) - 1}px)`,
  desktopOnly: `@media (min-width: ${breakpoints.desktop})`,

  // Orientation queries
  landscape: '@media (orientation: landscape)',
  portrait: '@media (orientation: portrait)',

  // Combined orientation and size queries
  mobileLandscape: `@media (max-width: ${parseInt(breakpoints.tablet) - 1}px) and (orientation: landscape)`,
  mobilePortrait: `@media (max-width: ${parseInt(breakpoints.tablet) - 1}px) and (orientation: portrait)`,
  tabletLandscape: `@media (min-width: ${breakpoints.tablet}) and (max-width: ${parseInt(breakpoints.desktop) - 1}px) and (orientation: landscape)`,
  tabletPortrait: `@media (min-width: ${breakpoints.tablet}) and (max-width: ${parseInt(breakpoints.desktop) - 1}px) and (orientation: portrait)`,

  // High DPI displays
  retina: '@media (-webkit-min-device-pixel-ratio: 2), (min-resolution: 192dpi)',

  // Reduced motion preference
  reducedMotion: '@media (prefers-reduced-motion: reduce)',

  // Touch devices
  touch: '@media (hover: none) and (pointer: coarse)',

  // Hover-capable devices
  hover: '@media (hover: hover) and (pointer: fine)',
};

// Animation configurations
export const animations = {
  duration: {
    fast: '150ms',
    normal: '300ms',
    slow: '500ms',
  },
  easing: {
    easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
    easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
    easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
  },
};

// Z-index scale
export const zIndex = {
  base: 0,
  dropdown: 1000,
  sticky: 1020,
  fixed: 1030,
  modal: 1040,
  popover: 1050,
  tooltip: 1060,
};

// Responsive spacing system
export const responsiveSpacing = {
  // Container padding
  containerPadding: {
    mobile: '1rem',
    tablet: '1.5rem',
    desktop: '2rem',
  },
  // Section spacing
  sectionSpacing: {
    mobile: '2rem',
    tablet: '3rem',
    desktop: '4rem',
  },
  // Component spacing
  componentSpacing: {
    mobile: '0.75rem',
    tablet: '1rem',
    desktop: '1.25rem',
  },
};

// Responsive typography scale
export const responsiveTypography = {
  // Heading scales
  headingScale: {
    h1: {
      mobile: '1.75rem', // 28px
      tablet: '2.25rem', // 36px
      desktop: '2.75rem', // 44px
    },
    h2: {
      mobile: '1.5rem', // 24px
      tablet: '1.875rem', // 30px
      desktop: '2.25rem', // 36px
    },
    h3: {
      mobile: '1.25rem', // 20px
      tablet: '1.5rem', // 24px
      desktop: '1.75rem', // 28px
    },
    h4: {
      mobile: '1.125rem', // 18px
      tablet: '1.25rem', // 20px
      desktop: '1.375rem', // 22px
    },
  },
  // Body text scales
  bodyScale: {
    large: {
      mobile: '1.125rem', // 18px
      tablet: '1.25rem', // 20px
      desktop: '1.375rem', // 22px
    },
    medium: {
      mobile: '1rem', // 16px
      tablet: '1.125rem', // 18px
      desktop: '1.125rem', // 18px
    },
    small: {
      mobile: '0.875rem', // 14px
      tablet: '0.875rem', // 14px
      desktop: '0.9375rem', // 15px
    },
  },
};

// Layout utilities
export const layoutUtils = {
  // Container max-widths
  containerMaxWidth: {
    mobile: '100%',
    tablet: '768px',
    desktop: '1200px',
    large: '1440px',
  },
  // Grid configurations
  gridColumns: {
    mobile: 1,
    tablet: 2,
    desktop: 3,
    large: 4,
  },
  // Flexbox utilities
  flexGaps: {
    small: '0.5rem',
    medium: '1rem',
    large: '1.5rem',
    xlarge: '2rem',
  },
};

// Transition configurations for responsive changes
export const responsiveTransitions = {
  // Layout transitions
  layout: 'all 300ms cubic-bezier(0.4, 0, 0.2, 1)',
  // Orientation change transitions
  orientation: 'all 500ms cubic-bezier(0.4, 0, 0.2, 1)',
  // Breakpoint transitions
  breakpoint: 'all 250ms cubic-bezier(0.4, 0, 0.2, 1)',
  // Smooth resize transitions
  resize: 'all 200ms cubic-bezier(0.4, 0, 0.2, 1)',
};
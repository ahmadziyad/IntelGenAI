// ActionButton - Interactive button component with modern design and comprehensive accessibility
import React, { useState, useCallback } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { ActionButtonProps } from '../../types/profile';
import { defaultTheme } from '../../styles/theme';
import { 
  useKeyboardNavigation, 
  usePrefersReducedMotion,
  touchFriendly,
  createAccessibleFocusStyles 
} from '../../utils/accessibility';

// Ripple effect animation
const rippleAnimation = keyframes`
  0% {
    transform: scale(0);
    opacity: 1;
  }
  100% {
    transform: scale(4);
    opacity: 0;
  }
`;

// Loading spinner animation
const spinAnimation = keyframes`
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
`;

// Styled button component with variants and interactions
const StyledButton = styled.button<{
  $variant: 'primary' | 'secondary' | 'outline';
  $size: 'small' | 'medium' | 'large';
  $loading: boolean;
}>`
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: ${defaultTheme.spacing.small};
  border: none;
  border-radius: ${defaultTheme.borderRadius};
  font-family: ${defaultTheme.typography.fontFamily};
  font-weight: 600;
  text-decoration: none;
  cursor: pointer;
  transition: all 300ms cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;
  user-select: none;
  outline: none;
  
  /* Prevent text selection during interactions */
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;

  /* Size variants with touch-friendly sizing */
  ${props => props.$size === 'small' && css`
    padding: 0.5rem 0.75rem;
    font-size: 0.75rem;
    min-height: 36px;
    min-width: 60px;
  `}

  ${props => props.$size === 'medium' && css`
    padding: ${defaultTheme.spacing.medium} ${defaultTheme.spacing.large};
    font-size: ${defaultTheme.typography.fontSize.medium};
    min-height: ${touchFriendly.recommendedTouchTarget};
    min-width: 120px;
  `}

  ${props => props.$size === 'large' && css`
    padding: ${defaultTheme.spacing.large} ${defaultTheme.spacing.xlarge};
    font-size: ${defaultTheme.typography.fontSize.large};
    min-height: 52px;
    min-width: 160px;
  `}

  /* Color variants */
  ${props => props.$variant === 'primary' && css`
    background: ${defaultTheme.gradients.primary};
    color: white;
    box-shadow: ${defaultTheme.shadows.small};

    &:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: ${defaultTheme.shadows.medium};
    }

    &:active:not(:disabled) {
      transform: translateY(-1px);
      box-shadow: ${defaultTheme.shadows.small};
    }
  `}

  ${props => props.$variant === 'secondary' && css`
    background: ${defaultTheme.colors.secondary};
    color: white;
    box-shadow: ${defaultTheme.shadows.small};

    &:hover:not(:disabled) {
      background: ${defaultTheme.colors.primary};
      transform: translateY(-2px);
      box-shadow: ${defaultTheme.shadows.medium};
    }

    &:active:not(:disabled) {
      transform: translateY(-1px);
    }
  `}

  ${props => props.$variant === 'outline' && css`
    background: transparent;
    color: ${defaultTheme.colors.primary};
    border: 2px solid ${defaultTheme.colors.primary};
    box-shadow: none;

    &:hover:not(:disabled) {
      background: ${defaultTheme.colors.primary};
      color: white;
      transform: translateY(-2px);
      box-shadow: ${defaultTheme.shadows.small};
    }

    &:active:not(:disabled) {
      transform: translateY(-1px);
    }
  `}

  /* Loading state */
  ${props => props.$loading && css`
    cursor: not-allowed;
  `}

  /* Disabled state */
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none !important;
    box-shadow: none !important;
  }

  /* Enhanced focus styles for accessibility */
  &:focus-visible {
    ${() => createAccessibleFocusStyles(defaultTheme.colors.accent)};
    box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.2);
  }

  /* High contrast mode support */
  @media (prefers-contrast: high) {
    border: 2px solid;
    
    &:focus-visible {
      outline: 3px solid;
      outline-offset: 2px;
    }
  }

  /* Reduced motion support */
  @media (prefers-reduced-motion: reduce) {
    transition: none;
    animation: none;
    
    &:hover:not(:disabled) {
      transform: none;
    }
    
    &:active:not(:disabled) {
      transform: none;
    }
  }
`;

// Ripple effect container
const RippleContainer = styled.span`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overflow: hidden;
  border-radius: inherit;
  pointer-events: none;
`;

// Individual ripple element
const Ripple = styled.span<{ $x: number; $y: number }>`
  position: absolute;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.6);
  transform: scale(0);
  animation: ${rippleAnimation} 600ms linear;
  left: ${props => props.$x - 10}px;
  top: ${props => props.$y - 10}px;
`;

// Loading spinner
const LoadingSpinner = styled.div`
  width: 16px;
  height: 16px;
  border: 2px solid transparent;
  border-top: 2px solid currentColor;
  border-radius: 50%;
  animation: ${spinAnimation} 1s linear infinite;
`;

// Button content wrapper
const ButtonContent = styled.span<{ $loading: boolean }>`
  display: flex;
  align-items: center;
  gap: ${defaultTheme.spacing.small};
  opacity: ${props => props.$loading ? 0.7 : 1};
  transition: opacity 200ms ease;
`;

interface RippleState {
  id: number;
  x: number;
  y: number;
}

const ActionButton: React.FC<ActionButtonProps> = ({ 
  text, 
  onClick, 
  variant = 'primary', 
  size = 'medium', 
  loading = false 
}) => {
  const [ripples, setRipples] = useState<RippleState[]>([]);
  const prefersReducedMotion = usePrefersReducedMotion();

  // Handle click with ripple effect (respecting reduced motion)
  const handleClick = useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
    if (loading) return;

    // Create ripple effect only if motion is not reduced
    if (!prefersReducedMotion) {
      const button = event.currentTarget;
      const rect = button.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;

      const newRipple: RippleState = {
        id: Date.now(),
        x,
        y,
      };

      setRipples(prev => [...prev, newRipple]);

      // Remove ripple after animation
      setTimeout(() => {
        setRipples(prev => prev.filter(ripple => ripple.id !== newRipple.id));
      }, 600);
    }

    // Call the provided onClick handler
    onClick();
  }, [loading, onClick, prefersReducedMotion]);

  // Enhanced keyboard navigation
  const handleKeyDown = useKeyboardNavigation(
    () => !loading && onClick(), // Enter key
    () => !loading && onClick(), // Space key
    undefined // No escape handler for buttons
  );

  return (
    <StyledButton
      $variant={variant}
      $size={size}
      $loading={loading}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      disabled={loading}
      data-testid="action-button"
      aria-label={loading ? `${text} - Loading` : text}
      aria-disabled={loading}
      role="button"
      tabIndex={0}
    >
      {/* Only show ripples if motion is not reduced */}
      {!prefersReducedMotion && (
        <RippleContainer>
          {ripples.map(ripple => (
            <Ripple
              key={ripple.id}
              $x={ripple.x}
              $y={ripple.y}
            />
          ))}
        </RippleContainer>
      )}
      
      <ButtonContent $loading={loading}>
        {loading && <LoadingSpinner />}
        {text}
      </ButtonContent>
    </StyledButton>
  );
};

export default ActionButton;
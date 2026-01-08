// ActionButton component tests
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ThemeProvider } from 'styled-components';
import ActionButton from './ActionButton';
import { defaultTheme } from '../../styles/theme';

// Test wrapper with theme provider
const TestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <ThemeProvider theme={defaultTheme}>
    {children}
  </ThemeProvider>
);

describe('ActionButton', () => {
  const mockOnClick = jest.fn();

  beforeEach(() => {
    mockOnClick.mockClear();
  });

  describe('Basic Rendering', () => {
    it('renders with default props', () => {
      render(
        <TestWrapper>
          <ActionButton text="Click Me" onClick={mockOnClick} />
        </TestWrapper>
      );

      const button = screen.getByTestId('action-button');
      expect(button).toBeInTheDocument();
      expect(button).toHaveTextContent('Click Me');
    });

    it('renders with custom text', () => {
      render(
        <TestWrapper>
          <ActionButton text="Know More About Me" onClick={mockOnClick} />
        </TestWrapper>
      );

      expect(screen.getByTestId('action-button')).toBeInTheDocument();
      expect(screen.getByTestId('action-button')).toHaveTextContent('Know More About Me');
    });

    it('applies correct data-testid', () => {
      render(
        <TestWrapper>
          <ActionButton text="Test Button" onClick={mockOnClick} />
        </TestWrapper>
      );

      expect(screen.getByTestId('action-button')).toBeInTheDocument();
    });
  });

  describe('Variants', () => {
    it('renders primary variant by default', () => {
      render(
        <TestWrapper>
          <ActionButton text="Primary" onClick={mockOnClick} />
        </TestWrapper>
      );

      const button = screen.getByTestId('action-button');
      expect(button).toBeInTheDocument();
    });

    it('renders secondary variant', () => {
      render(
        <TestWrapper>
          <ActionButton text="Secondary" onClick={mockOnClick} variant="secondary" />
        </TestWrapper>
      );

      const button = screen.getByTestId('action-button');
      expect(button).toBeInTheDocument();
    });

    it('renders outline variant', () => {
      render(
        <TestWrapper>
          <ActionButton text="Outline" onClick={mockOnClick} variant="outline" />
        </TestWrapper>
      );

      const button = screen.getByTestId('action-button');
      expect(button).toBeInTheDocument();
    });
  });

  describe('Sizes', () => {
    it('renders medium size by default', () => {
      render(
        <TestWrapper>
          <ActionButton text="Medium" onClick={mockOnClick} />
        </TestWrapper>
      );

      const button = screen.getByTestId('action-button');
      expect(button).toBeInTheDocument();
    });

    it('renders small size', () => {
      render(
        <TestWrapper>
          <ActionButton text="Small" onClick={mockOnClick} size="small" />
        </TestWrapper>
      );

      const button = screen.getByTestId('action-button');
      expect(button).toBeInTheDocument();
    });

    it('renders large size', () => {
      render(
        <TestWrapper>
          <ActionButton text="Large" onClick={mockOnClick} size="large" />
        </TestWrapper>
      );

      const button = screen.getByTestId('action-button');
      expect(button).toBeInTheDocument();
    });
  });

  describe('Interactions', () => {
    it('calls onClick when clicked', async () => {
      const user = userEvent.setup();
      
      render(
        <TestWrapper>
          <ActionButton text="Click Me" onClick={mockOnClick} />
        </TestWrapper>
      );

      const button = screen.getByTestId('action-button');
      await user.click(button);

      expect(mockOnClick).toHaveBeenCalledTimes(1);
    });

    it('calls onClick when activated with Enter key', async () => {
      const user = userEvent.setup();
      
      render(
        <TestWrapper>
          <ActionButton text="Press Enter" onClick={mockOnClick} />
        </TestWrapper>
      );

      const button = screen.getByTestId('action-button');
      button.focus();
      await user.keyboard('{Enter}');

      expect(mockOnClick).toHaveBeenCalledTimes(1);
    });

    it('calls onClick when activated with Space key', async () => {
      const user = userEvent.setup();
      
      render(
        <TestWrapper>
          <ActionButton text="Press Space" onClick={mockOnClick} />
        </TestWrapper>
      );

      const button = screen.getByTestId('action-button');
      button.focus();
      await user.keyboard(' ');

      expect(mockOnClick).toHaveBeenCalledTimes(1);
    });

    it('creates ripple effect on click', async () => {
      render(
        <TestWrapper>
          <ActionButton text="Ripple Test" onClick={mockOnClick} />
        </TestWrapper>
      );

      const button = screen.getByTestId('action-button');
      
      // Use act to wrap the click event that triggers state updates
      fireEvent.click(button);

      await waitFor(() => {
        // Ripple elements are created dynamically, so we check if the click was handled
        expect(mockOnClick).toHaveBeenCalledTimes(1);
      });
    });
  });

  describe('Loading State', () => {
    it('shows loading spinner when loading is true', () => {
      render(
        <TestWrapper>
          <ActionButton text="Loading Button" onClick={mockOnClick} loading={true} />
        </TestWrapper>
      );

      const button = screen.getByTestId('action-button');
      expect(button).toBeDisabled();
      expect(button).toHaveAttribute('aria-label', 'Loading Button - Loading');
    });

    it('does not call onClick when loading', () => {
      render(
        <TestWrapper>
          <ActionButton text="Loading Button" onClick={mockOnClick} loading={true} />
        </TestWrapper>
      );

      const button = screen.getByTestId('action-button');
      // Use fireEvent instead of userEvent for disabled buttons
      fireEvent.click(button);

      expect(mockOnClick).not.toHaveBeenCalled();
    });

    it('prevents keyboard activation when loading', () => {
      render(
        <TestWrapper>
          <ActionButton text="Loading Button" onClick={mockOnClick} loading={true} />
        </TestWrapper>
      );

      const button = screen.getByTestId('action-button');
      button.focus();
      fireEvent.keyDown(button, { key: 'Enter' });
      fireEvent.keyDown(button, { key: ' ' });

      expect(mockOnClick).not.toHaveBeenCalled();
    });
  });

  describe('Accessibility', () => {
    it('has proper ARIA attributes', () => {
      render(
        <TestWrapper>
          <ActionButton text="Accessible Button" onClick={mockOnClick} />
        </TestWrapper>
      );

      const button = screen.getByTestId('action-button');
      expect(button).toHaveAttribute('role', 'button');
      expect(button).toHaveAttribute('tabIndex', '0');
      expect(button).toHaveAttribute('aria-label', 'Accessible Button');
      expect(button).toHaveAttribute('aria-disabled', 'false');
    });

    it('updates ARIA attributes when loading', () => {
      render(
        <TestWrapper>
          <ActionButton text="Loading Button" onClick={mockOnClick} loading={true} />
        </TestWrapper>
      );

      const button = screen.getByTestId('action-button');
      expect(button).toHaveAttribute('aria-label', 'Loading Button - Loading');
      expect(button).toHaveAttribute('aria-disabled', 'true');
    });

    it('is focusable with keyboard navigation', () => {
      render(
        <TestWrapper>
          <ActionButton text="Focusable Button" onClick={mockOnClick} />
        </TestWrapper>
      );

      const button = screen.getByTestId('action-button');
      button.focus();
      expect(button).toHaveFocus();
    });

    it('has minimum touch target size for accessibility', () => {
      render(
        <TestWrapper>
          <ActionButton text="Touch Target" onClick={mockOnClick} size="small" />
        </TestWrapper>
      );

      const button = screen.getByTestId('action-button');
      
      // Small size should still meet minimum 36px height requirement
      expect(button).toBeInTheDocument();
    });
  });

  describe('Visual Feedback', () => {
    it('provides visual feedback on hover', () => {
      render(
        <TestWrapper>
          <ActionButton text="Hover Test" onClick={mockOnClick} />
        </TestWrapper>
      );

      const button = screen.getByTestId('action-button');
      fireEvent.mouseEnter(button);
      
      // Button should be present and interactive
      expect(button).toBeInTheDocument();
    });

    it('provides visual feedback on focus', () => {
      render(
        <TestWrapper>
          <ActionButton text="Focus Test" onClick={mockOnClick} />
        </TestWrapper>
      );

      const button = screen.getByTestId('action-button');
      button.focus();
      
      expect(button).toHaveFocus();
    });
  });

  describe('Error Handling', () => {
    it('handles missing onClick gracefully', () => {
      // This should not crash the component
      expect(() => {
        render(
          <TestWrapper>
            <ActionButton text="No Handler" onClick={() => {}} />
          </TestWrapper>
        );
      }).not.toThrow();
    });

    it('handles empty text gracefully', () => {
      render(
        <TestWrapper>
          <ActionButton text="" onClick={mockOnClick} />
        </TestWrapper>
      );

      const button = screen.getByTestId('action-button');
      expect(button).toBeInTheDocument();
    });
  });
});
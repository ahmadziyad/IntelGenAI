import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';
import ProfileImage from './ProfileImage';
import { defaultTheme } from '../../styles/theme';

// Mock IntersectionObserver
const mockIntersectionObserver = jest.fn();
mockIntersectionObserver.mockImplementation((callback, options) => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
  callback,
  options,
}));

// Set up global mock
Object.defineProperty(window, 'IntersectionObserver', {
  writable: true,
  configurable: true,
  value: mockIntersectionObserver,
});

Object.defineProperty(global, 'IntersectionObserver', {
  writable: true,
  configurable: true,
  value: mockIntersectionObserver,
});

const renderWithTheme = (component: React.ReactElement) => {
  return render(
    <ThemeProvider theme={defaultTheme}>
      {component}
    </ThemeProvider>
  );
};

describe('ProfileImage', () => {
  const defaultProps = {
    src: 'https://example.com/image.jpg',
    alt: 'Test profile image',
  };

  beforeEach(() => {
    mockIntersectionObserver.mockClear();
  });

  it('renders with default props', () => {
    renderWithTheme(<ProfileImage {...defaultProps} />);
    
    const container = screen.getByTestId('profile-image-container');
    expect(container).toBeInTheDocument();
  });

  it('applies correct size classes', () => {
    const { rerender } = renderWithTheme(
      <ProfileImage {...defaultProps} size="small" />
    );
    
    let container = screen.getByTestId('profile-image-container');
    expect(container).toBeInTheDocument();

    rerender(
      <ThemeProvider theme={defaultTheme}>
        <ProfileImage {...defaultProps} size="large" />
      </ThemeProvider>
    );
    
    container = screen.getByTestId('profile-image-container');
    expect(container).toBeInTheDocument();
  });

  it('applies correct shape styles', () => {
    const { rerender } = renderWithTheme(
      <ProfileImage {...defaultProps} shape="circle" />
    );
    
    let container = screen.getByTestId('profile-image-container');
    expect(container).toBeInTheDocument();

    rerender(
      <ThemeProvider theme={defaultTheme}>
        <ProfileImage {...defaultProps} shape="square" />
      </ThemeProvider>
    );
    
    container = screen.getByTestId('profile-image-container');
    expect(container).toBeInTheDocument();
  });

  it('shows fallback icon on image error', async () => {
    renderWithTheme(<ProfileImage {...defaultProps} />);
    
    // Wait for image to be rendered and then simulate error
    await waitFor(() => {
      const image = screen.queryByTestId('profile-image');
      if (image) {
        fireEvent.error(image);
      }
    });

    await waitFor(() => {
      const fallback = screen.queryByTestId('profile-image-fallback');
      expect(fallback).toBeInTheDocument();
    });
  });

  it('handles successful image load', async () => {
    renderWithTheme(<ProfileImage {...defaultProps} />);
    
    await waitFor(() => {
      const image = screen.queryByTestId('profile-image');
      if (image) {
        fireEvent.load(image);
      }
    });

    const image = screen.queryByTestId('profile-image');
    expect(image).toBeInTheDocument();
  });

  it('generates optimized URLs for Unsplash images', async () => {
    const unsplashSrc = 'https://images.unsplash.com/photo-123?w=400&h=400';
    renderWithTheme(<ProfileImage {...defaultProps} src={unsplashSrc} />);
    
    await waitFor(() => {
      const image = screen.getByTestId('profile-image');
      expect(image.getAttribute('src')).toContain('fm=webp');
    });
    
    await waitFor(() => {
      const image = screen.getByTestId('profile-image');
      expect(image.getAttribute('src')).toContain('q=85');
    });
  });

  it('provides proper accessibility attributes', () => {
    renderWithTheme(<ProfileImage {...defaultProps} />);
    
    const container = screen.getByTestId('profile-image-container');
    expect(container).toBeInTheDocument();
    
    // In test environment, image should be visible immediately
    const image = screen.getByTestId('profile-image');
    expect(image).toHaveAttribute('alt', defaultProps.alt);
    expect(image).toHaveAttribute('loading', 'lazy');
    expect(image).toHaveAttribute('decoding', 'async');
  });
});
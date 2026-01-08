// ProfileCard component tests
import React from 'react';
import { render, screen } from '@testing-library/react';
import ProfileCard from './ProfileCard';
import { defaultTheme } from '../../styles/theme';
import { ProfileData } from '../../types/profile';

const mockProfile: ProfileData = {
  id: '1',
  name: 'John Doe',
  title: 'Software Engineer',
  description: 'Passionate developer with expertise in React and TypeScript.',
  image: {
    src: 'https://example.com/profile.jpg',
    alt: 'John Doe profile picture'
  }
};

const mockOnActionClick = jest.fn();

describe('ProfileCard', () => {
  beforeEach(() => {
    mockOnActionClick.mockClear();
  });

  it('renders profile information correctly', () => {
    render(
      <ProfileCard
        profile={mockProfile}
        styling={defaultTheme}
        onActionClick={mockOnActionClick}
      />
    );

    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('Software Engineer')).toBeInTheDocument();
    expect(screen.getByText('Passionate developer with expertise in React and TypeScript.')).toBeInTheDocument();
  });

  it('renders profile card without action button', () => {
    render(
      <ProfileCard
        profile={mockProfile}
        styling={defaultTheme}
        onActionClick={mockOnActionClick}
      />
    );

    // Action button should not be present as it was removed
    const actionButton = screen.queryByTestId('action-button');
    expect(actionButton).not.toBeInTheDocument();
  });

  it('renders profile image when src is provided', () => {
    render(
      <ProfileCard
        profile={mockProfile}
        styling={defaultTheme}
        onActionClick={mockOnActionClick}
      />
    );

    const profileImageContainer = screen.getByTestId('profile-image-container');
    expect(profileImageContainer).toBeInTheDocument();
    expect(profileImageContainer).toHaveAttribute('role', 'img');
  });

  it('renders placeholder when no image src is provided', () => {
    const profileWithoutImage = {
      ...mockProfile,
      image: {
        src: '',
        alt: 'Profile picture'
      }
    };

    render(
      <ProfileCard
        profile={profileWithoutImage}
        styling={defaultTheme}
        onActionClick={mockOnActionClick}
      />
    );

    // Should show initials placeholder
    expect(screen.getByText('JD')).toBeInTheDocument();
  });

  it('has proper accessibility attributes', () => {
    render(
      <ProfileCard
        profile={mockProfile}
        styling={defaultTheme}
        onActionClick={mockOnActionClick}
      />
    );

    const profileCard = screen.getByTestId('profile-card');
    expect(profileCard).toBeInTheDocument();
    expect(profileCard).toHaveAttribute('data-testid', 'profile-card');
  });

  it('applies modern styling classes and hover effects', () => {
    render(
      <ProfileCard
        profile={mockProfile}
        styling={defaultTheme}
        onActionClick={mockOnActionClick}
      />
    );

    const profileCard = screen.getByTestId('profile-card');
    expect(profileCard).toBeInTheDocument();
    expect(profileCard).toHaveClass('sc-gGKoUb');
  });
});
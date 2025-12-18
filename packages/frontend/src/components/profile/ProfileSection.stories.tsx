import type { Meta, StoryObj } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import ProfileSection from './ProfileSection';
import {
  sampleProfiles,
  profileStylings
} from '../../data/sampleProfile';

const meta: Meta<typeof ProfileSection> = {
  title: 'Profile/ProfileSection',
  component: ProfileSection,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
# ProfileSection Component

The main container component for the personal profile section. This component:

- Displays prominently in the top 25% of the viewport
- Includes responsive design for all device sizes
- Manages modal state for extended information
- Provides accessibility features and keyboard navigation
- Handles error states and fallback scenarios

## Features

- **Responsive Design**: Adapts to mobile, tablet, and desktop viewports
- **Accessibility**: Full keyboard navigation and screen reader support
- **Performance**: Lazy loading and optimized animations
- **Error Handling**: Graceful degradation with fallback content
- **Modern Styling**: Gradient backgrounds, shadows, and smooth transitions

## Usage

The ProfileSection component is designed to be placed at the top of your application layout.
It automatically calculates its height to occupy 25% of the viewport while maintaining
readability across all device sizes.
        `,
      },
    },
  },
  argTypes: {
    profile: {
      description: 'Profile data to display',
      control: { type: 'object' },
    },
    styling: {
      description: 'Styling configuration for the profile section',
      control: { type: 'object' },
    },
    onModalOpen: {
      description: 'Callback fired when modal opens',
      action: 'modal opened',
    },
    onModalClose: {
      description: 'Callback fired when modal closes',
      action: 'modal closed',
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof ProfileSection>;

// Default story with developer profile
export const Default: Story = {
  args: {
    profile: sampleProfiles.developer.basic,
    styling: profileStylings.default,
    onModalOpen: action('modal-opened'),
    onModalClose: action('modal-closed'),
  },
};

// Designer profile variant
export const Designer: Story = {
  args: {
    profile: sampleProfiles.developer.basic,
    styling: profileStylings.default,
    onModalOpen: action('modal-opened'),
    onModalClose: action('modal-closed'),
  },
};

// Dark theme variant
export const DarkTheme: Story = {
  args: {
    profile: sampleProfiles.developer.basic,
    styling: profileStylings.dark,
    onModalOpen: action('modal-opened'),
    onModalClose: action('modal-closed'),
  },
  parameters: {
    backgrounds: { default: 'dark' },
  },
};

// Minimal profile for testing edge cases
export const MinimalProfile: Story = {
  args: {
    profile: sampleProfiles.developer.basic,
    styling: profileStylings.default,
    onModalOpen: action('modal-opened'),
    onModalClose: action('modal-closed'),
  },
};

// Long content profile for testing text truncation
export const LongContent: Story = {
  args: {
    profile: sampleProfiles.developer.basic,
    styling: profileStylings.default,
    onModalOpen: action('modal-opened'),
    onModalClose: action('modal-closed'),
  },
};

// Mobile viewport story
export const Mobile: Story = {
  args: {
    profile: sampleProfiles.developer.basic,
    styling: profileStylings.default,
    onModalOpen: action('modal-opened'),
    onModalClose: action('modal-closed'),
  },
  parameters: {
    viewport: {
      defaultViewport: 'mobile',
    },
  },
};

// Tablet viewport story
export const Tablet: Story = {
  args: {
    profile: sampleProfiles.developer.basic,
    styling: profileStylings.default,
    onModalOpen: action('modal-opened'),
    onModalClose: action('modal-closed'),
  },
  parameters: {
    viewport: {
      defaultViewport: 'tablet',
    },
  },
};

// Desktop large viewport story
export const DesktopLarge: Story = {
  args: {
    profile: sampleProfiles.developer.basic,
    styling: profileStylings.default,
    onModalOpen: action('modal-opened'),
    onModalClose: action('modal-closed'),
  },
  parameters: {
    viewport: {
      defaultViewport: 'desktopLarge',
    },
  },
};

// Error state simulation
export const ErrorState: Story = {
  args: {
    profile: {
      id: 'error-profile',
      name: '',
      title: '',
      description: '',
      image: { src: '', alt: '' },
    },
    styling: profileStylings.default,
    onModalOpen: action('modal-opened'),
    onModalClose: action('modal-closed'),
  },
};

// Custom styling example
export const CustomStyling: Story = {
  args: {
    profile: sampleProfiles.developer.basic,
    styling: {
      ...profileStylings.default,
      colors: {
        ...profileStylings.default.colors,
        primary: '#059669', // Emerald-600
        secondary: '#DC2626', // Red-600
        accent: '#7C2D12', // Orange-900
      },
      gradients: {
        primary: 'linear-gradient(135deg, #059669 0%, #DC2626 100%)',
        secondary: 'linear-gradient(135deg, #DC2626 0%, #7C2D12 100%)',
        background: 'linear-gradient(135deg, #F0FDF4 0%, #FEF2F2 100%)',
      },
    },
    onModalOpen: action('modal-opened'),
    onModalClose: action('modal-closed'),
  },
};

// Accessibility testing story
export const AccessibilityTest: Story = {
  args: {
    profile: sampleProfiles.developer.basic,
    styling: profileStylings.default,
    onModalOpen: action('modal-opened'),
    onModalClose: action('modal-closed'),
  },
  parameters: {
    docs: {
      description: {
        story: `
This story is optimized for accessibility testing. Key features:

- High contrast colors (WCAG AA compliant)
- Proper ARIA labels and roles
- Keyboard navigation support
- Screen reader announcements
- Focus management
- Reduced motion support

Test with:
- Tab navigation
- Screen readers
- Keyboard-only interaction
- High contrast mode
        `,
      },
    },
  },
};
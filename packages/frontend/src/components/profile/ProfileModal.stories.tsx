import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import ProfileModal from './ProfileModal';
import {
  sampleProfiles,
  profileStylings
} from '../../data/sampleProfile';

const meta: Meta<typeof ProfileModal> = {
  title: 'Profile/ProfileModal',
  component: ProfileModal,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
# ProfileModal Component

A comprehensive modal component for displaying extended profile information with full accessibility support.

## Features

- **Full-Screen Overlay**: Modal overlay with backdrop blur effect
- **Comprehensive Content**: Displays experience, skills, projects, education, and achievements
- **Accessibility**: Full keyboard navigation, focus trapping, and screen reader support
- **Error Handling**: Graceful error states and data validation
- **Responsive Design**: Adapts to different screen sizes and orientations
- **Performance**: Lazy loading and optimized animations

## Content Sections

- **Contact Information**: Email, phone, location, and social links
- **Professional Experience**: Work history with technologies used
- **Skills & Technologies**: Categorized skills with proficiency levels
- **Featured Projects**: Project showcase with images and links
- **Education**: Academic background and qualifications
- **Achievements**: Certifications, awards, and accomplishments

## Accessibility

- Focus trapping within modal
- Keyboard navigation (Tab, Escape)
- Screen reader announcements
- ARIA labels and roles
- High contrast support
- Reduced motion support

## Usage

The modal is typically triggered by clicking the "Know More About Me" button
in the ProfileCard component. It displays comprehensive information about
the person in an organized, scrollable format.
        `,
      },
    },
  },
  argTypes: {
    isOpen: {
      description: 'Whether the modal is open',
      control: { type: 'boolean' },
    },
    onClose: {
      description: 'Callback fired when modal closes',
      action: 'modal closed',
    },
    profile: {
      description: 'Extended profile data to display',
      control: { type: 'object' },
    },
    styling: {
      description: 'Styling configuration for the modal',
      control: { type: 'object' },
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof ProfileModal>;

// Default story (closed modal)
export const Default: Story = {
  args: {
    isOpen: false,
    onClose: action('modal-closed'),
    profile: sampleProfiles.developer.extended,
    styling: profileStylings.default,
  },
};

// Open modal with developer profile
export const OpenDeveloper: Story = {
  args: {
    isOpen: true,
    onClose: action('modal-closed'),
    profile: sampleProfiles.developer.extended,
    styling: profileStylings.default,
  },
};

// Open modal with designer profile
export const OpenDesigner: Story = {
  args: {
    isOpen: true,
    onClose: action('modal-closed'),
    profile: sampleProfiles.developer.extended,
    styling: profileStylings.default,
  },
};

// Dark theme modal
export const DarkTheme: Story = {
  args: {
    isOpen: true,
    onClose: action('modal-closed'),
    profile: sampleProfiles.developer.extended,
    styling: profileStylings.dark,
  },
  parameters: {
    backgrounds: { default: 'dark' },
  },
};

// Minimal profile data
export const MinimalProfile: Story = {
  args: {
    isOpen: true,
    onClose: action('modal-closed'),
    profile: sampleProfiles.developer.extended,
    styling: profileStylings.default,
  },
};

// Long content profile
export const LongContentProfile: Story = {
  args: {
    isOpen: true,
    onClose: action('modal-closed'),
    profile: sampleProfiles.developer.extended,
    styling: profileStylings.default,
  },
};

// Mobile viewport
export const Mobile: Story = {
  args: {
    isOpen: true,
    onClose: action('modal-closed'),
    profile: sampleProfiles.developer.extended,
    styling: profileStylings.default,
  },
  parameters: {
    viewport: {
      defaultViewport: 'mobile',
    },
  },
};

// Tablet viewport
export const Tablet: Story = {
  args: {
    isOpen: true,
    onClose: action('modal-closed'),
    profile: sampleProfiles.developer.extended,
    styling: profileStylings.default,
  },
  parameters: {
    viewport: {
      defaultViewport: 'tablet',
    },
  },
};

// Error state simulation
export const ErrorState: Story = {
  args: {
    isOpen: true,
    onClose: action('modal-closed'),
    profile: {
      ...sampleProfiles.developer.extended,
      name: '', // Invalid data to trigger error
      experience: [], // Empty arrays
      skills: [],
      projects: [],
      education: [],
      achievements: [],
    },
    styling: profileStylings.default,
  },
  parameters: {
    docs: {
      description: {
        story: `
This story demonstrates error handling when profile data is invalid or incomplete.
The modal will show error messages and gracefully handle missing information.
        `,
      },
    },
  },
};

// Loading state simulation
export const LoadingState: Story = {
  args: {
    isOpen: true,
    onClose: action('modal-closed'),
    profile: null as any, // Simulate loading state
    styling: profileStylings.default,
  },
  parameters: {
    docs: {
      description: {
        story: `
This story simulates the loading state when profile data is being fetched.
Shows loading spinner and appropriate messaging.
        `,
      },
    },
  },
};

// Content sections showcase
export const ContentSections: Story = {
  args: {
    isOpen: true,
    onClose: action('modal-closed'),
    profile: {
      ...sampleProfiles.developer.extended,
      // Ensure all sections have content
      contact: {
        email: 'alex.johnson@example.com',
        phone: '+1 (555) 123-4567',
        location: 'San Francisco, CA',
      },
      social: {
        linkedin: 'https://linkedin.com/in/alexjohnson',
        github: 'https://github.com/alexjohnson',
        twitter: 'https://twitter.com/alexjohnson',
        website: 'https://alexjohnson.dev',
      },
    },
    styling: profileStylings.default,
  },
  parameters: {
    docs: {
      description: {
        story: `
This story showcases all available content sections:

- Contact Information (email, phone, location)
- Social Links (LinkedIn, GitHub, Twitter, website)
- Professional Experience with technologies
- Skills & Technologies with proficiency levels
- Featured Projects with images and links
- Education background
- Achievements and certifications

Each section is conditionally rendered based on available data.
        `,
      },
    },
  },
};

// Accessibility demonstration
export const AccessibilityDemo: Story = {
  args: {
    isOpen: true,
    onClose: action('modal-closed'),
    profile: sampleProfiles.developer.extended,
    styling: profileStylings.default,
  },
  parameters: {
    docs: {
      description: {
        story: `
This story highlights accessibility features:

- **Focus Management**: Focus is trapped within the modal
- **Keyboard Navigation**: 
  - Tab to navigate through interactive elements
  - Escape key to close modal
  - Enter/Space on close button
- **Screen Reader Support**:
  - Proper ARIA labels and roles
  - Live region announcements
  - Semantic HTML structure
- **High Contrast**: Compatible with high contrast mode
- **Reduced Motion**: Respects user motion preferences

Test with:
- Keyboard-only navigation
- Screen readers (NVDA, JAWS, VoiceOver)
- High contrast mode
- Reduced motion settings
        `,
      },
    },
  },
};

// Interactive modal demo
export const InteractiveDemo: Story = {
  render: function InteractiveDemoComponent() {
    const [isOpen, setIsOpen] = React.useState(false);

    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <button
          onClick={() => setIsOpen(true)}
          style={{
            padding: '12px 24px',
            background: '#3B82F6',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '16px',
            cursor: 'pointer',
          }}
        >
          Open Profile Modal
        </button>

        <ProfileModal
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          profile={sampleProfiles.developer.extended}
          styling={profileStylings.default}
        />
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: `
Interactive demonstration of the modal. Click the button to open the modal
and test the various interaction patterns:

- Click outside to close (backdrop click)
- Use Escape key to close
- Click the X button to close
- Navigate with Tab key
- Scroll through content sections
        `,
      },
    },
  },
};
import type { Meta, StoryObj } from '@storybook/react';
import ProfileContent from './ProfileContent';
import { sampleProfiles } from '../../data/sampleProfile';

const meta: Meta<typeof ProfileContent> = {
  title: 'Profile/ProfileContent',
  component: ProfileContent,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
# ProfileContent Component

A typography-focused content component with animations and text truncation handling.

## Features

- **Typography Hierarchy**: Clear visual hierarchy with gradient text effects
- **Animated Reveals**: Staggered text animations using Framer Motion
- **Text Truncation**: Smart truncation with expand/collapse functionality
- **Responsive Design**: Adaptive font sizes and spacing across devices
- **Accessibility**: Proper semantic HTML, ARIA labels, and keyboard navigation

## Animation Behavior

- Staggered entrance animations for name, title, and description
- Respects user's reduced motion preferences
- Smooth transitions for expand/collapse interactions

## Text Handling

- Automatic truncation for descriptions longer than 150 characters
- Click-to-expand functionality with keyboard support
- Proper ARIA states for screen readers
        `,
      },
    },
  },
  argTypes: {
    name: {
      description: 'Person\'s full name',
      control: { type: 'text' },
    },
    title: {
      description: 'Professional title or role',
      control: { type: 'text' },
    },
    description: {
      description: 'Brief description or bio',
      control: { type: 'text' },
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof ProfileContent>;

// Default story
export const Default: Story = {
  args: {
    name: sampleProfiles.developer.basic.name,
    title: sampleProfiles.developer.basic.title,
    description: sampleProfiles.developer.basic.description,
  },
};

// Designer profile
export const Designer: Story = {
  args: {
    name: 'Sarah Chen',
    title: 'Senior UX/UI Designer',
    description: 'Creative designer with 10+ years of experience crafting intuitive user experiences and beautiful interfaces for web and mobile applications.',
  },
};

// Minimal content
export const MinimalContent: Story = {
  args: {
    name: 'Sam Smith',
    title: 'Designer',
    description: 'Creative professional.',
  },
};

// Long content with truncation
export const LongContent: Story = {
  args: {
    name: 'Dr. Maria Rodriguez',
    title: 'Principal Research Scientist',
    description: 'Experienced researcher with over 15 years in artificial intelligence, machine learning, and ethical AI development. Currently leading cross-functional teams to develop responsible AI systems that prioritize fairness, transparency, and human-centered design principles.',
  },
  parameters: {
    docs: {
      description: {
        story: `
This story demonstrates the text truncation and expand functionality.
The description is longer than 150 characters, so it will be truncated
with a "Read More" button to expand the full content.
        `,
      },
    },
  },
};

// Very long name handling
export const LongName: Story = {
  args: {
    name: 'Dr. Maria Elena Rodriguez-Gonzalez-Martinez',
    title: 'Principal Research Scientist & AI Ethics Consultant',
    description: 'Experienced researcher with expertise in artificial intelligence and machine learning.',
  },
};

// Short content
export const ShortContent: Story = {
  args: {
    name: 'John Doe',
    title: 'Developer',
    description: 'Building great software.',
  },
};

// Mobile viewport
export const Mobile: Story = {
  args: {
    name: sampleProfiles.developer.basic.name,
    title: sampleProfiles.developer.basic.title,
    description: sampleProfiles.developer.basic.description,
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
    name: sampleProfiles.developer.basic.name,
    title: sampleProfiles.developer.basic.title,
    description: sampleProfiles.developer.basic.description,
  },
  parameters: {
    viewport: {
      defaultViewport: 'tablet',
    },
  },
};

// Typography showcase
export const TypographyShowcase: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '40px', maxWidth: '600px' }}>
      <div>
        <h3 style={{ marginBottom: '16px', color: '#6B7280' }}>Standard Length</h3>
        <ProfileContent
          name="Alex Johnson"
          title="Senior Full-Stack Developer"
          description="Passionate developer with 8+ years of experience building scalable web applications."
        />
      </div>
      <div>
        <h3 style={{ marginBottom: '16px', color: '#6B7280' }}>Long Content (Truncated)</h3>
        <ProfileContent
          name="Dr. Maria Rodriguez"
          title="Principal Research Scientist"
          description="Experienced researcher with over 15 years in artificial intelligence, machine learning, and ethical AI development. Currently leading cross-functional teams to develop responsible AI systems that prioritize fairness, transparency, and human-centered design principles."
        />
      </div>
      <div>
        <h3 style={{ marginBottom: '16px', color: '#6B7280' }}>Minimal Content</h3>
        <ProfileContent
          name="Sam Smith"
          title="Designer"
          description="Creative professional."
        />
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Showcase of different content lengths and how the component handles them.',
      },
    },
  },
};

// Animation demonstration
export const AnimationDemo: Story = {
  args: {
    name: sampleProfiles.developer.basic.name,
    title: sampleProfiles.developer.basic.title,
    description: sampleProfiles.developer.basic.description,
  },
  parameters: {
    docs: {
      description: {
        story: `
This story demonstrates the staggered animation effects:

1. Name appears first with gradient effect
2. Title follows with a slight delay
3. Description appears last
4. All animations respect reduced motion preferences

Refresh the story to see the entrance animations.
        `,
      },
    },
  },
};

// Accessibility focused
export const AccessibilityFocused: Story = {
  args: {
    name: sampleProfiles.developer.basic.name,
    title: sampleProfiles.developer.basic.title,
    description: 'Experienced researcher with over 15 years in artificial intelligence, machine learning, and ethical AI development. Currently leading cross-functional teams to develop responsible AI systems that prioritize fairness, transparency, and human-centered design principles.',
  },
  parameters: {
    docs: {
      description: {
        story: `
This story highlights accessibility features:

- Proper heading hierarchy (h1 for name, h2 for title)
- ARIA labels and states for expandable content
- Keyboard navigation for expand/collapse
- Screen reader announcements
- Focus management

Test with:
- Tab navigation to the "Read More" button
- Enter or Space key to expand/collapse
- Screen readers for proper announcements
        `,
      },
    },
  },
};
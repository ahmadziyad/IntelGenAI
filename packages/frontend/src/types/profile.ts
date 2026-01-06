// Profile data models for the personal profile section

export interface ProfileData {
  id: string;
  name: string;
  title: string;
  description: string;
  image: {
    src: string;
    alt: string;
    width?: number;
    height?: number;
  };
  contact?: {
    email?: string;
    phone?: string;
    location?: string;
  };
  social?: {
    linkedin?: string;
    github?: string;
    twitter?: string;
    website?: string;
  };
}

export interface ExperienceItem {
  id: string;
  company: string;
  position: string;
  duration: string;
  description: string;
  technologies?: string[];
  client?: string;
}

export interface SkillCategory {
  category: string;
  skills: string[];
  proficiency?: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  description?: string;
}

export interface ProjectItem {
  id: string;
  name: string;
  description: string;
  technologies: string[];
  link?: string;
  demoLink?: string;
  note?: string;
  image?: string;
}

export interface EducationItem {
  id: string;
  institution: string;
  degree: string;
  field: string;
  duration: string;
  description?: string;
}

export interface AchievementItem {
  id: string;
  title: string;
  description: string;
  date: string;
  category?: string;
}

export interface CertificationItem {
  id: string;
  name: string;
  issuer: string;
  date: string;
  link?: string;
  logo?: string;
}

export interface ExtendedProfileData extends ProfileData {
  experience: ExperienceItem[];
  skills: SkillCategory[];
  projects: ProjectItem[];
  education: EducationItem[];
  achievements: AchievementItem[];
  certifications?: CertificationItem[];
}

export interface ProfileStyling {
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    text: string;
    textSecondary: string;
  };
  gradients: {
    primary: string;
    secondary: string;
    background: string;
  };
  typography: {
    fontFamily: string;
    headingFont?: string;
    fontSize: {
      small: string;
      medium: string;
      large: string;
      xlarge: string;
    };
  };
  spacing: {
    small: string;
    medium: string;
    large: string;
    xlarge: string;
  };
  borderRadius: string;
  shadows: {
    small: string;
    medium: string;
    large: string;
  };
}

// Component prop interfaces
export interface ProfileSectionProps {
  profile: ProfileData;
  styling?: ProfileStyling;
  onModalOpen?: () => void;
  onModalClose?: () => void;
  className?: string;
  testId?: string;
}

export interface ProfileCardProps {
  profile: ProfileData;
  styling: ProfileStyling;
  onActionClick?: () => void;
  headingId?: string;
  descriptionId?: string;
}

export interface ProfileImageProps {
  src: string;
  alt: string;
  size?: 'small' | 'medium' | 'large';
  shape?: 'circle' | 'rounded' | 'square';
}

export interface ProfileContentProps {
  name: string;
  title: string;
  description: string;
  styling?: TypographyStyling;
}

export interface TypographyStyling {
  fontFamily: string;
  headingFont?: string;
  fontSize: {
    small: string;
    medium: string;
    large: string;
    xlarge: string;
  };
  colors: {
    text: string;
    textSecondary: string;
  };
}

export interface ActionButtonProps {
  text: string;
  onClick: () => void;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'small' | 'medium' | 'large';
  loading?: boolean;
}

export interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: ExtendedProfileData;
  styling: ProfileStyling;
}

export interface ModalStyling {
  colors: {
    background: string;
    backdrop: string;
    text: string;
    textSecondary: string;
  };
  borderRadius: string;
  shadows: {
    large: string;
  };
  spacing: {
    medium: string;
    large: string;
  };
}
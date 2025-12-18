// Sample profile data for development and testing
import { ProfileData, ExtendedProfileData, ProfileStyling } from '../types/profile';

// Primary sample profile - Full-Stack Developer
export const sampleProfileData: ProfileData = {
  id: 'sample-profile-1',
  name: 'Ahmad Ziyad',
  title: 'Senior Software Engineer/Architect',
  description: '13+ years of experience designing, building, and scaling end-to-end enterprise applications using React, Python, AWS cloud-native enterprise environments. Strong expertise in developing RESTful and event-driven APIs, building responsive and performant user interfaces, and integrating frontend applications with scalable backend services.',
  image: {
    src: '/profile.jpg',
    alt: 'Ahmad Ziyad - Professional headshot',
    width: 400,
    height: 400,
  },
  contact: {
    email: 'ah.ziyad@gmail.com',
    location: 'Winston Salem, NC, United States',
  },
  social: {
    linkedin: 'https://www.linkedin.com/in/ahmadziyad',
    github: 'https://github.com/ahmadziyad',
  },
};

// ... (Other profiles omitted for brevity)

// Extended profile data for the primary sample
// Extended profile data for the primary sample
export const sampleExtendedProfileData: ExtendedProfileData = {
  ...sampleProfileData,
  education: [
    {
      id: 'edu-1',
      institution: 'University at Buffalo',
      degree: 'Master\'s Degree',
      field: 'Management Information Systems',
      duration: 'June 2021 - May 2022',
      description: 'Focus on scaling AI-driven and cloud-based solutions.',
    },
    {
      id: 'edu-2',
      institution: 'Shri Ram Murti Smarak (SRMS) Institutions',
      degree: 'Bachelor of Technology - B.Tech',
      field: 'Information Technology',
      duration: 'July 2007 - June 2011',
      description: '',
    },
  ],
  experience: [
    {
      id: 'exp-1',
      company: 'Royal Cyber Inc.',
      position: 'Senior Software Engineer',
      duration: 'August 2022 - Present',
      description: 'Delivering Enterprise Applications using Python, FastAPI, ReactJS, LLMs for underwriting, compliance, and operations. Built multi-agent RAG systems, reusable agent frameworks, and ingestion pipelines automating decisioning and document analysis, reducing cycle time 40–70%. Led secure AWS deployments, API integrations, and legacy-to-cloud migrations.',
      technologies: ['Python', 'React JS', 'FastAPI', 'AWS Bedrock', 'SageMaker AI', 'Docker', 'Kubernetes', 'Oracle', 'DynamoDB'],
    },
    {
      id: 'exp-2',
      company: 'University at Buffalo',
      position: 'Teaching Assistant',
      duration: 'April 2022 - June 2022',
      description: 'Provided guidance to graduate students on distributed system architecture and cloud computing concepts. Assisted students in application configuration and troubleshooting problems in AWS.',
      technologies: ['AWS', 'Cloud Computing', 'Distributed Systems'],
    },
    {
      id: 'exp-3',
      company: 'Arab Bank',
      position: 'Program Delivery Manager',
      duration: 'May 2018 - June 2021',
      description: 'Architected and implemented secure, automated CI/CD pipelines. Designed and deployed cloud-native AWS applications using Python, ECS, Lambda. Built and optimized end-to-end data pipelines aggregating operational and product metrics.',
      technologies: ['Python', 'AWS', 'Oracle', 'CI/CD', 'Rest APIs'],
    },
    {
      id: 'exp-4',
      company: 'I2S Business Solutions',
      position: 'Senior Software Consultant',
      duration: 'October 2016 - May 2018',
      description: 'Partnered with senior stakeholders to define product roadmap. Led requirements discovery and backlog refinement. Led system integration and optimization initiatives.',
      technologies: ['Agile', 'Product Management', 'System Integration'],
    },
    {
      id: 'exp-5',
      company: 'HCL Technologies',
      position: 'Senior Consultant',
      duration: 'December 2014 - August 2016',
      description: 'Partnered with QA, development, and infrastructure teams to deliver a Process Policy & Procedure Management (PPPM) framework using IBM BPM and IBM WODM. Designed and implemented Business Process Diagrams (BPDs).',
      technologies: ['IBM BPM', 'IBM WODM', 'Agile'],
    },
    {
      id: 'exp-6',
      company: 'Cognizant Technology Solutions',
      position: 'Programming Analyst',
      duration: 'September 2011 - December 2014',
      description: 'Coordinated with business stakeholders and delivery teams to deliver enterprise process automation solutions. Owned end-to-end product delivery and release management.',
      technologies: ['IBM BPM', 'Process Automation', 'Delivery Management'],
    },
  ],
  skills: [
    {
      category: 'Cloud & DevOps',
      skills: ['AWS (Bedrock, SageMaker, Lambda, ECS)', 'Docker', 'Kubernetes', 'Terraform', 'CI/CD', 'Prometheus', 'Grafana'],
      proficiency: 'expert'
    },
    {
      category: 'Backend Development',
      skills: ['Python', 'FastAPI', 'Node.js', 'REST', 'SOAP', 'Microservices', 'Event-Driven Design'],
      proficiency: 'expert'
    },
    {
      category: 'Frontend Development',
      skills: ['React JS', 'JavaScript', 'HTML5', 'CSS3', 'Responsive Design'],
      proficiency: 'advanced'
    },
    {
      category: 'Data & Databases',
      skills: ['Oracle', 'PostgreSQL', 'DynamoDB', 'Redis', 'IBM BAW', 'IBM ODM'],
      proficiency: 'advanced'
    },
  ],
  projects: [
    {
      id: 'proj-1',
      name: 'IntelGenAI Platform',
      description: 'A modular generative AI platform with agent capabilities.',
      technologies: ['React', 'Node.js', 'LangChain'],
      link: 'https://github.com/intelgenai/platform',
      image: '/projects/intelgen.jpg'
    },
    {
      id: 'proj-2',
      name: 'IntelGen Studio',
      description: 'Interactive AI chat interface with advanced conversation capabilities, real-time responses, and intelligent context management.',
      technologies: ['React', 'TypeScript', 'WebSocket', 'AI/ML APIs'],
      link: '#intelligen-studio',
      image: '/projects/studio.jpg'
    }
  ],
  achievements: [
    {
      id: 'ach-1',
      title: 'AWS Certified Solutions Architect – Associate',
      description: 'Validates ability to design and deploy scalable, highly available, and fault-tolerant systems on AWS.',
      date: '2025-2028',
      category: 'Certification',
    },
    {
      id: 'ach-2',
      title: 'Oracle Cloud Infrastructure - Certified Generative AI Professional',
      description: 'Certification for implementing Generative AI solutions on OCI.',
      date: '2025-2027',
      category: 'Certification',
    },
  ],
  certifications: [
    {












      id: 'cert-1',
      name: 'AWS Certified Solutions Architect – Associate',
      issuer: 'Amazon Web Services',
      date: '2025 - 2028',
      link: 'https://www.credly.com/badges/434e0060-decf-4004-a203-b348ce45bc3a',
      logo: 'https://images.credly.com/size/680x680/images/0e284c3f-5164-4b21-8660-0d84737941bc/image.png'
    },
    {
      id: 'cert-2',
      name: 'Certified AI Practitioner - AWS',
      issuer: 'Oracle',
      date: '2025 - 2027',
      link: 'https://www.credly.com/badges/7ce75189-ba1e-41e9-9838-58eebba0cf45',
      logo: 'https://images.credly.com/size/680x680/images/4d4693bb-530e-4bca-9327-de07f3aa2348/image.png'
    },
    {
      id: 'cert-3',
      name: 'OCI Certified Generative AI Professional - Oracle',
      issuer: 'Amazon Web Services',
      date: '2024 - 2027',
      link: 'https://catalog-education.oracle.com/ords/certview/sharebadge?id=81D1A41B779031CF40494CCD0223D4BE774A703453A326F142DB88EE7D1D0615',
      logo: 'https://brm-workforce.oracle.com/pdf/certview/images/OCI25GAIOCP.png'
    }
    ,
    {

      id: 'cert-4',
      name: 'Oracle Cloud Infrastructure 2025 Certified AI Foundations Associate',
      issuer: 'Amazon Web Services',
      date: '2024 - 2027',
      link: 'https://catalog-education.oracle.com/ords/certview/sharebadge?id=6A420C1195839CAC3BB2C6EAB86497DB487D265E80EBD0FEC24A7C552E733D0E',
      logo: 'https://brm-workforce.oracle.com/pdf/certview/images/OCI25AICFAV1.png'
    },

    {
      id: 'cert-5',
      name: 'AWS Certified AI Practitioner',
      issuer: 'Amazon Web Services',
      date: '2024 - 2027',
      link: 'https://aws.amazon.com/certification/certified-ai-practitioner/',
      logo: 'https://d1.awsstatic.com/training-and-certification/certification-badges/AWS-Certified-AI-Practitioner_badge.png'
    }
    ,
    {
      id: 'cert-6',
      name: 'Project Management Professional (PMP)',
      issuer: 'Project Management Institute',
      date: '2023 - 2026',
      link: 'https://www.pmi.org/certifications/project-management-pmp',
      logo: 'https://www.pmi.org/-/media/pmi/microsites/cert-redesign/images/logos/pmp.png'
    },
    {
      id: 'cert-7',
      name: 'PMI Agile Certified Practitioner (PMI-ACP)',
      issuer: 'Project Management Institute',
      date: '2023 - 2026',
      link: 'https://www.pmi.org/certifications/agile-acp',
      logo: 'https://www.pmi.org/-/media/pmi/microsites/cert-redesign/images/logos/acp.png'
    },
    {
      id: 'cert-8',
      name: 'Oracle Cloud Infrastructure 2025 Certified AI Foundations Associate',
      issuer: 'Oracle',
      date: '2024 - 2027',
      link: 'https://catalog-education.oracle.com/ords/certview/sharebadge?id=6A420C1195839CAC3BB2C6EAB86497DB487D265E80EBD0FEC24A7C552E733D0E',
      logo: 'https://brm-workforce.oracle.com/pdf/certview/images/OCI25AICFAV1.png'
    },
    {
      id: 'cert-9',
      name: 'Oracle Cloud Infrastructure 2025 Certified AI Foundations Associate',
      issuer: 'Oracle',
      date: '2024 - 2027',
      link: 'https://catalog-education.oracle.com/ords/certview/sharebadge?id=6A420C1195839CAC3BB2C6EAB86497DB487D265E80EBD0FEC24A7C552E733D0E',
      logo: 'https://brm-workforce.oracle.com/pdf/certview/images/OCI25AICFAV1.png'
    },
  ],
};

// Default styling configuration
export const defaultProfileStyling: ProfileStyling = {
  colors: {
    primary: '#3B82F6', // Blue-500
    secondary: '#8B5CF6', // Violet-500
    accent: '#F59E0B', // Amber-500
    background: '#FFFFFF',
    text: '#1F2937', // Gray-800
    textSecondary: '#6B7280', // Gray-500
  },
  gradients: {
    primary: 'linear-gradient(135deg, #3B82F6 0%, #8B5CF6 100%)',
    secondary: 'linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%)',
    background: 'linear-gradient(135deg, #F8FAFC 0%, #F1F5F9 100%)',
  },
  typography: {
    fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    headingFont: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    fontSize: {
      small: '0.875rem', // 14px
      medium: '1rem', // 16px
      large: '1.25rem', // 20px
      xlarge: '1.875rem', // 30px
    },
  },
  spacing: {
    small: '0.5rem', // 8px
    medium: '1rem', // 16px
    large: '1.5rem', // 24px
    xlarge: '2rem', // 32px
  },
  borderRadius: '0.75rem', // 12px
  shadows: {
    small: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
    medium: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    large: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
  },
};

// Dark theme styling configuration
export const darkProfileStyling: ProfileStyling = {
  colors: {
    primary: '#60A5FA', // Blue-400
    secondary: '#A78BFA', // Violet-400
    accent: '#FBBF24', // Amber-400
    background: '#1F2937', // Gray-800
    text: '#F9FAFB', // Gray-50
    textSecondary: '#D1D5DB', // Gray-300
  },
  gradients: {
    primary: 'linear-gradient(135deg, #60A5FA 0%, #A78BFA 100%)',
    secondary: 'linear-gradient(135deg, #A78BFA 0%, #F472B6 100%)',
    background: 'linear-gradient(135deg, #1F2937 0%, #374151 100%)',
  },
  typography: {
    fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    headingFont: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    fontSize: {
      small: '0.875rem',
      medium: '1rem',
      large: '1.25rem',
      xlarge: '1.875rem',
    },
  },
  spacing: {
    small: '0.5rem',
    medium: '1rem',
    large: '1.5rem',
    xlarge: '2rem',
  },
  borderRadius: '0.75rem',
  shadows: {
    small: '0 1px 3px 0 rgba(0, 0, 0, 0.3), 0 1px 2px 0 rgba(0, 0, 0, 0.2)',
    medium: '0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -1px rgba(0, 0, 0, 0.2)',
    large: '0 20px 25px -5px rgba(0, 0, 0, 0.4), 0 10px 10px -5px rgba(0, 0, 0, 0.3)',
  },
};

// Minimal styling configuration for testing
export const minimalProfileStyling: ProfileStyling = {
  colors: {
    primary: '#000000',
    secondary: '#666666',
    accent: '#999999',
    background: '#FFFFFF',
    text: '#000000',
    textSecondary: '#666666',
  },
  gradients: {
    primary: 'linear-gradient(135deg, #000000 0%, #666666 100%)',
    secondary: 'linear-gradient(135deg, #666666 0%, #999999 100%)',
    background: 'linear-gradient(135deg, #FFFFFF 0%, #F5F5F5 100%)',
  },
  typography: {
    fontFamily: 'Arial, sans-serif',
    fontSize: {
      small: '12px',
      medium: '14px',
      large: '16px',
      xlarge: '20px',
    },
  },
  spacing: {
    small: '4px',
    medium: '8px',
    large: '12px',
    xlarge: '16px',
  },
  borderRadius: '4px',
  shadows: {
    small: '0 1px 2px rgba(0, 0, 0, 0.1)',
    medium: '0 2px 4px rgba(0, 0, 0, 0.1)',
    large: '0 4px 8px rgba(0, 0, 0, 0.1)',
  },
};

// Collection of all sample profiles for easy access
export const sampleProfiles = {
  developer: {
    basic: sampleProfileData,
    extended: sampleExtendedProfileData,
  }
};

// Styling configurations collection
export const profileStylings = {
  default: defaultProfileStyling,
  dark: darkProfileStyling,
  minimal: minimalProfileStyling,
};

// Export default profile for backward compatibility
export default sampleProfileData;
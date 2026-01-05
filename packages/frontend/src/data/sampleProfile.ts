// Sample profile data for development and testing
import { ProfileData, ExtendedProfileData, ProfileStyling } from '../types/profile';

// Primary sample profile - Full-Stack Developer
export const sampleProfileData: ProfileData = {
  id: 'sample-profile-1',
  name: 'Ahmad Ziyad',
  title: 'AI Software Engineer/Architect',
  description: 'Accomplished AI Software Engineer and enterprise solution architect with 13+ years of experience designing, building, and scaling end-to-end enterprise applications across cloud-native and hybrid environments. Proven expertise in developing intelligent automation solutions using Python, AWS, and cutting-edge AI/ML technologies including RAG-based applications, multi-agent workflows, and LLM integrations. Led modernization initiatives that reduced processing times by 40-70% while ensuring regulatory compliance and enterprise security. Expert in microservices architecture, event-driven systems, and DevOps practices with hands-on leadership in AWS cloud transformations, containerized deployments, and data pipeline optimization. Strong advocate of Agile delivery methodologies with demonstrated success in cross-functional team leadership, stakeholder management, and delivering mission-critical solutions for Fortune 500 clients in financial services, insurance, and banking sectors.',
  image: {
    src: '/profile.jpg',
    alt: 'Ahmad Ziyad - Professional headshot',
    width: 400,
    height: 500,
  },
  contact: {
    email: 'ah.ziyad@gmail.com',
    location: 'Charlotte, NC, USA',
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
      description: 'Expertise: Statistical Analytics, Technology and Innovation Mgmt., Predictive Analytics, Enterprise Models',
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
      position: 'AI Software Engineer',
      duration: 'August 2022 - Present',
      client: 'Essent Guaranty Inc - Leading mortgage insurance and title services provider in the United States, offering credit risk solutions, underwriting support, and mortgage insurance products to financial institutions.',
      description: 'Designed and optimized event-driven architectures using Python on AWS, enabling seamless integrations between underwriting, pricing, and credit-risk systems using Lambda, EventBridge, API Gateway, and microservices-based patterns. Implemented AWS Data Wrangler-based pipelines to improve data ingestion, transformation, and analytics workflows supporting MIU, CPRM, and pricing governance use cases. Led modernization of enterprise workflows by refactoring BPMN processes and BRMS rules into cloud-native services, improving automation, scalability, and compliance across key mortgage insurance functions. Delivered end-to-end integration of the Edge3 credit reporting services with TransUnion, migrating from legacy systems to AWS-based APIs using Lambda and Python while ensuring high reliability and business continuity. Designed and implemented an Underwriting Decision Support Agent using AWS RAG, MCP agents, Python, Jupyter Notebook, enabling underwriters to instantly retrieve relevant guidelines, policies, and historical decisions — reducing underwriting review time by 40% and improving decision consistency across regions. Developed an automated Closing & Escrow document validation system using RAG retrieval and multi-agent workflows to cross-check closing instructions, legal descriptions, payoffs, and signatures — decreasing post-closing defects by 60% and accelerating funding timelines. Implemented an MCP agent network for Automated Historical Title Chain Extraction, integrating OCR, SLM reasoning, and retrieval across decades of scanned deeds, liens, and mortgages — reducing title search and exam effort by 70% and minimizing human error in chain-of-title reconstruction.',
      technologies: ['Python', 'TensorFlow', 'Keras', 'RAG', 'MemCached', 'AWS', 'Glue', 'Redshift', 'Microservices', 'FastAPI', 'REST', 'SOAP', 'Docker', 'Kubernetes', 'Git', 'Data Pipelines', 'oAuth', 'DynamoDB', 'Vector databases', 'Embedding models', 'Strand Agents SDK', 'MCP', 'Agentic AI', 'Prometheus', 'Grafana', 'Dynatrace'],
    },
    {
      id: 'exp-2',
      company: 'Arab Bank',
      position: 'IT Senior Developer',
      duration: 'May 2018 - June 2021',
      client: 'Arab Bank Plc - Jordanian bank that is one of the largest financial institutions in the Middle East, operates as a universal bank that serves clients in more than 600 branches.',
      description: 'Architected and implemented secure, automated CI/CD pipelines using Azure DevOps and GitLab, integrating code quality, vulnerability scanning, compliance validation within deployment stage. Designed and deployed cloud-native applications on AWS leveraging Python, ECS, Lambda, CloudFormation, and API Gateway, enabling high availability, scalability, and fault tolerance. Collaborated with business owners and stakeholders for creating milestones, roadmap, requirement analysis, risk remedial action and enterprise digital transformation by developing a comprehensive delivery plan resulting in improving process efficiency by 45%. Administered user, group, and process access controls across IBM BAW, ODM Decision Server, and WebSphere (WAS), including SSL certificate lifecycle management, server maintenance, and automated snapshot cleanup to ensure secure and stable platform operations. Configured and maintained Apache HTTP Server environments, collaborating with network teams for VIP setup, firewall rule updates, and traffic routing to support high-availability and compliant enterprise applications. Delivered scalable backend services and API gateways that support high-volume client applications with stringent SLAs. Collaborated with infrastructure and DevOps teams to configure and maintain application servers optimizing runtime environments. Provided regular and timely feedback to team members and clients, follow up for troubleshooting and fixes ensured standard SLAs were met, leading to process improvement.',
      technologies: ['Python', 'Data Modeling', 'System Architecture', 'Microservices', 'REST/ OpenAPI', 'Event-Driven Design', 'Systems Integration', 'DB2', 'Oracle', 'SOA', 'Jira', 'Splunk'],
    },
    {
      id: 'exp-3',
      company: 'I2S Business Solutions',
      position: 'Senior Software Consultant',
      duration: 'October 2016 - May 2018',
      client: 'Arab Bank Plc',
      description: 'Collaborated with business owners and stakeholders for creating milestones, roadmap, requirement analysis, risk remedial action and enterprise digital transformation by developing a comprehensive delivery plan resulting in improving process efficiency by 45%. Collaborated with infrastructure and DevOps teams to configure and maintain applications, optimizing runtime environments. Administered user, group, and process access controls across Business Automation Workflow, Decision Management tools, and WebSphere (WAS), including SSL certificate lifecycle management, server maintenance, and automated snapshot cleanup to ensure secure and stable platform operations. Configured and maintained Apache HTTP Server environments, collaborating with network teams for VIP setup, firewall rule updates, and traffic routing to support high-availability and compliant enterprise applications. Delivered scalable backend services and API gateways that support high-volume client applications with stringent SLAs. Teamed with PMO, infrastructure team, and technical architects to identify critical paths, bottlenecks, risks by designing robust and scalable solutions resulting in improving customer experience and business values.',
      technologies: ['Java', 'Python', 'WODM', 'AS400', 'IBM Integrations', 'DataPower', 'Message Queue', 'DB2', 'Oracle'],
    },
    {
      id: 'exp-4',
      company: 'HCL Technologies',
      position: 'Senior Consultant',
      duration: 'December 2014 - August 2016',
      client: 'Boeing - American multinational corporation.',
      description: 'Worked closely with QA, development, and infrastructure teams for a process policy and procedure management framework (PPPM) using IBM BPM, IBM WODM, change management, configuration update, troubleshooting, release management, and improving code quality, leading process improvement. Captured milestones through detailed IT work plans, schedules, estimates, resource plans, and status reports. Executed migration of critical processes by introducing new architecture and understanding technical and business requirements. Authored technical documentation, process guides, and compliance-driven audit artifacts to ensure traceability, transparency, and stakeholder confidence in rule-based decisions. Worked as an agile coach, defined technical requirements, user stories and acceptance criteria, created database and workflow for catalog, policies, procedures, and process management.',
      technologies: ['Java', 'IBM BAW', 'WODM', 'Integration Designer', 'DB2', 'Oracle'],
    },
    {
      id: 'exp-5',
      company: 'Cognizant Technology Solutions',
      position: 'Programming Analyst',
      duration: 'September 2011 - December 2014',
      client: 'Barclays Bank - Universal banking offering personal and business accounts, loans, mortgages, and savings accounts in both the UK and the US.',
      description: 'Coordinated with onsite customers for UK leading bank and offshore team to code, develop and deploy snapshots and rules, supported UAT, process and data migration, go-live activities, incident response resulting in high user satisfaction and risk mitigation. Monitored and managed applications, and services within environments, participated in on-call rotation, root cause analysis, took action to resolve issues and implemented strategies preventing future occurrences reducing security incidents by 40%.',
      technologies: ['Unix', 'IBM BAW', 'WODM', 'Integration Designer', 'DB2', 'Oracle'],
    },
  ],
  skills: [
    {
      category: 'Full-Stack Development',
      skills: ['JavaScript', 'Python', 'Java', 'PL/SQL', 'REST / OpenAPI consumption', 'RESTful APIs', 'API Integration', 'Microservices', 'Event-Driven Systems', 'Messaging Systems', 'Data Visualization (Tableau – consumer side)', 'IBM WebSphere', 'WebSphere SOA', 'IBM BAW', 'IBM ODM', 'Rule Designer'],
      proficiency: 'expert',
      description: '13+ years developing end-to-end enterprise applications. Built scalable APIs, microservices architectures, and event-driven systems. Extensive experience with middleware platforms for business process automation and rule management.'
    },
    {
      category: 'Cloud & DevOps',
      skills: ['AWS (Lambda, S3, EC2, RDS, DynamoDB, API Gateway)', 'CloudFormation', 'Serverless Architecture', 'CI/CD Pipelines', 'Git, SVN', 'Docker', 'Kubernetes (K8s)', 'Helm', 'Terraform', 'CloudWatch', 'GuardDuty', 'GuardRails', 'Macie', 'Secrets Manager', 'Cloud Transformation', 'Cloud Migration', 'CloudOps', 'Infrastructure Audits'],
      proficiency: 'expert',
      description: 'Expert in AWS cloud-native solutions with hands-on experience in serverless architectures, containerization, and infrastructure as code. Led multiple cloud transformation initiatives, implementing robust CI/CD pipelines and comprehensive monitoring solutions.'
    },
    {
      category: 'AI, ML & Intelligent Automation',
      skills: ['TensorFlow', 'PyTorch', 'Keras', 'Hugging Face', 'OpenAI', 'Claude', 'Gemini', 'Amazon Bedrock', 'SageMaker AI', 'Nvidia NIM', 'RAG-based Applications', 'LangChain', 'MLOps', 'Embedding Models', 'Vector Databases', 'Strand Agents SDK', 'MCP', 'A2A', 'Workflow Orchestration', 'Intelligent Process Automation'],
      proficiency: 'expert',
      description: 'Leading AI/ML initiatives with focus on generative AI and intelligent automation. Built RAG-based applications, implemented MLOps pipelines, and developed AI agents using modern frameworks. Expertise in vector databases, embedding models, and enterprise AI integration.'
    },
    {
      category: 'Databases & Data Platforms',
      skills: ['SQL', 'Oracle', 'DB2', 'Data Modeling', 'Data Architecture', 'AWS Glue', 'AWS Data Wrangler', 'Vector Databases', 'Embedding Stores'],
      proficiency: 'advanced',
      description: 'Extensive experience in database design, optimization, and data architecture. Worked with enterprise-grade databases including Oracle and DB2. Recently focused on modern data platforms including vector databases for AI/ML applications and AWS data services.'
    },
    {
      category: 'Platform & Architecture',
      skills: ['Cloud-Native Solutions', 'SOA (Service-Oriented Architecture)', 'Systems Integration', 'Scalability & High Availability Design', 'Platform Governance', 'Product Delivery Platforms', 'Workflow Orchestration'],
      proficiency: 'expert',
      description: 'Architected enterprise-scale platforms with focus on scalability, high availability, and performance. Led system integration projects connecting diverse enterprise systems. Designed governance frameworks for platform standardization and delivery excellence.'
    },
    {
      category: 'Agile & Delivery Management',
      skills: ['Scrum', 'Kanban', 'Sprint Planning', 'Retrospectives', 'Product Ownership', 'Backlog Management (Azure DevOps, Jira)', 'Requirements Gathering', 'Continuous Delivery', 'Cross-Team Coordination', 'Agile Process Improvement'],
      proficiency: 'advanced',
      description: 'Experienced Scrum Master and Product Owner with proven track record in agile transformations. Led cross-functional teams, facilitated sprint ceremonies, and implemented continuous delivery practices. Expertise in backlog management and stakeholder alignment.'
    },
    {
      category: 'Governance, Security & Quality',
      skills: ['Secure Coding (SonarQube)', 'Performance Optimization', 'Compliance Readiness', 'Audit & Risk Management', 'Regulatory Readiness', 'DevSecOps', 'Monitoring & Logging Automation'],
      proficiency: 'advanced',
      description: 'Strong focus on security-first development practices and compliance frameworks. Implemented DevSecOps pipelines, conducted security audits, and established monitoring solutions. Experience with regulatory compliance and risk management in enterprise environments.'
    },
    {
      category: 'Leadership & Collaboration',
      skills: ['Stakeholder Management', 'Executive Stakeholder Communication', 'Client Engagement', 'Vendor Coordination', 'Cross-Functional Team Leadership', 'Delivery Governance', 'Change Management', 'Team Mentorship', 'Technical Mentorship'],
      proficiency: 'advanced',
      description: 'Proven leadership in managing complex technical projects and cross-functional teams. Experienced in executive communication, client relationship management, and vendor coordination. Passionate about mentoring junior developers and driving technical excellence.'
    },
    {
      category: 'Professional Growth & Innovation',
      skills: ['Continuous Learning', 'Process Improvement', 'Emerging Technology Exploration', 'Digital Transformation', 'Data Analytics Collaboration'],
      proficiency: 'advanced',
      description: 'Committed to continuous learning and staying current with emerging technologies. Led digital transformation initiatives, implemented process improvements, and fostered innovation culture. Active in technology communities and knowledge sharing.'
    }
  ],
  projects: [
    {
      id: 'proj-1',
      name: 'NASA MCP Server',
      description: 'A practical tutorial for building Model Context Protocol (MCP) servers using NASA\'s public APIs. Demonstrates MCP server architecture, API integration, authentication handling, and integration with AI assistants like Claude Desktop. Features tools for accessing NASA\'s Astronomy Picture of the Day and image search capabilities.',
      technologies: ['TypeScript', 'Node.js', 'MCP SDK', 'NASA APIs', 'Claude Desktop Integration', 'REST APIs'],
      link: 'https://github.com/ahmadziyad/NASA-MCP-Demo',
      image: '/projects/nasa-mcp.jpg'
    },
    {
      id: 'proj-2',
      name: 'Voice Calculator',
      description: 'Prompt-Based Calculator with dual interface - Use traditional calculator buttons or natural language chat commands. Features real-time synchronization between interfaces, NLP-powered calculation parsing (e.g., "Add 5 and 10"), and a FastAPI backend for high-performance computation. Modern responsive design with dark theme.',
      technologies: ['Python', 'FastAPI', 'Uvicorn', 'HTML5', 'CSS3', 'JavaScript', 'NLP'],
      link: 'https://github.com/ahmadziyad/VoiceCalculator',
      image: '/projects/voice-calculator.jpg'
    },
    {
      id: 'proj-3',
      name: 'IntelGen Studio',
      description: 'Interactive AI chat interface with advanced conversation capabilities, real-time responses, and intelligent context management.',
      technologies: ['React', 'TypeScript', 'WebSocket', 'AI/ML APIs'],
      link: '#intelligen-studio',
      image: '/projects/studio.png'
    },
    {
      id: 'proj-4',
      name: 'Pet Adoptions',
      description: 'Smart Pet Adoption Platform - A comprehensive web application that connects pet lovers with adoptable animals. Features advanced search filters, pet matching algorithms, adoption application management, and real-time messaging between adopters and shelters.',
      technologies: ['React', 'Node.js', 'MongoDB', 'Express.js', 'Socket.io', 'JWT Authentication', 'Cloudinary', 'Material-UI'],
      link: 'https://github.com/ahmadziyad/PetAdoptions',
      image: '/projects/pet-adoptions.jpg'
    },
    {
      id: 'proj-5',
      name: 'HealthcareTrial',
      description: 'Healthcare Management System - A comprehensive healthcare platform designed to streamline patient management, appointment scheduling, and medical record keeping. Features secure patient data handling, doctor-patient communication, and integrated billing systems.',
      technologies: ['React', 'Node.js', 'Express.js', 'MongoDB', 'JWT Authentication', 'Material-UI', 'Chart.js', 'Socket.io'],
      link: 'https://github.com/ahmadziyad/HealthcareTrial',
      image: '/projects/healthcare-trial.jpg'
    },
    {
      id: 'proj-6',
      name: 'Property Risk Insight',
      description: 'Property Risk Assessment Platform - An intelligent system for analyzing and evaluating property investment risks. Features comprehensive risk scoring algorithms, market trend analysis, financial projections, and detailed property assessment reports for informed investment decisions.',
      technologies: ['React', 'Node.js', 'Python', 'Machine Learning', 'TensorFlow', 'MongoDB', 'Express.js', 'Chart.js', 'Material-UI'],
      link: 'https://github.com/ahmadziyad/PropertyRiskInsight',
      image: '/projects/property-risk-insight.jpg'
    },
    {
      id: 'proj-7',
      name: 'Property Title Chain',
      description: 'Blockchain-based Property Title Management - A secure and transparent property title tracking system using blockchain technology. Features immutable title records, ownership verification, transaction history tracking, and smart contract integration for property transfers.',
      technologies: ['React', 'Node.js', 'Blockchain', 'Ethereum', 'Solidity', 'Web3.js', 'MongoDB', 'Express.js', 'Material-UI'],
      link: 'https://github.com/ahmadziyad/TitleChain',
      image: '/projects/property-title-chain.png'
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
      issuer: 'Amazon Web Services',
      date: '2025 - 2028',
      link: 'https://www.credly.com/badges/7ce75189-ba1e-41e9-9838-58eebba0cf45',
      logo: 'https://images.credly.com/size/680x680/images/4d4693bb-530e-4bca-9327-de07f3aa2348/image.png'
    },
    {
      id: 'cert-3',
      name: 'OCI Certified Generative AI Professional',
      issuer: 'Oracle',
      date: '2025 - 2027',
      link: 'https://catalog-education.oracle.com/ords/certview/sharebadge?id=81D1A41B779031CF40494CCD0223D4BE774A703453A326F142DB88EE7D1D0615',
      logo: 'https://brm-workforce.oracle.com/pdf/certview/images/OCI25GAIOCP.png'
    },
    {
      id: 'cert-4',
      name: 'Oracle Cloud Infrastructure 2025 Certified AI Foundations Associate',
      issuer: 'Oracle',
      date: '2025 - 2027',
      link: 'https://catalog-education.oracle.com/ords/certview/sharebadge?id=6A420C1195839CAC3BB2C6EAB86497DB487D265E80EBD0FEC24A7C552E733D0E',
      logo: 'https://brm-workforce.oracle.com/pdf/certview/images/OCI25AICFAV1.png'
    },
    {
      id: 'cert-5',
      name: 'Agile Certified Practitioner (PMI-ACP)',
      issuer: 'Project Management Institute',
      date: '2024 - 2027',
      link: 'https://www.credly.com/badges/f89f5539-ee69-48db-9570-b0e0395c4a59',
      logo: 'https://images.credly.com/size/680x680/images/884f1605-f439-4b0d-ba7c-76a921266d45/blob'
    },
    {
      id: 'cert-6',
      name: 'Building LLM Applications with Prompt Engineering',
      issuer: 'NVIDIA',
      date: '2024 - Present',
      link: 'https://learn.nvidia.com/certificates?id=4KjzEb0YSM653L_-U8bLRA#',
      logo: 'https://learn.nvidia.com/img/nvidia_logo.svg'
    },
    {
      id: 'cert-7',
      name: 'Enterprise Design Thinking Co-Creator',
      issuer: 'IBM',
      date: '2024 - Present',
      link: 'https://www.credly.com/badges/cd6b3d67-5382-4359-89fa-784b5e257f7b',
      logo: 'https://images.credly.com/size/680x680/images/2700b813-82b8-4232-9b36-5dcd5cd24584/Badges_v8-08_Co-Creator.png'
    },
    {
      id: 'cert-8',
      name: 'Project Management Professional (PMP)',
      issuer: 'Project Management Institute',
      date: '2024 - 2027',
      link: 'https://www.credly.com/badges/4fd2c3d0-1a02-4c1b-915c-8d685f8ff265',
      logo: 'https://images.credly.com/size/680x680/images/731e7ef4-9b0c-4d7b-ab65-23cc699c0aa3/blob'
    },
    {
      id: 'cert-9',
      name: 'Azure Fundamentals',
      issuer: 'Microsoft',
      date: '2024 - Present',
      link: 'https://www.credly.com/badges/f89faaf1-990d-4256-9e37-2583e5691eb0',
      logo: 'https://images.credly.com/size/680x680/images/be8fcaeb-c769-4858-b567-ffaaa73ce8cf/image.png'
    }
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
import { KnowledgeEntry } from '@intelligenai/shared';
import { knowledgeBaseService, KnowledgeBaseService } from './knowledgeBaseService';
import { logger } from '../utils/logger';

export class ProfileKnowledgeService {
    /**
     * Seed the knowledge base with profile-specific entries
     */
    seedProfileKnowledge(targetService?: KnowledgeBaseService): void {
        const service = targetService || knowledgeBaseService;
        const profileEntries: Array<Omit<KnowledgeEntry, 'id' | 'lastUpdated'>> = [
            // General/About Ahmad Ziyad
            {
                category: 'faq',
                question: 'Who is Ahmad Ziyad?',
                answer: 'Ahmad Ziyad is a Technical Product Manager/AI Software Engineer/Architect with over 13 years of experience. He specializes in designing, building, and scaling end-to-end enterprise applications using React, Python, and AWS cloud-native technologies. He has strong expertise in RESTful/event-driven APIs and multi-agent RAG systems.',
                keywords: ['ahmad ziyad', 'who is', 'background', 'profile', 'experience']
            },
            {
                category: 'faq',
                question: 'What is Ahmad Ziyad\'s current role?',
                answer: 'Ahmad is currently a AI Software Engineer at Royal Cyber Inc. (since August 2022), where he delivers enterprise applications using Python, FastAPI, and React. He has significantly reduced decisioning cycle times by 40-70% through AI-driven automation and RAG systems.',
                keywords: ['current role', 'company', 'royal cyber', 'position', 'job']
            },

            // Skills
            {
                category: 'faq',
                question: 'What are Ahmad Ziyad\'s technical skills?',
                answer: 'Ahmad has expert proficiency in: \n- Cloud & DevOps: AWS (Bedrock, SageMaker, Lambda, ECS), Docker, Kubernetes, Terraform, CI/CD.\n- Backend: Python, FastAPI, Node.js, REST/SOAP, Microservices.\n- Frontend: React JS, JavaScript, HTML5/CSS3.\n- Databases: Oracle, PostgreSQL, DynamoDB, Redis.',
                keywords: ['skills', 'technologies', 'tech stack', 'expert', 'backend', 'frontend', 'cloud', 'devops', 'aws']
            },
            {
                category: 'faq',
                question: 'Does Ahmad Ziyad have experience with AI or LLMs?',
                answer: 'Yes, Ahmad has extensive experience with AI. At Royal Cyber, he built multi-agent RAG systems, reusable agent frameworks, and ingestion pipelines using AWS Bedrock and SageMaker. He is also an OCI Certified Generative AI Professional and an AWS Certified AI Practitioner.',
                keywords: ['ai', 'llm', 'rag', 'generative ai', 'bedrock', 'sagemaker', 'agents']
            },

            // Experience
            {
                category: 'faq',
                question: 'Tell me about Ahmad Ziyad\'s professional experience',
                answer: 'Ahmad has held several senior roles:\n1. AI Software Engineer at Royal Cyber Inc. (AWS, Python, AI/ML)\n2. Program Delivery Manager at Arab Bank (AWS, Python, CI/CD)\n3. AI Software Consultant at I2S Business Solutions (Agile, Product Management)\n4. Senior Consultant at HCL Technologies (IBM BPM/WODM)\n5. Programming Analyst at Cognizant (Process Automation)',
                keywords: ['experience', 'work history', 'career', 'past roles', 'companies', 'arab bank', 'hcl', 'cognizant']
            },

            // Education
            {
                category: 'faq',
                question: 'What is Ahmad Ziyad\'s educational background?',
                answer: 'Ahmad holds a Master\'s Degree in Management Information Systems from the University at Buffalo (2021-2022) with a focus on scaling AI-driven solutions. He also has a Bachelor of Technology in Information Technology from SRMS Institutions (2007-2011).',
                keywords: ['education', 'degree', 'university', 'buffalo', 'master', 'bachelor', 'college']
            },

            // Projects
            {
                category: 'faq',
                question: 'What projects has Ahmad Ziyad worked on?',
                answer: 'Key projects include:\n- IntelGenAI Platform: A modular generative AI platform with agent capabilities using React, Node.js, and LangChain.\n- IntelGen Studio: An interactive AI chat interface with real-time responses and intelligent context management.',
                keywords: ['projects', 'portfolio', 'intelgenai', 'studio', 'work examples']
            },

            // Certifications
            {
                category: 'faq',
                question: 'What certifications does Ahmad Ziyad hold?',
                answer: 'Ahmad is highly certified, including:\n- AWS Certified Solutions Architect – Associate (2025-2028)\n- OCI Certified Generative AI Professional (2025-2027)\n- AWS Certified AI Practitioner (2024-2027)\n- Project Management Professional (PMP)\n- PMI Agile Certified Practitioner (PMI-ACP)',
                keywords: ['certifications', 'certs', 'aws certified', 'pmp', 'pmi', 'oci', 'professional']
            },

            // Contact/Location
            {
                category: 'faq',
                question: 'How can I contact Ahmad Ziyad?',
                answer: 'You can reach Ahmad via email at ah.ziyad@gmail.com. He is based in Winston Salem, NC, United States. You can also find him on LinkedIn (linkedin.com/in/ahmadziyad) and GitHub (github.com/ahmadziyad).',
                keywords: ['contact', 'email', 'linkedin', 'github', 'location', 'reach', 'social']
            }
        ];

        logger.info('Seeding profile knowledge base...');
        service.bulkImport(profileEntries);
        logger.info('Profile knowledge base seeded successfully');
    }
}

export const profileKnowledgeService = new ProfileKnowledgeService();

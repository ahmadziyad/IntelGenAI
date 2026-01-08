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
                answer: 'Ahmad Ziyad is a Technical Product Manager/AI Software Engineer/Architect with 13+ years of experience in enterprise software development. He specializes in AI/ML solutions, AWS cloud architecture, and full-stack development. Based in Charlotte, NC, USA.\n\nContact: ah.ziyad@gmail.com\nLinkedIn: https://www.linkedin.com/in/ahmadziyad\nGitHub: https://github.com/ahmadziyad\n\n💡 Feel free to contact Ahmad for a full demo and backend overview.',
                keywords: ['ahmad ziyad', 'who is', 'background', 'profile', 'experience', 'about']
            },
            {
                category: 'faq',
                question: 'What is Ahmad Ziyad\'s current role?',
                answer: 'Ahmad is currently an AI Software Engineer at Royal Cyber Inc. (Client: Essent Guaranty Inc) since August 2022. He designs event-driven architectures using Python on AWS, implements RAG-based applications, and has reduced processing times by 40-70% through intelligent automation.\n\nKey achievements:\n- Built Underwriting Decision Support Agent using AWS RAG\n- Developed automated document validation systems\n- Implemented MCP agent networks for title chain extraction\n\nLinkedIn: https://www.linkedin.com/in/ahmadziyad',
                keywords: ['current role', 'company', 'royal cyber', 'essent guaranty', 'position', 'job', 'ai engineer']
            },

            // Skills & Technologies
            {
                category: 'faq',
                question: 'What are Ahmad Ziyad\'s technical skills?',
                answer: 'Ahmad has expert-level proficiency in:\n\n🤖 AI/ML & Intelligent Automation:\n- TensorFlow, PyTorch, Keras, Hugging Face\n- RAG-based Applications, LangChain, MLOps\n- AWS Bedrock, SageMaker AI, Vector Databases\n- Multi-agent workflows, MCP (Model Context Protocol)\n\n☁️ Cloud & DevOps (Expert):\n- AWS: Lambda, S3, EC2, RDS, DynamoDB, API Gateway\n- Docker, Kubernetes, Terraform, CI/CD Pipelines\n- CloudFormation, Serverless Architecture\n\n💻 Full-Stack Development:\n- Backend: Python, FastAPI, Node.js, Java\n- Frontend: React, JavaScript, TypeScript\n- Databases: Oracle, DB2, PostgreSQL, DynamoDB\n\nGitHub: https://github.com/ahmadziyad',
                keywords: ['skills', 'technologies', 'tech stack', 'expert', 'ai', 'ml', 'aws', 'python', 'react']
            },

            // Projects with Links
            {
                category: 'faq',
                question: 'What projects has Ahmad Ziyad worked on?',
                answer: 'Ahmad has developed several impressive projects:\n\n🏥 **HealthcareTrial** - Healthcare Management System\n- Live Demo: https://healthcare-trial.vercel.app/\n- GitHub: https://github.com/ahmadziyad/HealthcareTrial\n- Tech: React, Node.js, MongoDB, JWT Authentication\n\n🐾 **Pet Adoptions** - Smart Pet Adoption Platform\n- GitHub: https://github.com/ahmadziyad/PetAdoptions\n- Tech: React, Node.js, MongoDB, Socket.io\n\n🚀 **NASA MCP Server** - Model Context Protocol Tutorial\n- GitHub: https://github.com/ahmadziyad/NASA-MCP-Demo\n- Tech: TypeScript, Node.js, MCP SDK, NASA APIs\n\n🏠 **Property Risk Insight** - Investment Risk Assessment\n- GitHub: https://github.com/ahmadziyad/PropertyRiskInsight\n- Tech: React, Python, Machine Learning, TensorFlow\n\n💡 Contact Ahmad for detailed project demos and technical discussions.',
                keywords: ['projects', 'portfolio', 'healthcare', 'pet adoptions', 'nasa', 'property', 'github', 'demo']
            },

            // Experience with References
            {
                category: 'faq',
                question: 'Tell me about Ahmad Ziyad\'s professional experience',
                answer: 'Ahmad has 13+ years of progressive experience:\n\n🔹 **AI Software Engineer** - Royal Cyber Inc. (Aug 2022 - Present)\n   Client: Essent Guaranty Inc (Insurance Leader)\n   - Built RAG-based underwriting systems\n   - Reduced processing times by 40-70%\n   - AWS cloud-native solutions\n\n🔹 **IT Senior Developer** - Arab Bank (May 2018 - June 2021)\n   - Architected CI/CD pipelines using Azure DevOps\n   - AWS cloud applications with Python, ECS, Lambda\n   - Improved process efficiency by 45%\n\n🔹 **Senior Software Consultant** - I2S Business Solutions (2016-2018)\n🔹 **Senior Consultant** - HCL Technologies (2014-2016)\n🔹 **Programming Analyst** - Cognizant Technology Solutions (2011-2014)\n\nLinkedIn: https://www.linkedin.com/in/ahmadziyad',
                keywords: ['experience', 'work history', 'career', 'royal cyber', 'arab bank', 'hcl', 'cognizant']
            },

            // Certifications with Links
            {
                category: 'faq',
                question: 'What certifications does Ahmad Ziyad hold?',
                answer: 'Ahmad holds multiple industry-leading certifications:\n\n🏆 **AWS Certifications:**\n- AWS Certified Solutions Architect – Associate (2025-2028)\n- Certified AI Practitioner - AWS (2025-2028)\n\n🏆 **Oracle Cloud:**\n- OCI Certified Generative AI Professional (2025-2027)\n- OCI 2025 Certified AI Foundations Associate (2025-2027)\n\n🏆 **Project Management:**\n- Project Management Professional (PMP) (2024-2027)\n- Agile Certified Practitioner (PMI-ACP) (2024-2027)\n\n🏆 **Specialized:**\n- Building LLM Applications with Prompt Engineering (NVIDIA)\n- Enterprise Design Thinking Co-Creator (IBM)\n- Azure Fundamentals (Microsoft)\n\nView certificates: https://www.linkedin.com/in/ahmadziyad',
                keywords: ['certifications', 'certs', 'aws', 'pmp', 'pmi', 'oci', 'oracle', 'nvidia', 'professional']
            },

            // Education
            {
                category: 'faq',
                question: 'What is Ahmad Ziyad\'s educational background?',
                answer: 'Ahmad has a strong educational foundation:\n\n🎓 **Master\'s Degree** - Management Information Systems\n   University at Buffalo (June 2021 - May 2022)\n   Expertise: Statistical Analytics, Technology Innovation Management, Predictive Analytics\n\n🎓 **Bachelor of Technology** - Information Technology\n   Shri Ram Murti Smarak (SRMS) Institutions (July 2007 - June 2011)\n\nLinkedIn: https://www.linkedin.com/in/ahmadziyad',
                keywords: ['education', 'degree', 'university', 'buffalo', 'master', 'bachelor', 'college', 'srms']
            },

            // Contact Information
            {
                category: 'faq',
                question: 'How can I contact Ahmad Ziyad?',
                answer: 'You can reach Ahmad Ziyad through multiple channels:\n\n📧 **Email:** ah.ziyad@gmail.com\n📍 **Location:** Charlotte, NC, USA\n💼 **LinkedIn:** https://www.linkedin.com/in/ahmadziyad\n💻 **GitHub:** https://github.com/ahmadziyad\n\n💡 **For Project Demos:** Feel free to contact Ahmad for a full demo and backend overview of his projects and technical capabilities.\n\n🤝 **Professional Inquiries:** Available for consulting, technical discussions, and collaboration opportunities.',
                keywords: ['contact', 'email', 'linkedin', 'github', 'location', 'reach', 'social', 'demo']
            }
        ];

        logger.info('Seeding profile knowledge base...');
        service.bulkImport(profileEntries);
        logger.info('Profile knowledge base seeded successfully');
    }
}

export const profileKnowledgeService = new ProfileKnowledgeService();

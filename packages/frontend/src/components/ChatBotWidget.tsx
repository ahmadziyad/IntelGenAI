// ChatBotWidget - Floating chat bot widget positioned at bottom right
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { Message } from '../types/chat';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import { generateId } from '../utils/helpers';
import { useSpeech } from './VoiceInterface';
import { useTheme } from '../contexts/ThemeContext';
import { sampleExtendedProfileData } from '../data/sampleProfile';

// Frontend-only AI response generation using profile data
const generateFrontendAIResponse = (userQuery: string): string => {
  const query = userQuery.toLowerCase();
  
  // Check if query is off-topic
  const profileKeywords = ['ahmad', 'ziyad', 'profile', 'experience', 'skills', 'projects', 'work', 'career', 'background', 'contact', 'education', 'certification', 'current', 'role', 'company'];
  const isProfileRelated = profileKeywords.some(keyword => query.includes(keyword));
  
  if (!isProfileRelated && !query.includes('who') && !query.includes('what') && !query.includes('tell') && !query.includes('about')) {
    return `I'm Ahmad Ziyad's AI Assistant, and I'm here specifically to help with questions about his professional profile, skills, experience, and projects.\n\nI can't help with "${userQuery}" as it's outside my scope, but I'd be happy to answer questions about:\n\n🔹 **Technical Expertise:** AI/ML, AWS Cloud, Python, React, Microservices\n🔹 **Professional Experience:** 13+ years in enterprise software development\n🔹 **Current Projects:** HealthcareTrial, Pet Adoptions, NASA MCP Server\n🔹 **Certifications:** AWS, Oracle Cloud, PMP, PMI-ACP\n🔹 **Contact Information:** How to reach Ahmad for opportunities\n\nHow can I assist you with information about Ahmad Ziyad's professional profile?`;
  }

  // Who is Ahmad Ziyad
  if (query.includes('who') && (query.includes('ahmad') || query.includes('ziyad'))) {
    return `Ahmad Ziyad is a Technical Product Manager/AI Software Engineer/Architect with 13+ years of experience in enterprise software development. He specializes in AI/ML solutions, AWS cloud architecture, and full-stack development.\n\n**Current Role:** AI Software Engineer at Royal Cyber Inc. (Client: Essent Guaranty Inc)\n**Location:** Charlotte, NC, USA\n**Expertise:** AI/ML, RAG systems, AWS cloud-native solutions, Python, React\n\n**Contact Information:**\n📧 Email: ah.ziyad@gmail.com\n💼 LinkedIn: https://www.linkedin.com/in/ahmadziyad\n💻 GitHub: https://github.com/ahmadziyad\n\n💡 Feel free to contact Ahmad for a full demo and backend overview.`;
  }

  // Skills and technical expertise
  if (query.includes('skill') || query.includes('technical') || query.includes('technology') || query.includes('tech')) {
    return `Ahmad has expert-level proficiency in:\n\n🤖 **AI/ML & Intelligent Automation:**\n• TensorFlow, PyTorch, Keras, Hugging Face\n• RAG-based Applications, LangChain, MLOps\n• AWS Bedrock, SageMaker AI, Vector Databases\n• Multi-agent workflows, MCP (Model Context Protocol)\n\n☁️ **Cloud & DevOps (Expert):**\n• AWS: Lambda, S3, EC2, RDS, DynamoDB, API Gateway\n• Docker, Kubernetes, Terraform, CI/CD Pipelines\n• CloudFormation, Serverless Architecture\n\n💻 **Full-Stack Development:**\n• Backend: Python, FastAPI, Node.js, Java\n• Frontend: React, JavaScript, TypeScript\n• Databases: Oracle, DB2, PostgreSQL, DynamoDB\n\n**GitHub Portfolio:** https://github.com/ahmadziyad\n**LinkedIn:** https://www.linkedin.com/in/ahmadziyad`;
  }

  // Projects
  if (query.includes('project') || query.includes('portfolio') || query.includes('work') || query.includes('built')) {
    return `Ahmad has developed several impressive projects:\n\n🏥 **HealthcareTrial** - Healthcare Management System\n• Live Demo: https://healthcare-trial.vercel.app/\n• GitHub: https://github.com/ahmadziyad/HealthcareTrial\n• Tech: React, Node.js, MongoDB, JWT Authentication\n• Note: Feel free to contact Ahmad for a full demo and backend overview\n\n🐾 **Pet Adoptions** - Smart Pet Adoption Platform\n• GitHub: https://github.com/ahmadziyad/PetAdoptions\n• Tech: React, Node.js, MongoDB, Socket.io\n\n🚀 **NASA MCP Server** - Model Context Protocol Tutorial\n• GitHub: https://github.com/ahmadziyad/NASA-MCP-Demo\n• Tech: TypeScript, Node.js, MCP SDK, NASA APIs\n\n🏠 **Property Risk Insight** - Investment Risk Assessment\n• GitHub: https://github.com/ahmadziyad/PropertyRiskInsight\n• Tech: React, Python, Machine Learning, TensorFlow\n\n🔗 **Property Title Chain** - Blockchain Property Title Management\n• GitHub: https://github.com/ahmadziyad/TitleChain\n• Tech: React, Blockchain, Ethereum, Solidity\n\n💡 Contact Ahmad for detailed project demos and technical discussions.`;
  }

  // Experience
  if (query.includes('experience') || query.includes('career') || query.includes('work history') || query.includes('background')) {
    return `Ahmad has 13+ years of progressive experience:\n\n🔹 **AI Software Engineer** - Royal Cyber Inc. (Aug 2022 - Present)\n   Client: Essent Guaranty Inc (Leading insurance provider)\n   • Built RAG-based underwriting decision support systems\n   • Reduced processing times by 40-70% through intelligent automation\n   • Implemented AWS cloud-native solutions with Python and microservices\n\n🔹 **IT Senior Developer** - Arab Bank (May 2018 - June 2021)\n   • Architected secure CI/CD pipelines using Azure DevOps\n   • Developed cloud-native applications on AWS with Python, ECS, Lambda\n   • Improved process efficiency by 45%\n\n🔹 **Senior Software Consultant** - I2S Business Solutions (2016-2018)\n🔹 **Senior Consultant** - HCL Technologies (2014-2016)\n🔹 **Programming Analyst** - Cognizant Technology Solutions (2011-2014)\n\n**LinkedIn Profile:** https://www.linkedin.com/in/ahmadziyad\n**Contact:** ah.ziyad@gmail.com`;
  }

  // Current role
  if (query.includes('current') || query.includes('job') || query.includes('role') || query.includes('company')) {
    return `Ahmad is currently an **AI Software Engineer** at Royal Cyber Inc. (Client: Essent Guaranty Inc) since August 2022.\n\n**Key Responsibilities:**\n• Designing event-driven architectures using Python on AWS\n• Building RAG-based applications and multi-agent workflows\n• Implementing intelligent automation solutions\n• Working with AWS services: Lambda, EventBridge, API Gateway, Bedrock\n\n**Major Achievements:**\n• Built Underwriting Decision Support Agent using AWS RAG\n• Reduced underwriting review time by 40%\n• Developed automated document validation systems\n• Decreased post-closing defects by 60%\n• Implemented MCP agent networks for title chain extraction\n\n**Client:** Essent Guaranty Inc - Leading insurance and title services provider in the United States\n\n**LinkedIn:** https://www.linkedin.com/in/ahmadziyad`;
  }

  // Education
  if (query.includes('education') || query.includes('degree') || query.includes('university') || query.includes('college')) {
    return `Ahmad has a strong educational foundation:\n\n🎓 **Master's Degree** - Management Information Systems\n   University at Buffalo (June 2021 - May 2022)\n   Expertise: Statistical Analytics, Technology Innovation Management, Predictive Analytics\n\n🎓 **Bachelor of Technology** - Information Technology\n   Shri Ram Murti Smarak (SRMS) Institutions (July 2007 - June 2011)\n\n**LinkedIn Profile:** https://www.linkedin.com/in/ahmadziyad`;
  }

  // Certifications
  if (query.includes('certification') || query.includes('certified') || query.includes('cert')) {
    return `Ahmad holds multiple industry-leading certifications:\n\n🏆 **AWS Certifications:**\n• AWS Certified Solutions Architect – Associate (2025-2028)\n• Certified AI Practitioner - AWS (2025-2028)\n\n🏆 **Oracle Cloud:**\n• OCI Certified Generative AI Professional (2025-2027)\n• OCI 2025 Certified AI Foundations Associate (2025-2027)\n\n🏆 **Project Management:**\n• Project Management Professional (PMP) (2024-2027)\n• Agile Certified Practitioner (PMI-ACP) (2024-2027)\n\n🏆 **Specialized:**\n• Building LLM Applications with Prompt Engineering (NVIDIA)\n• Enterprise Design Thinking Co-Creator (IBM)\n• Azure Fundamentals (Microsoft)\n\n**View certificates:** https://www.linkedin.com/in/ahmadziyad`;
  }

  // Contact information
  if (query.includes('contact') || query.includes('reach') || query.includes('email') || query.includes('phone')) {
    return `You can reach Ahmad Ziyad through multiple channels:\n\n📧 **Email:** ah.ziyad@gmail.com\n📍 **Location:** Charlotte, NC, USA\n💼 **LinkedIn:** https://www.linkedin.com/in/ahmadziyad\n💻 **GitHub:** https://github.com/ahmadziyad\n\n💡 **For Project Demos:** Feel free to contact Ahmad for a full demo and backend overview of his projects and technical capabilities.\n\n🤝 **Professional Inquiries:** Available for consulting, technical discussions, and collaboration opportunities.`;
  }

  // AI/ML specific questions
  if (query.includes('ai') || query.includes('ml') || query.includes('machine learning') || query.includes('artificial intelligence') || query.includes('rag')) {
    return `Ahmad has extensive AI/ML expertise:\n\n🤖 **Current AI Work at Royal Cyber:**\n• Built multi-agent RAG systems for underwriting\n• Developed Underwriting Decision Support Agent using AWS RAG\n• Implemented automated document validation with RAG retrieval\n• Created MCP agent networks for historical title chain extraction\n\n🛠️ **AI/ML Technologies:**\n• TensorFlow, PyTorch, Keras, Hugging Face\n• AWS Bedrock, SageMaker AI, Vector Databases\n• LangChain, MLOps, Embedding Models\n• Multi-agent workflows, MCP (Model Context Protocol)\n\n🏆 **AI Certifications:**\n• AWS Certified AI Practitioner (2025-2028)\n• OCI Certified Generative AI Professional (2025-2027)\n• Building LLM Applications with Prompt Engineering (NVIDIA)\n\n**GitHub:** https://github.com/ahmadziyad\n**Contact:** ah.ziyad@gmail.com for AI project discussions`;
  }

  // Default response for general queries
  return `I'm Ahmad Ziyad's AI Assistant! I can help you learn about his professional background:\n\n**Available Information:**\n🔹 Technical skills and expertise (AI/ML, AWS, Python, React)\n🔹 Professional experience (13+ years in enterprise software)\n🔹 Current role and achievements\n🔹 Projects and portfolio\n🔹 Certifications and education\n🔹 Contact information\n\n**Quick Links:**\n• LinkedIn: https://www.linkedin.com/in/ahmadziyad\n• GitHub: https://github.com/ahmadziyad\n• HealthcareTrial Demo: https://healthcare-trial.vercel.app/\n• Email: ah.ziyad@gmail.com\n\nWhat specific aspect of Ahmad's profile would you like to know more about?`;
};

interface ChatBotWidgetProps {
  onChatOpen?: () => void;
  welcomeMessage?: string;
}

const WidgetContainer = styled.div`
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  z-index: 1000;
  
  @media (max-width: 768px) {
    bottom: 1rem;
    right: 1rem;
  }
`;

const ChatButton = styled(motion.button)<{ $theme: any }>`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  border: none;
  background: ${props => props.$theme.gradients.neural};
  color: white;
  font-size: 1.5rem;
  cursor: pointer;
  box-shadow: ${props => props.$theme.shadows.aiGlow};
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all ${props => props.$theme.animations.duration.normal} ${props => props.$theme.animations.easing.smooth};
  position: relative;
  
  /* AI Neural pulse animation */
  &::before {
    content: '';
    position: absolute;
    top: -3px;
    left: -3px;
    right: -3px;
    bottom: -3px;
    border-radius: 50%;
    background: ${props => props.$theme.gradients.quantum};
    opacity: 0.4;
    animation: ai-pulse 2s infinite;
    z-index: -1;
  }
  
  &::after {
    content: '';
    position: absolute;
    top: -6px;
    left: -6px;
    right: -6px;
    bottom: -6px;
    border-radius: 50%;
    background: ${props => props.$theme.gradients.cyber};
    opacity: 0.2;
    animation: ai-pulse 2s infinite 0.5s;
    z-index: -2;
  }
  
  @keyframes ai-pulse {
    0% {
      transform: scale(1);
      opacity: 0.4;
    }
    50% {
      transform: scale(1.2);
      opacity: 0.1;
    }
    100% {
      transform: scale(1);
      opacity: 0.4;
    }
  }
  
  &:hover {
    transform: scale(1.15);
    box-shadow: ${props => props.$theme.shadows.aiGlow};
    
    &::before, &::after {
      animation-play-state: paused;
    }
  }
  
  &:active {
    transform: scale(0.95);
  }
  
  @media (max-width: 768px) {
    width: 50px;
    height: 50px;
    font-size: 1.2rem;
  }
`;

const ChatPanel = styled(motion.div)<{ $theme: any }>`
  position: absolute;
  bottom: 80px;
  right: 0;
  width: 400px;
  height: 600px;
  background: ${props => props.$theme.colors.background};
  backdrop-filter: ${props => props.$theme.glass.blur};
  border: 1px solid ${props => props.$theme.colors.aiCyan}30;
  border-radius: ${props => props.$theme.borderRadius.xl};
  box-shadow: ${props => props.$theme.shadows.floating};
  overflow: hidden;
  position: relative;
  display: flex;
  flex-direction: column;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 2px;
    background: ${props => props.$theme.gradients.neural};
  }
  
  @media (max-width: 768px) {
    width: calc(100vw - 2rem);
    height: 500px;
    right: -1rem;
    bottom: 70px;
  }
  
  @media (max-width: 480px) {
    width: calc(100vw - 1rem);
    height: 450px;
    right: -0.5rem;
  }
`;

const ChatHeader = styled.div<{ $theme: any }>`
  padding: 1rem 1.5rem;
  background: ${props => props.$theme.glass.light};
  border-bottom: 1px solid ${props => props.$theme.glass.border};
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-shrink: 0;
`;

const ChatTitle = styled.h3<{ $theme: any }>`
  margin: 0;
  color: ${props => props.$theme.colors.text};
  font-size: 1.1rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const CloseButton = styled.button<{ $theme: any }>`
  background: none;
  border: none;
  color: ${props => props.$theme.colors.textSecondary};
  font-size: 1.2rem;
  cursor: pointer;
  padding: 0.25rem;
  border-radius: 4px;
  transition: all 0.2s ease;
  
  &:hover {
    color: ${props => props.$theme.colors.text};
    background: ${props => props.$theme.glass.light};
  }
`;

const ChatContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 0;
  overflow: hidden;
`;

const ChatBotWidget: React.FC<ChatBotWidgetProps> = ({ onChatOpen, welcomeMessage }) => {
  const { theme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [sessionId, setSessionId] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const { speak } = useSpeech();

  const handleToggleChat = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      onChatOpen?.();
    }
  };

  const handleCloseChat = () => {
    setIsOpen(false);
  };

  // Initialize session when widget opens
  useEffect(() => {
    // Set a simple frontend session ID
    if (isOpen && !sessionId) {
      setSessionId('frontend-session-' + Date.now());
    }

    // Add welcome message when widget first opens
    if (isOpen && messages.length === 0) {
      const defaultWelcome = "Hello! I'm Ahmad Ziyad's AI Assistant. I'm here to help you with questions about his professional profile, technical skills, experience, and projects.\n\n🔹 **Ask me about:**\n• Technical expertise (AI/ML, AWS, Python, React)\n• Professional experience and achievements\n• Current and past projects\n• Certifications and education\n• Contact information\n\n💡 Feel free to contact Ahmad directly at ah.ziyad@gmail.com for a full demo and backend overview.\n\nHow can I assist you today?";
      const welcomeMsg: Message = {
        id: generateId(),
        sessionId: sessionId || 'temp',
        content: welcomeMessage || defaultWelcome,
        type: 'assistant',
        timestamp: new Date(),
        metadata: {
          intent: 'welcome',
          confidence: 1.0
        }
      };
      setMessages([welcomeMsg]);
    }
  }, [isOpen, messages.length, sessionId, welcomeMessage]);

  const handleSendMessage = async (content: string) => {
    if (!content.trim()) return;

    // Ensure we have a session ID
    let currentSessionId = sessionId;
    if (!currentSessionId) {
      currentSessionId = 'frontend-session-' + Date.now();
      setSessionId(currentSessionId);
    }

    const userMessage: Message = {
      id: generateId(),
      sessionId: currentSessionId,
      content: content.trim(),
      type: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      // Use frontend-only AI response generation
      const aiResponse = generateFrontendAIResponse(content.trim());
      
      const assistantMessage: Message = {
        id: generateId(),
        sessionId: currentSessionId,
        content: aiResponse,
        type: 'assistant',
        timestamp: new Date(),
        metadata: {
          intent: 'profile-assistant',
          confidence: 0.9
        }
      };

      setMessages(prev => [...prev, assistantMessage]);

      // Speak the response if voice is enabled
      speak(assistantMessage.content);

      setIsLoading(false);
    } catch (error) {
      console.error('Error generating AI response:', error);
      const errorMessage: Message = {
        id: generateId(),
        sessionId: currentSessionId,
        content: "I'm sorry, I encountered an error processing your message. Please try again.",
        type: 'assistant',
        timestamp: new Date(),
        metadata: {
          intent: 'error',
          confidence: 1.0
        }
      };
      setMessages(prev => [...prev, errorMessage]);

      // Speak error message if voice is enabled
      speak(errorMessage.content);

      setIsLoading(false);
    }
  };

  return (
    <WidgetContainer>
      <AnimatePresence>
        {isOpen && (
          <ChatPanel
            $theme={theme}
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            <ChatHeader $theme={theme}>
              <ChatTitle $theme={theme}>
                💬 AI Assistant
              </ChatTitle>
              <CloseButton $theme={theme} onClick={handleCloseChat} aria-label="Close chat">
                ✕
              </CloseButton>
            </ChatHeader>
            <ChatContent>
              <MessageList
                messages={messages}
                isLoading={isLoading}
                primaryColor={theme.colors.aiBlue}
              />
              <MessageInput
                onSendMessage={handleSendMessage}
                disabled={isLoading}
                primaryColor={theme.colors.aiBlue}
                placeholder="Type your message or click the microphone to speak..."
                voiceEnabled={true}
              />
            </ChatContent>
          </ChatPanel>
        )}
      </AnimatePresence>

      <ChatButton
        $theme={theme}
        onClick={handleToggleChat}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        aria-label={isOpen ? "Close chat" : "Open chat"}
        title={isOpen ? "Close chat" : "Open chat"}
      >
        {isOpen ? '✕' : '💬'}
      </ChatButton>
    </WidgetContainer>
  );
};

export default ChatBotWidget;
import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { Message, ChatbotConfig, WidgetStyling } from '@intelligenai/shared';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import { generateId } from '../utils/helpers';
import { useSpeech } from './VoiceInterface';

interface ChatWidgetProps {
  config?: Partial<ChatbotConfig>;
  onMessage?: (message: string) => void;
  onConfigChange?: (config: Partial<ChatbotConfig>) => void;
  className?: string;
  autoOpen?: boolean;
  welcomeMessage?: string;
}

const defaultConfig: ChatbotConfig = {
  modelName: 'mistral',
  maxContextLength: 4096,
  responseTimeout: 5000,
  voiceEnabled: false,
  knowledgeBase: [],
  styling: {
    primaryColor: '#007bff',
    backgroundColor: '#ffffff',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    borderRadius: '8px',
    position: 'bottom-right'
  }
};

const WidgetContainer = styled.div<{ $styling: WidgetStyling; $isOpen: boolean }>`
  position: fixed;
  ${props => {
    switch (props.$styling.position) {
      case 'bottom-right':
        return 'bottom: 20px; right: 20px;';
      case 'bottom-left':
        return 'bottom: 20px; left: 20px;';
      case 'top-right':
        return 'top: 20px; right: 20px;';
      case 'top-left':
        return 'top: 20px; left: 20px;';
      default:
        return 'bottom: 20px; right: 20px;';
    }
  }}
  width: ${props => props.$isOpen ? '380px' : '60px'};
  height: ${props => props.$isOpen ? '500px' : '60px'};
  background-color: ${props => props.$styling.backgroundColor};
  border-radius: ${props => props.$styling.borderRadius};
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  font-family: ${props => props.$styling.fontFamily};
  transition: all 0.3s ease;
  z-index: 1000;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  
  @media (max-width: 480px) {
    width: ${props => props.$isOpen ? 'calc(100vw - 20px)' : '60px'};
    height: ${props => props.$isOpen ? 'calc(100vh - 40px)' : '60px'};
    ${props => props.$isOpen && props.$styling.position.includes('bottom') ? 'bottom: 10px;' : ''}
    ${props => props.$isOpen && props.$styling.position.includes('top') ? 'top: 10px;' : ''}
    ${props => props.$isOpen && props.$styling.position.includes('right') ? 'right: 10px;' : ''}
    ${props => props.$isOpen && props.$styling.position.includes('left') ? 'left: 10px;' : ''}
  }
`;

const ToggleButton = styled.button<{ $primaryColor: string; $isOpen: boolean }>`
  position: absolute;
  top: ${props => props.$isOpen ? '10px' : '50%'};
  right: ${props => props.$isOpen ? '10px' : '50%'};
  transform: ${props => props.$isOpen ? 'none' : 'translate(50%, -50%)'};
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: none;
  background-color: ${props => props.$primaryColor};
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  transition: all 0.3s ease;
  z-index: 1001;
  
  &:hover {
    opacity: 0.9;
    transform: ${props => props.$isOpen ? 'scale(1.05)' : 'translate(50%, -50%) scale(1.05)'};
  }
  
  &:focus {
    outline: 2px solid ${props => props.$primaryColor};
    outline-offset: 2px;
  }
`;

const ChatHeader = styled.div<{ $primaryColor: string }>`
  background-color: ${props => props.$primaryColor};
  color: white;
  padding: 15px 50px 15px 15px;
  font-weight: 600;
  font-size: 16px;
  border-radius: 8px 8px 0 0;
  position: relative;
`;

const ChatBody = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 0;
`;

const WelcomeMessage = styled.div<{ $primaryColor: string }>`
  padding: 20px;
  text-align: center;
  color: #666;
  border-bottom: 1px solid #eee;
  
  h3 {
    margin: 0 0 10px 0;
    color: ${props => props.$primaryColor};
    font-size: 18px;
  }
  
  p {
    margin: 0;
    font-size: 14px;
    line-height: 1.4;
  }
`;

const ChatWidget: React.FC<ChatWidgetProps> = ({
  config = {},
  onMessage,
  onConfigChange,
  className,
  autoOpen = false,
  welcomeMessage
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [sessionId, setSessionId] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const widgetRef = useRef<HTMLDivElement>(null);
  const { speak } = useSpeech();

  const mergedConfig = { ...defaultConfig, ...config };
  const { styling } = mergedConfig;

  // Auto-open the widget if autoOpen prop is true
  useEffect(() => {
    if (autoOpen) {
      setIsOpen(true);
    }
  }, [autoOpen]);

  useEffect(() => {
    // Initialize session when widget opens
    const initSession = async () => {
      if (isOpen && !sessionId) {
        try {
          const response = await fetch('http://localhost:3001/api/chat/sessions', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId: 'user-1' })
          });
          const result = await response.json();
          if (result.success) {
            setSessionId(result.data.sessionId);
          }
        } catch (error) {
          console.error('Failed to initialize chat session:', error);
        }
      }
    };

    initSession();

    // Add welcome message when widget first opens
    if (isOpen && messages.length === 0) {
      const defaultWelcome = "Hello! I'm here to help you with any questions about Ahmad Ziyad's profile, skills, or experience. How can I assist you today?";
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

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const handleSendMessage = async (content: string) => {
    if (!content.trim()) return;

    const userMessage: Message = {
      id: generateId(),
      sessionId,
      content: content.trim(),
      type: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      // Call the onMessage callback if provided
      if (onMessage) {
        onMessage(content.trim());
      }

      // Call the real API
      const response = await fetch('http://localhost:3001/api/chat/message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId,
          message: content.trim()
        })
      });

      const result = await response.json();

      if (result.success && result.data.message) {
        const assistantMessage: Message = {
          ...result.data.message,
          timestamp: new Date(result.data.message.timestamp)
        };

        setMessages(prev => [...prev, assistantMessage]);

        // Speak the response if voice is enabled
        if (mergedConfig.voiceEnabled) {
          speak(assistantMessage.content);
        }
      } else {
        throw new Error(result.error || 'Failed to get response from AI');
      }

      setIsLoading(false);
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: Message = {
        id: generateId(),
        sessionId,
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
      if (mergedConfig.voiceEnabled) {
        speak(errorMessage.content);
      }

      setIsLoading(false);
    }
  };



  return (
    <WidgetContainer
      ref={widgetRef}
      $styling={styling}
      $isOpen={isOpen}
      className={className}
      role="complementary"
      aria-label="Chat widget"
    >
      <ToggleButton
        $primaryColor={styling.primaryColor}
        $isOpen={isOpen}
        onClick={handleToggle}
        aria-label={isOpen ? 'Close chat' : 'Open chat'}
        type="button"
      >
        {isOpen ? '×' : '💬'}
      </ToggleButton>

      {isOpen && (
        <>
          <ChatHeader $primaryColor={styling.primaryColor}>
            Chat
          </ChatHeader>

          <ChatBody>
            {messages.length === 1 && messages[0].type === 'assistant' ? (
              <WelcomeMessage $primaryColor={styling.primaryColor}>
                <h3>Welcome!</h3>
                <p>I'm here to help you with questions, troubleshooting, and guidance. Feel free to ask me anything!</p>
              </WelcomeMessage>
            ) : null}

            <MessageList
              messages={messages}
              isLoading={isLoading}
              primaryColor={styling.primaryColor}
            />

            <MessageInput
              onSendMessage={handleSendMessage}
              disabled={isLoading}
              primaryColor={styling.primaryColor}
              placeholder="Type your message..."
              voiceEnabled={mergedConfig.voiceEnabled}
            />
          </ChatBody>
        </>
      )}
    </WidgetContainer>
  );
};

export default ChatWidget;
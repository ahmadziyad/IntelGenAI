// ChatBotWidget - Floating chat bot widget positioned at bottom right
import React, { useState } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import aiTheme from '../styles/aiTheme';
import ChatWidget from './ChatWidget';

interface ChatBotWidgetProps {
  onChatOpen?: () => void;
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

const ChatButton = styled(motion.button)`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  border: none;
  background: ${aiTheme.gradients.neural};
  color: white;
  font-size: 1.5rem;
  cursor: pointer;
  box-shadow: ${aiTheme.shadows.aiGlow};
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all ${aiTheme.animations.duration.normal} ${aiTheme.animations.easing.smooth};
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
    background: ${aiTheme.gradients.quantum};
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
    background: ${aiTheme.gradients.cyber};
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
    box-shadow: ${aiTheme.shadows.aiGlow};
    
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

const ChatPanel = styled(motion.div)`
  position: absolute;
  bottom: 80px;
  right: 0;
  width: 400px;
  height: 600px;
  background: ${aiTheme.colors.background};
  backdrop-filter: ${aiTheme.glass.blur};
  border: 1px solid ${aiTheme.colors.aiCyan}30;
  border-radius: ${aiTheme.borderRadius.xl};
  box-shadow: ${aiTheme.shadows.floating};
  overflow: hidden;
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 2px;
    background: ${aiTheme.gradients.neural};
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

const ChatHeader = styled.div`
  padding: 1rem 1.5rem;
  background: rgba(255, 255, 255, 0.05);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const ChatTitle = styled.h3`
  margin: 0;
  color: #E2E8F0;
  font-size: 1.1rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: #94A3B8;
  font-size: 1.2rem;
  cursor: pointer;
  padding: 0.25rem;
  border-radius: 4px;
  transition: all 0.2s ease;
  
  &:hover {
    color: #E2E8F0;
    background: rgba(255, 255, 255, 0.1);
  }
`;

const ChatContent = styled.div`
  height: calc(100% - 80px);
  overflow: hidden;
`;

const ChatBotWidget: React.FC<ChatBotWidgetProps> = ({ onChatOpen }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleToggleChat = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      onChatOpen?.();
    }
  };

  const handleCloseChat = () => {
    setIsOpen(false);
  };

  return (
    <WidgetContainer>
      <AnimatePresence>
        {isOpen && (
          <ChatPanel
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            <ChatHeader>
              <ChatTitle />
              <CloseButton onClick={handleCloseChat} aria-label="Close chat">
                ✕
              </CloseButton>
            </ChatHeader>
            <ChatContent>
              <ChatWidget
                config={{
                  styling: {
                    primaryColor: aiTheme.colors.aiBlue,
                    backgroundColor: 'transparent',
                    fontFamily: aiTheme.typography.fontFamily.primary,
                    borderRadius: '0',
                    position: 'bottom-right'
                  }
                }}
                welcomeMessage="Welcome! I'm your AI companion. How can I help you today?"
              />
            </ChatContent>
          </ChatPanel>
        )}
      </AnimatePresence>

      <ChatButton
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
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import ChatWidget from './ChatWidget';
import { ChatbotConfig } from '@intelligenai/shared';

const DemoContainer = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #f5f5f5;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
    sans-serif;
  position: relative;
  overflow-x: hidden;
  padding-top: 1rem;
  
  @media (max-width: 768px) {
    padding-top: 0.5rem;
  }
`;



const MainContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem 1rem;
  position: relative;
  z-index: 1;
  min-height: 75vh;
  
  @media (max-width: 768px) {
    padding: 1rem 0.5rem;
    min-height: 70vh;
  }
`;

const Title = styled.h1`
  color: #333;
  margin-bottom: 2rem;
  text-align: center;
  
  @media (max-width: 768px) {
    font-size: 1.5rem;
    margin-bottom: 1rem;
  }
`;

const ContentCard = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  text-align: center;
  max-width: 600px;
  margin-bottom: 2rem;
  width: 100%;
  
  @media (max-width: 768px) {
    padding: 1.5rem;
    margin-bottom: 1rem;
    border-radius: 6px;
  }
  
  @media (max-width: 480px) {
    padding: 1rem;
    margin: 0 0.5rem 1rem;
  }
`;

const ConfigSection = styled.div`
  margin-top: 2rem;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 6px;
  text-align: left;
`;

const ConfigGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-top: 1rem;
`;

const ConfigItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  font-size: 14px;
  font-weight: 600;
  color: #333;
`;

const Input = styled.input`
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
`;

const Select = styled.select`
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
`;

const Checkbox = styled.input`
  margin-right: 0.5rem;
`;

const ChatWidgetContainer = styled.div`
  position: fixed;
  bottom: 0;
  right: 0;
  z-index: 1000;
  
  @media (max-width: 768px) {
    bottom: 1rem;
    right: 1rem;
  }
`;

const WelcomeMessage = styled.div`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 1.5rem;
  border-radius: 8px;
  margin-bottom: 2rem;
  text-align: center;
  
  h3 {
    margin: 0 0 0.5rem 0;
    font-size: 1.2rem;
  }
  
  p {
    margin: 0;
    opacity: 0.9;
  }
`;

interface IntelGenDemoProps {
  onChatOpen?: () => void;
}

const IntelGenDemo: React.FC<IntelGenDemoProps> = ({ onChatOpen }) => {
  const [config, setConfig] = useState<Partial<ChatbotConfig>>({
    voiceEnabled: false,
    styling: {
      primaryColor: '#007bff',
      backgroundColor: '#ffffff',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      borderRadius: '8px',
      position: 'bottom-right'
    }
  });

  const [showWelcome, setShowWelcome] = useState(true);
  const [shouldAutoOpenChat, setShouldAutoOpenChat] = useState(false);

  useEffect(() => {
    // Auto-trigger chat assistant welcome when component mounts
    const timer = setTimeout(() => {
      setShowWelcome(false);
      setShouldAutoOpenChat(true);
      onChatOpen?.();
    }, 3000);

    return () => clearTimeout(timer);
  }, [onChatOpen]);

  const handleConfigChange = (newConfig: Partial<ChatbotConfig>) => {
    setConfig(prev => {
      const updatedConfig: Partial<ChatbotConfig> = {
        ...prev,
        ...newConfig
      };

      if (newConfig.styling) {
        updatedConfig.styling = {
          ...prev.styling,
          ...newConfig.styling
        };
      }

      return updatedConfig;
    });
  };

  const handleMessage = (message: string) => {
    console.log('Message received:', message);
    // This will be connected to the backend API in future tasks
  };

  return (
    <DemoContainer>
      {/* Profile Section removed - moved to App.tsx */}


      {/* Main Content Area - Remaining 75% */}
      <MainContent>
        <Title>IntelGenAI Demo</Title>

        {showWelcome && (
          <WelcomeMessage>
            <h3>Welcome to IntelGenAI!</h3>
            <p>The chat interface will open shortly to help you get started...</p>
          </WelcomeMessage>
        )}

        <ContentCard>
          <h2>IntelGenAI Chat</h2>
          <p>
            Welcome to IntelGenAI - your intelligent generation AI companion! The chat widget
            features responsive design, message display, input validation, and configuration
            system. Try interacting with the chat interface in the bottom-right corner!
          </p>

          <ConfigSection>
            <h3>Widget Configuration</h3>
            <p>Customize the chat widget appearance and behavior:</p>

            <ConfigGrid>
              <ConfigItem>
                <Label htmlFor="primaryColor">Primary Color</Label>
                <Input
                  id="primaryColor"
                  type="color"
                  value={config.styling?.primaryColor || '#007bff'}
                  onChange={(e) => handleConfigChange({
                    styling: {
                      primaryColor: e.target.value,
                      backgroundColor: config.styling?.backgroundColor || '#ffffff',
                      fontFamily: config.styling?.fontFamily || '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                      borderRadius: config.styling?.borderRadius || '8px',
                      position: config.styling?.position || 'bottom-right'
                    }
                  })}
                />
              </ConfigItem>

              <ConfigItem>
                <Label htmlFor="backgroundColor">Background Color</Label>
                <Input
                  id="backgroundColor"
                  type="color"
                  value={config.styling?.backgroundColor || '#ffffff'}
                  onChange={(e) => handleConfigChange({
                    styling: {
                      primaryColor: config.styling?.primaryColor || '#007bff',
                      backgroundColor: e.target.value,
                      fontFamily: config.styling?.fontFamily || '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                      borderRadius: config.styling?.borderRadius || '8px',
                      position: config.styling?.position || 'bottom-right'
                    }
                  })}
                />
              </ConfigItem>

              <ConfigItem>
                <Label htmlFor="position">Position</Label>
                <Select
                  id="position"
                  value={config.styling?.position || 'bottom-right'}
                  onChange={(e) => handleConfigChange({
                    styling: {
                      primaryColor: config.styling?.primaryColor || '#007bff',
                      backgroundColor: config.styling?.backgroundColor || '#ffffff',
                      fontFamily: config.styling?.fontFamily || '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                      borderRadius: config.styling?.borderRadius || '8px',
                      position: e.target.value as 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left'
                    }
                  })}
                >
                  <option value="bottom-right">Bottom Right</option>
                  <option value="bottom-left">Bottom Left</option>
                  <option value="top-right">Top Right</option>
                  <option value="top-left">Top Left</option>
                </Select>
              </ConfigItem>

              <ConfigItem>
                <Label>
                  <Checkbox
                    type="checkbox"
                    checked={config.voiceEnabled || false}
                    onChange={(e) => handleConfigChange({
                      voiceEnabled: e.target.checked
                    })}
                  />
                  Enable Voice Interface
                </Label>
              </ConfigItem>
            </ConfigGrid>
          </ConfigSection>
        </ContentCard>
      </MainContent>

      {/* Chat Widget - Fixed position with proper z-index */}
      <ChatWidgetContainer>
        <ChatWidget
          config={config}
          onMessage={handleMessage}
          onConfigChange={handleConfigChange}
          autoOpen={shouldAutoOpenChat}
          welcomeMessage="Welcome to IntelGen! I'm your AI companion. How can I help you today?"
        />
      </ChatWidgetContainer>
    </DemoContainer>
  );
};

export default IntelGenDemo;
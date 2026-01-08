import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import VoiceInterface from './VoiceInterface';
import { useTheme } from '../contexts/ThemeContext';

interface MessageInputProps {
  onSendMessage: (message: string) => void;
  disabled?: boolean;
  primaryColor: string;
  placeholder?: string;
  maxLength?: number;
  voiceEnabled?: boolean;
}

const InputContainer = styled.div<{ $theme: any }>`
  padding: 15px;
  border-top: 1px solid ${props => props.$theme.glass.border};
  background-color: ${props => props.$theme.colors.surface};
`;

const InputWrapper = styled.div<{ $primaryColor: string; $isFocused: boolean; $theme: any }>`
  display: flex;
  align-items: flex-end;
  gap: 8px;
  padding: 8px 12px;
  border: 2px solid ${props => props.$isFocused ? props.$theme.colors.aiBlue : props.$theme.glass.border};
  border-radius: 20px;
  background-color: ${props => props.$theme.glass.light};
  transition: border-color 0.2s ease;
  
  &:hover {
    border-color: ${props => props.$isFocused ? props.$theme.colors.aiBlue : props.$theme.colors.aiCyan}40;
  }
`;

const TextArea = styled.textarea<{ $theme: any }>`
  flex: 1;
  border: none;
  outline: none;
  resize: none;
  font-family: inherit;
  font-size: 14px;
  line-height: 1.4;
  padding: 4px 0;
  background: transparent;
  color: ${props => props.$theme.colors.text};
  min-height: 20px;
  max-height: 100px;
  overflow-y: auto;
  
  &::placeholder {
    color: ${props => props.$theme.colors.textMuted};
  }
  
  &:disabled {
    color: ${props => props.$theme.colors.textMuted};
    cursor: not-allowed;
  }
  
  /* Custom scrollbar for textarea */
  &::-webkit-scrollbar {
    width: 4px;
  }
  
  &::-webkit-scrollbar-track {
    background: transparent;
  }
  
  &::-webkit-scrollbar-thumb {
    background: ${props => props.$theme.colors.textMuted};
    border-radius: 2px;
  }
`;

const SendButton = styled.button<{ $primaryColor: string; $canSend: boolean; $theme: any }>`
  width: 32px;
  height: 32px;
  border: none;
  border-radius: 50%;
  background-color: ${props => props.$canSend ? props.$theme.colors.aiBlue : props.$theme.glass.border};
  color: ${props => props.$canSend ? 'white' : props.$theme.colors.textMuted};
  cursor: ${props => props.$canSend ? 'pointer' : 'not-allowed'};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  transition: all 0.2s ease;
  flex-shrink: 0;
  
  &:hover {
    ${props => props.$canSend && `
      background-color: ${props.$theme.colors.aiBlue};
      opacity: 0.9;
      transform: scale(1.05);
    `}
  }
  
  &:focus {
    outline: 2px solid ${props => props.$theme.colors.aiBlue};
    outline-offset: 2px;
  }
  
  &:disabled {
    cursor: not-allowed;
    transform: none;
  }
`;

const CharacterCount = styled.div<{ $isNearLimit: boolean; $isOverLimit: boolean; $theme: any }>`
  font-size: 11px;
  color: ${props => {
    if (props.$isOverLimit) return '#dc3545';
    if (props.$isNearLimit) return '#ffc107';
    return props.$theme.colors.textMuted;
  }};
  text-align: right;
  margin-top: 4px;
  padding: 0 4px;
`;

const ValidationMessage = styled.div<{ $theme: any; $isSuccess?: boolean }>`
  font-size: 12px;
  color: ${props => props.$isSuccess ? '#28a745' : '#dc3545'};
  margin-top: 4px;
  padding: 0 4px;
`;

const MessageInput: React.FC<MessageInputProps> = ({
  onSendMessage,
  disabled = false,
  primaryColor,
  placeholder = 'Type your message...',
  maxLength = 1000,
  voiceEnabled = false
}) => {
  const { theme } = useTheme();
  const [message, setMessage] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [validationError, setValidationError] = useState('');
  const [isVoiceSuccess, setIsVoiceSuccess] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [message]);

  const validateMessage = (text: string): string => {
    const trimmed = text.trim();
    
    if (trimmed.length === 0) {
      return 'Message cannot be empty';
    }
    
    if (trimmed.length > maxLength) {
      return `Message is too long (${trimmed.length}/${maxLength} characters)`;
    }
    
    // Check for only whitespace
    if (!/\S/.test(text)) {
      return 'Message cannot contain only whitespace';
    }
    
    return '';
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newMessage = e.target.value;
    setMessage(newMessage);
    
    // Clear validation error when user starts typing
    if (validationError) {
      setValidationError('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSend = () => {
    if (disabled) return;
    
    const error = validateMessage(message);
    if (error) {
      setValidationError(error);
      return;
    }
    
    const trimmedMessage = message.trim();
    onSendMessage(trimmedMessage);
    setMessage('');
    setValidationError('');
    
    // Focus back to input after sending
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  };

  const handleVoiceResult = (transcript: string) => {
    if (transcript.trim()) {
      setMessage(transcript);
      setValidationError('Voice input received - sending in 1.5 seconds...');
      setIsVoiceSuccess(true);
      // Auto-send voice messages after a short delay to allow user review
      setTimeout(() => {
        if (transcript.trim()) {
          onSendMessage(transcript.trim());
          setMessage('');
          setValidationError('');
          setIsVoiceSuccess(false);
        }
      }, 1500); // 1.5 second delay to allow user to see the transcript
    }
  };

  const handleVoiceError = (error: string) => {
    setValidationError(error);
    // Clear error after 3 seconds
    setTimeout(() => {
      setValidationError('');
    }, 3000);
  };

  const canSend = !disabled && message.trim().length > 0 && message.trim().length <= maxLength;
  const characterCount = message.length;
  const isNearLimit = characterCount > maxLength * 0.8;
  const isOverLimit = characterCount > maxLength;

  return (
    <InputContainer $theme={theme}>
      <InputWrapper $primaryColor={primaryColor} $isFocused={isFocused} $theme={theme}>
        <TextArea
          ref={textareaRef}
          value={message}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={voiceEnabled ? "Type your message or click 🎙️ to speak..." : placeholder}
          disabled={disabled}
          maxLength={maxLength + 100} // Allow slight overflow for validation
          rows={1}
          aria-label="Type your message"
          aria-describedby={validationError ? 'input-error' : undefined}
          $theme={theme}
        />
        
        {voiceEnabled && (
          <VoiceInterface
            onSpeechResult={handleVoiceResult}
            onError={handleVoiceError}
            primaryColor={primaryColor}
            disabled={disabled}
          />
        )}
        
        <SendButton
          type="button"
          onClick={handleSend}
          disabled={!canSend}
          $primaryColor={primaryColor}
          $canSend={canSend}
          $theme={theme}
          aria-label="Send message"
          title={canSend ? 'Send message (Enter)' : 'Enter a message to send'}
        >
          ➤
        </SendButton>
      </InputWrapper>
      
      {(isNearLimit || isOverLimit) && (
        <CharacterCount 
          $isNearLimit={isNearLimit} 
          $isOverLimit={isOverLimit}
          $theme={theme}
        >
          {characterCount}/{maxLength}
        </CharacterCount>
      )}
      
      {validationError && (
        <ValidationMessage id="input-error" role="alert" $theme={theme} $isSuccess={isVoiceSuccess}>
          {validationError}
        </ValidationMessage>
      )}
    </InputContainer>
  );
};

export default MessageInput;
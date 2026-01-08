import React, { useState, useRef, useEffect, useCallback } from 'react';
import styled from 'styled-components';

interface VoiceInterfaceProps {
  onSpeechResult: (text: string) => void;
  onSpeechStart?: () => void;
  onSpeechEnd?: () => void;
  onError?: (error: string) => void;
  primaryColor: string;
  disabled?: boolean;
  autoSpeak?: boolean;
}

interface VoiceState {
  isListening: boolean;
  isProcessing: boolean;
  isSpeaking: boolean;
  isSupported: boolean;
  transcript: string;
  error: string | null;
}

const VoiceButton = styled.button<{ 
  $primaryColor: string; 
  $isActive: boolean; 
  $isProcessing: boolean;
  $disabled: boolean;
}>`
  width: 32px;
  height: 32px;
  border: none;
  border-radius: 50%;
  background-color: ${props => {
    if (props.$disabled) return '#e1e5e9';
    if (props.$isActive) return props.$primaryColor;
    return 'transparent';
  }};
  color: ${props => {
    if (props.$disabled) return '#999';
    if (props.$isActive) return 'white';
    return props.$primaryColor;
  }};
  border: 2px solid ${props => props.$disabled ? '#e1e5e9' : props.$primaryColor};
  cursor: ${props => props.$disabled ? 'not-allowed' : 'pointer'};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  transition: all 0.2s ease;
  flex-shrink: 0;
  position: relative;
  
  &:hover {
    ${props => !props.$disabled && `
      background-color: ${props.$isActive ? props.$primaryColor : props.$primaryColor}15;
      transform: scale(1.05);
    `}
  }
  
  &:focus {
    outline: 2px solid ${props => props.$primaryColor};
    outline-offset: 2px;
  }
  
  ${props => props.$isProcessing && `
    animation: pulse 1.5s ease-in-out infinite;
  `}
  
  ${props => props.$isActive && `
    animation: recording-pulse 1s ease-in-out infinite;
  `}
  
  @keyframes pulse {
    0% { opacity: 1; }
    50% { opacity: 0.5; }
    100% { opacity: 1; }
  }
  
  @keyframes recording-pulse {
    0% { 
      box-shadow: 0 0 0 0 ${props => props.$primaryColor}40;
    }
    70% {
      box-shadow: 0 0 0 10px ${props => props.$primaryColor}00;
    }
    100% {
      box-shadow: 0 0 0 0 ${props => props.$primaryColor}00;
    }
  }
`;

const VoiceIndicator = styled.div<{ $isActive: boolean; $primaryColor: string }>`
  position: absolute;
  top: -2px;
  right: -2px;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: ${props => props.$isActive ? '#dc3545' : 'transparent'};
  ${props => props.$isActive && `
    animation: blink 1s ease-in-out infinite;
  `}
  
  @keyframes blink {
    0%, 50% { opacity: 1; }
    51%, 100% { opacity: 0; }
  }
`;

const TranscriptDisplay = styled.div<{ $show: boolean; $primaryColor: string }>`
  position: absolute;
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%);
  background: white;
  border: 1px solid ${props => props.$primaryColor};
  border-radius: 8px;
  padding: 8px 12px;
  font-size: 12px;
  color: #333;
  white-space: nowrap;
  max-width: 200px;
  overflow: hidden;
  text-overflow: ellipsis;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  opacity: ${props => props.$show ? 1 : 0};
  visibility: ${props => props.$show ? 'visible' : 'hidden'};
  transition: all 0.2s ease;
  z-index: 1000;
  
  &::after {
    content: '';
    position: absolute;
    top: 100%;
    left: 50%;
    transform: translateX(-50%);
    border: 4px solid transparent;
    border-top-color: ${props => props.$primaryColor};
  }
`;

const ErrorTooltip = styled.div<{ $show: boolean }>`
  position: absolute;
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%);
  background: #dc3545;
  color: white;
  border-radius: 4px;
  padding: 4px 8px;
  font-size: 11px;
  white-space: nowrap;
  opacity: ${props => props.$show ? 1 : 0};
  visibility: ${props => props.$show ? 'visible' : 'hidden'};
  transition: all 0.2s ease;
  z-index: 1000;
  
  &::after {
    content: '';
    position: absolute;
    top: 100%;
    left: 50%;
    transform: translateX(-50%);
    border: 3px solid transparent;
    border-top-color: #dc3545;
  }
`;

const VoiceInterface: React.FC<VoiceInterfaceProps> = ({
  onSpeechResult,
  onSpeechStart,
  onSpeechEnd,
  onError,
  primaryColor,
  disabled = false,
  autoSpeak = true
}) => {
  const [voiceState, setVoiceState] = useState<VoiceState>({
    isListening: false,
    isProcessing: false,
    isSpeaking: false,
    isSupported: false,
    transcript: '',
    error: null
  });

  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const synthesisRef = useRef<SpeechSynthesis | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Check for Web Speech API support
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const speechSynthesis = window.speechSynthesis;
    
    if (SpeechRecognition && speechSynthesis) {
      setVoiceState(prev => ({ ...prev, isSupported: true }));
      synthesisRef.current = speechSynthesis;
    } else {
      setVoiceState(prev => ({ 
        ...prev, 
        isSupported: false,
        error: 'Speech recognition not supported in this browser'
      }));
    }
  }, []);

  // Initialize speech recognition
  const initializeRecognition = useCallback(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (!SpeechRecognition) return null;

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = 'en-US';
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      setVoiceState(prev => ({ 
        ...prev, 
        isListening: true, 
        isProcessing: false,
        error: null,
        transcript: ''
      }));
      onSpeechStart?.();
    };

    recognition.onresult = (event) => {
      let finalTranscript = '';
      let interimTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcript;
        } else {
          interimTranscript += transcript;
        }
      }

      const currentTranscript = finalTranscript || interimTranscript;
      setVoiceState(prev => ({ ...prev, transcript: currentTranscript }));

      if (finalTranscript) {
        setVoiceState(prev => ({ 
          ...prev, 
          isListening: false, 
          isProcessing: false 
        }));
        onSpeechResult(finalTranscript.trim());
        onSpeechEnd?.();
      }
    };

    recognition.onerror = (event) => {
      let errorMessage = 'Speech recognition error';
      
      switch (event.error) {
        case 'no-speech':
          errorMessage = 'No speech detected. Please try again.';
          break;
        case 'audio-capture':
          errorMessage = 'Microphone not accessible. Please check permissions.';
          break;
        case 'not-allowed':
          errorMessage = 'Microphone permission denied.';
          break;
        case 'network':
          errorMessage = 'Network error during speech recognition.';
          break;
        case 'aborted':
          errorMessage = 'Speech recognition was aborted.';
          break;
        default:
          errorMessage = `Speech recognition error: ${event.error}`;
      }

      setVoiceState(prev => ({ 
        ...prev, 
        isListening: false, 
        isProcessing: false,
        error: errorMessage
      }));
      
      onError?.(errorMessage);
      onSpeechEnd?.();

      // Clear error after 3 seconds
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = setTimeout(() => {
        setVoiceState(prev => ({ ...prev, error: null }));
      }, 3000);
    };

    recognition.onend = () => {
      setVoiceState(prev => ({ 
        ...prev, 
        isListening: false, 
        isProcessing: false 
      }));
      onSpeechEnd?.();
    };

    return recognition;
  }, [onSpeechResult, onSpeechStart, onSpeechEnd, onError]);

  // Start listening
  const startListening = useCallback(() => {
    if (disabled || !voiceState.isSupported || voiceState.isListening) return;

    try {
      const recognition = initializeRecognition();
      if (recognition) {
        recognitionRef.current = recognition;
        setVoiceState(prev => ({ ...prev, isProcessing: true, error: null }));
        recognition.start();
      }
    } catch (error) {
      const errorMessage = 'Failed to start speech recognition';
      setVoiceState(prev => ({ 
        ...prev, 
        error: errorMessage,
        isProcessing: false 
      }));
      onError?.(errorMessage);
    }
  }, [disabled, voiceState.isSupported, voiceState.isListening, initializeRecognition, onError]);

  // Stop listening
  const stopListening = useCallback(() => {
    if (recognitionRef.current && typeof recognitionRef.current.stop === 'function') {
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }
  }, []);

  // Speak text
  const speak = useCallback((text: string) => {
    if (!synthesisRef.current || !autoSpeak || disabled) return;

    // Cancel any ongoing speech
    synthesisRef.current.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.9;
    utterance.pitch = 1;
    utterance.volume = 0.8;

    utterance.onstart = () => {
      setVoiceState(prev => ({ ...prev, isSpeaking: true }));
    };

    utterance.onend = () => {
      setVoiceState(prev => ({ ...prev, isSpeaking: false }));
    };

    utterance.onerror = () => {
      setVoiceState(prev => ({ ...prev, isSpeaking: false }));
    };

    synthesisRef.current.speak(utterance);
  }, [autoSpeak, disabled]);

  // Toggle listening
  const toggleListening = () => {
    if (voiceState.isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (recognitionRef.current && typeof recognitionRef.current.stop === 'function') {
        recognitionRef.current.stop();
      }
      if (synthesisRef.current && typeof synthesisRef.current.cancel === 'function') {
        synthesisRef.current.cancel();
      }
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  // Expose speak function for external use
  useEffect(() => {
    // This could be used to expose the speak function to parent components
    // For now, we'll handle it internally when responses are received
  }, [speak]);

  if (!voiceState.isSupported) {
    return null; // Don't render if not supported
  }

  const isActive = voiceState.isListening || voiceState.isProcessing;
  const showTranscript = Boolean(voiceState.transcript && voiceState.isListening);
  const showError = Boolean(voiceState.error);

  return (
    <div style={{ position: 'relative' }}>
      <VoiceButton
        type="button"
        onClick={toggleListening}
        disabled={disabled}
        $primaryColor={primaryColor}
        $isActive={isActive}
        $isProcessing={voiceState.isProcessing}
        $disabled={disabled}
        aria-label={
          voiceState.isListening 
            ? 'Stop voice input' 
            : 'Start voice input'
        }
        title={
          disabled 
            ? 'Voice input disabled'
            : voiceState.isListening 
              ? 'Click to stop listening'
              : 'Click to start voice input'
        }
      >
        {voiceState.isProcessing ? '⏳' : voiceState.isListening ? '🎤' : '🎙️'}
        <VoiceIndicator 
          $isActive={voiceState.isListening} 
          $primaryColor={primaryColor} 
        />
      </VoiceButton>

      <TranscriptDisplay 
        $show={showTranscript} 
        $primaryColor={primaryColor}
      >
        {voiceState.transcript || 'Listening...'}
      </TranscriptDisplay>

      <ErrorTooltip $show={showError}>
        {voiceState.error}
      </ErrorTooltip>
    </div>
  );
};

export default VoiceInterface;

// Export the speak function for external use
export const useSpeech = () => {
  const speak = useCallback((text: string) => {
    if (!window.speechSynthesis) return false;

    window.speechSynthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.9;
    utterance.pitch = 1;
    utterance.volume = 0.8;

    window.speechSynthesis.speak(utterance);
    return true;
  }, []);

  const stopSpeaking = useCallback(() => {
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
  }, []);

  return { speak, stopSpeaking };
};
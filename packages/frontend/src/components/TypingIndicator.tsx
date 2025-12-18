import React from 'react';
import styled, { keyframes } from 'styled-components';

interface TypingIndicatorProps {
  primaryColor: string;
}

const bounce = keyframes`
  0%, 60%, 100% {
    transform: translateY(0);
  }
  30% {
    transform: translateY(-10px);
  }
`;

const TypingWrapper = styled.div`
  display: flex;
  justify-content: flex-start;
  margin-bottom: 4px;
`;

const TypingBubble = styled.div`
  background-color: #f1f3f5;
  border-radius: 18px;
  border-bottom-left-radius: 4px;
  padding: 12px 16px;
  max-width: 80%;
  display: flex;
  align-items: center;
  gap: 4px;
`;

const Dot = styled.div<{ $delay: number }>`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: #999;
  animation: ${bounce} 1.4s infinite ease-in-out;
  animation-delay: ${props => props.$delay}s;
`;

const TypingText = styled.span`
  font-size: 12px;
  color: #666;
  margin-left: 8px;
  font-style: italic;
`;

const TypingIndicator: React.FC<TypingIndicatorProps> = ({ primaryColor }) => {
  return (
    <div role="status" aria-label="Typing...">
      <TypingWrapper>
        <TypingBubble>
          <Dot $delay={0} />
          <Dot $delay={0.2} />
          <Dot $delay={0.4} />
          <TypingText>Typing...</TypingText>
        </TypingBubble>
      </TypingWrapper>
    </div>
  );
};

export default TypingIndicator;
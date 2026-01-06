import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useTheme } from '../contexts/ThemeContext';
import { 
  initializeVisitorTracking, 
  simulateVisitorIncrement
} from '../utils/visitorTracking';

const CounterContainer = styled(motion.div)<{ $theme: any }>`
  display: flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.375rem 0.75rem;
  background: ${props => props.$theme.glass.medium};
  backdrop-filter: ${props => props.$theme.glass.blur};
  border: 1px solid ${props => props.$theme.glass.border};
  border-radius: ${props => props.$theme.borderRadius.md};
  box-shadow: ${props => props.$theme.shadows.elevation};
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: ${props => props.$theme.gradients.neural};
    animation: pulse-glow 2s ease-in-out infinite;
  }
  
  @keyframes pulse-glow {
    0%, 100% { opacity: 0.5; }
    50% { opacity: 1; }
  }
  
  @media (max-width: 768px) {
    padding: 0.25rem 0.5rem;
    gap: 0.25rem;
  }
`;

const VisitorIcon = styled.div<{ $theme: any }>`
  font-size: 0.9rem;
  color: ${props => props.$theme.colors.aiBlue};
  animation: visitor-pulse 3s ease-in-out infinite;
  
  @keyframes visitor-pulse {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.1); }
  }
  
  @media (max-width: 768px) {
    font-size: 0.8rem;
  }
`;

const CounterText = styled.div<{ $theme: any }>`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.125rem;
`;

const CounterLabel = styled.span<{ $theme: any }>`
  font-size: 0.65rem;
  color: ${props => props.$theme.colors.textSecondary};
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  
  @media (max-width: 768px) {
    font-size: 0.6rem;
  }
`;

const CounterNumber = styled(motion.span)<{ $theme: any }>`
  font-size: 0.9rem;
  font-weight: 700;
  color: ${props => props.$theme.colors.text};
  font-family: 'Courier New', monospace;
  letter-spacing: 0.5px;
  
  @media (max-width: 768px) {
    font-size: 0.8rem;
  }
`;

const VisitorCounter: React.FC = () => {
  const { theme } = useTheme();
  const [visitorCount, setVisitorCount] = useState(1110);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    // Check if visitor has been counted before
    const hasVisited = localStorage.getItem('portfolio-visited');
    const storedCount = localStorage.getItem('portfolio-visitor-count');
    
    if (storedCount) {
      setVisitorCount(parseInt(storedCount, 10));
    }
    
    if (!hasVisited) {
      // New visitor - increment count
      const newCount = storedCount ? parseInt(storedCount, 10) + 1 : 1110;
      setVisitorCount(newCount);
      localStorage.setItem('portfolio-visitor-count', newCount.toString());
      localStorage.setItem('portfolio-visited', 'true');
      
      // Animate the counter increment
      setIsAnimating(true);
      setTimeout(() => setIsAnimating(false), 1000);
    }
  }, []);

  // Simulate periodic visitor increments (for demo purposes)
  useEffect(() => {
    const interval = setInterval(() => {
      // Random chance to increment (simulate other visitors)
      if (Math.random() < 0.1) { // 10% chance every 30 seconds
        setVisitorCount(prev => {
          const newCount = prev + 1;
          localStorage.setItem('portfolio-visitor-count', newCount.toString());
          setIsAnimating(true);
          setTimeout(() => setIsAnimating(false), 1000);
          return newCount;
        });
      }
    }, 30000); // Check every 30 seconds

    return () => clearInterval(interval);
  }, []);

  const formatVisitorCount = (count: number): string => {
    // Display full number with comma separators
    return count.toLocaleString();
  };

  return (
    <CounterContainer
      $theme={theme}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      whileHover={{ scale: 1.05 }}
    >
      <VisitorIcon $theme={theme}>
        👥
      </VisitorIcon>
      <CounterText $theme={theme}>
        <CounterLabel $theme={theme}>
          Visitors
        </CounterLabel>
        <CounterNumber
          $theme={theme}
          animate={isAnimating ? { 
            scale: [1, 1.2, 1],
            color: [theme.colors.text, theme.colors.aiBlue, theme.colors.text]
          } : {}}
          transition={{ duration: 0.6 }}
        >
          {formatVisitorCount(visitorCount)}
        </CounterNumber>
      </CounterText>
    </CounterContainer>
  );
};

export default VisitorCounter;
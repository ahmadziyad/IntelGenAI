import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useTheme } from '../contexts/ThemeContext';

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
  min-width: 0; /* Allow shrinking */
  
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
    min-width: 0;
  }
  
  @media (max-width: 480px) {
    padding: 0.2rem 0.4rem;
    gap: 0.2rem;
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
  white-space: nowrap;
  
  @media (max-width: 768px) {
    font-size: 0.6rem;
  }
  
  @media (max-width: 480px) {
    font-size: 0.55rem;
  }
`;

const CounterNumber = styled(motion.span)<{ $theme: any }>`
  font-size: 0.9rem;
  font-weight: 700;
  color: ${props => props.$theme.colors.text};
  font-family: 'Courier New', monospace;
  letter-spacing: 0.5px;
  white-space: nowrap;
  
  @media (max-width: 768px) {
    font-size: 0.8rem;
  }
  
  @media (max-width: 480px) {
    font-size: 0.75rem;
  }
`;

const GlobalVisitorCounter: React.FC = () => {
  const { theme } = useTheme();
  const [visitorCount, setVisitorCount] = useState(1110);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  // Check online status
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Fetch and update visitor count from backend
  useEffect(() => {
    const fetchVisitorCount = async () => {
      try {
        // Try to get count from backend first
        const response = await fetch('http://localhost:3001/api/visitors', {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' }
        });
        
        if (response.ok) {
          const data = await response.json();
          setVisitorCount(data.count || 1110);
        } else {
          // Fallback to localStorage if backend unavailable
          const localCount = localStorage.getItem('portfolio-visitor-count');
          setVisitorCount(localCount ? parseInt(localCount, 10) : 1110);
        }
      } catch (error) {
        console.log('Backend unavailable, using local storage');
        // Fallback to localStorage
        const localCount = localStorage.getItem('portfolio-visitor-count');
        setVisitorCount(localCount ? parseInt(localCount, 10) : 1110);
      }
    };

    fetchVisitorCount();
  }, []);

  // Track new visitor
  useEffect(() => {
    const trackVisitor = async () => {
      const hasVisited = localStorage.getItem('portfolio-visited-session');
      
      if (!hasVisited) {
        try {
          // Try to increment via backend
          const response = await fetch('http://localhost:3001/api/visitors/increment', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
          });
          
          if (response.ok) {
            const data = await response.json();
            setVisitorCount(data.count);
            setIsAnimating(true);
            setTimeout(() => setIsAnimating(false), 1000);
          } else {
            // Fallback to local increment
            const localCount = localStorage.getItem('portfolio-visitor-count');
            const newCount = localCount ? parseInt(localCount, 10) + 1 : 1111;
            setVisitorCount(newCount);
            localStorage.setItem('portfolio-visitor-count', newCount.toString());
          }
        } catch (error) {
          console.log('Backend unavailable, using local increment');
          // Fallback to local increment
          const localCount = localStorage.getItem('portfolio-visitor-count');
          const newCount = localCount ? parseInt(localCount, 10) + 1 : 1111;
          setVisitorCount(newCount);
          localStorage.setItem('portfolio-visitor-count', newCount.toString());
        }
        
        // Mark this session as visited
        localStorage.setItem('portfolio-visited-session', 'true');
      }
    };

    trackVisitor();
  }, []);

  // Periodic sync with backend (every 30 seconds)
  useEffect(() => {
    if (!isOnline) return;
    
    const interval = setInterval(async () => {
      try {
        const response = await fetch('http://localhost:3001/api/visitors');
        if (response.ok) {
          const data = await response.json();
          if (data.count !== visitorCount) {
            setVisitorCount(data.count);
            setIsAnimating(true);
            setTimeout(() => setIsAnimating(false), 1000);
          }
        }
      } catch (error) {
        // Silently fail if backend unavailable
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [isOnline, visitorCount]);

  const formatVisitorCount = (count: number): string => {
    return count.toLocaleString();
  };

  return (
    <CounterContainer
      $theme={theme}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      whileHover={{ scale: 1.05 }}
      title={isOnline ? 'Live visitor count' : 'Offline mode - local count'}
    >
      <VisitorIcon $theme={theme}>
        {isOnline ? '👥' : '📱'}
      </VisitorIcon>
      <CounterText $theme={theme}>
        <CounterLabel $theme={theme}>
          Visitors {!isOnline && '(Offline)'}
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

export default GlobalVisitorCounter;
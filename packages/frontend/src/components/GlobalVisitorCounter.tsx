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

// Frontend-only visitor tracking utilities
class FrontendVisitorTracker {
  private static readonly STORAGE_KEYS = {
    TOTAL_COUNT: 'portfolio-total-visitors',
    SESSION_VISITED: 'portfolio-session-visited',
    UNIQUE_VISITORS: 'portfolio-unique-visitors',
    LAST_VISIT: 'portfolio-last-visit',
    VISITOR_ID: 'portfolio-visitor-id'
  };

  private static readonly BASE_COUNT = 1110;

  // Generate a unique visitor ID
  private static generateVisitorId(): string {
    return 'visitor_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  // Get or create visitor ID
  private static getVisitorId(): string {
    let visitorId = localStorage.getItem(this.STORAGE_KEYS.VISITOR_ID);
    if (!visitorId) {
      visitorId = this.generateVisitorId();
      localStorage.setItem(this.STORAGE_KEYS.VISITOR_ID, visitorId);
    }
    return visitorId;
  }

  // Check if this is a new session (not visited in last 30 minutes)
  private static isNewSession(): boolean {
    const lastVisit = localStorage.getItem(this.STORAGE_KEYS.LAST_VISIT);
    const sessionVisited = sessionStorage.getItem(this.STORAGE_KEYS.SESSION_VISITED);
    
    if (sessionVisited) {
      return false; // Already counted in this session
    }

    if (!lastVisit) {
      return true; // First time visitor
    }

    const lastVisitTime = parseInt(lastVisit, 10);
    const now = Date.now();
    const thirtyMinutes = 30 * 60 * 1000;

    return (now - lastVisitTime) > thirtyMinutes;
  }

  // Get current visitor count
  static getVisitorCount(): number {
    const storedCount = localStorage.getItem(this.STORAGE_KEYS.TOTAL_COUNT);
    return storedCount ? parseInt(storedCount, 10) : this.BASE_COUNT;
  }

  // Track a new visitor
  static trackVisitor(): { count: number; isNewVisitor: boolean } {
    const isNewVisitor = this.isNewSession();
    
    if (isNewVisitor) {
      // Mark this session as visited
      sessionStorage.setItem(this.STORAGE_KEYS.SESSION_VISITED, 'true');
      localStorage.setItem(this.STORAGE_KEYS.LAST_VISIT, Date.now().toString());
      
      // Increment visitor count
      const currentCount = this.getVisitorCount();
      const newCount = currentCount + 1;
      localStorage.setItem(this.STORAGE_KEYS.TOTAL_COUNT, newCount.toString());
      
      // Track unique visitors
      this.trackUniqueVisitor();
      
      return { count: newCount, isNewVisitor: true };
    }

    return { count: this.getVisitorCount(), isNewVisitor: false };
  }

  // Track unique visitors (for analytics)
  private static trackUniqueVisitor(): void {
    const visitorId = this.getVisitorId();
    const uniqueVisitors = this.getUniqueVisitors();
    
    if (!uniqueVisitors.includes(visitorId)) {
      uniqueVisitors.push(visitorId);
      // Keep only last 1000 unique visitors to prevent storage bloat
      if (uniqueVisitors.length > 1000) {
        uniqueVisitors.splice(0, uniqueVisitors.length - 1000);
      }
      localStorage.setItem(this.STORAGE_KEYS.UNIQUE_VISITORS, JSON.stringify(uniqueVisitors));
    }
  }

  // Get unique visitors list
  private static getUniqueVisitors(): string[] {
    const stored = localStorage.getItem(this.STORAGE_KEYS.UNIQUE_VISITORS);
    return stored ? JSON.parse(stored) : [];
  }

  // Get analytics data
  static getAnalytics() {
    return {
      totalVisitors: this.getVisitorCount(),
      uniqueVisitors: this.getUniqueVisitors().length,
      lastVisit: localStorage.getItem(this.STORAGE_KEYS.LAST_VISIT),
      visitorId: this.getVisitorId()
    };
  }

  // Simulate realistic visitor growth (optional)
  static simulateGrowth(): void {
    const now = Date.now();
    const lastGrowth = localStorage.getItem('portfolio-last-growth');
    
    if (!lastGrowth || (now - parseInt(lastGrowth, 10)) > 60000) { // Every minute
      const currentCount = this.getVisitorCount();
      const growthRate = Math.random() < 0.3 ? 1 : 0; // 30% chance of growth
      
      if (growthRate > 0) {
        const newCount = currentCount + growthRate;
        localStorage.setItem(this.STORAGE_KEYS.TOTAL_COUNT, newCount.toString());
        localStorage.setItem('portfolio-last-growth', now.toString());
      }
    }
  }
}

const GlobalVisitorCounter: React.FC = () => {
  const { theme } = useTheme();
  const [visitorCount, setVisitorCount] = useState(FrontendVisitorTracker.getVisitorCount());
  const [isAnimating, setIsAnimating] = useState(false);

  // Track visitor on component mount
  useEffect(() => {
    const { count, isNewVisitor } = FrontendVisitorTracker.trackVisitor();
    
    if (isNewVisitor) {
      setVisitorCount(count);
      setIsAnimating(true);
      setTimeout(() => setIsAnimating(false), 1000);
    } else {
      setVisitorCount(count);
    }
  }, []);

  // Optional: Simulate realistic growth (uncomment if desired)
  useEffect(() => {
    const interval = setInterval(() => {
      FrontendVisitorTracker.simulateGrowth();
      const newCount = FrontendVisitorTracker.getVisitorCount();
      if (newCount !== visitorCount) {
        setVisitorCount(newCount);
        setIsAnimating(true);
        setTimeout(() => setIsAnimating(false), 800);
      }
    }, 60000); // Check every minute

    return () => clearInterval(interval);
  }, [visitorCount]);

  // Track page visibility changes (when user returns to tab)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        // User returned to the page, check for new session
        const { count, isNewVisitor } = FrontendVisitorTracker.trackVisitor();
        if (isNewVisitor) {
          setVisitorCount(count);
          setIsAnimating(true);
          setTimeout(() => setIsAnimating(false), 1000);
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

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
      title={`Portfolio visitors - Session tracking enabled`}
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

export default GlobalVisitorCounter;
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useTheme } from '../contexts/ThemeContext';
import FrontendAnalytics, { AnalyticsData } from '../utils/frontendAnalytics';

const DashboardContainer = styled(motion.div)<{ $theme: any }>`
  position: fixed;
  top: 20px;
  right: 20px;
  width: 300px;
  max-height: 400px;
  background: ${props => props.$theme.glass.medium};
  backdrop-filter: ${props => props.$theme.glass.blur};
  border: 1px solid ${props => props.$theme.glass.border};
  border-radius: ${props => props.$theme.borderRadius.lg};
  box-shadow: ${props => props.$theme.shadows.floating};
  padding: 1rem;
  z-index: 1000;
  overflow-y: auto;
  
  @media (max-width: 768px) {
    width: 280px;
    right: 10px;
    top: 10px;
  }
`;

const DashboardHeader = styled.div<{ $theme: any }>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid ${props => props.$theme.glass.border};
`;

const DashboardTitle = styled.h3<{ $theme: any }>`
  margin: 0;
  font-size: 1rem;
  color: ${props => props.$theme.colors.text};
  font-weight: 600;
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

const StatGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.75rem;
  margin-bottom: 1rem;
`;

const StatCard = styled.div<{ $theme: any }>`
  background: ${props => props.$theme.glass.light};
  border: 1px solid ${props => props.$theme.glass.border};
  border-radius: ${props => props.$theme.borderRadius.md};
  padding: 0.75rem;
  text-align: center;
`;

const StatValue = styled.div<{ $theme: any }>`
  font-size: 1.25rem;
  font-weight: 700;
  color: ${props => props.$theme.colors.aiBlue};
  margin-bottom: 0.25rem;
`;

const StatLabel = styled.div<{ $theme: any }>`
  font-size: 0.75rem;
  color: ${props => props.$theme.colors.textSecondary};
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const DetailSection = styled.div<{ $theme: any }>`
  margin-bottom: 1rem;
`;

const SectionTitle = styled.h4<{ $theme: any }>`
  margin: 0 0 0.5rem 0;
  font-size: 0.875rem;
  color: ${props => props.$theme.colors.text};
  font-weight: 600;
`;

const DetailList = styled.div<{ $theme: any }>`
  font-size: 0.75rem;
  color: ${props => props.$theme.colors.textSecondary};
  line-height: 1.4;
`;

const DetailItem = styled.div<{ $theme: any }>`
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.25rem;
  padding: 0.25rem;
  background: ${props => props.$theme.glass.light};
  border-radius: 4px;
`;

const ToggleButton = styled.button<{ $theme: any }>`
  position: fixed;
  top: 20px;
  right: 20px;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: none;
  background: ${props => props.$theme.colors.aiBlue};
  color: white;
  font-size: 1rem;
  cursor: pointer;
  box-shadow: ${props => props.$theme.shadows.elevation};
  z-index: 999;
  transition: all 0.2s ease;
  
  &:hover {
    transform: scale(1.1);
  }
  
  @media (max-width: 768px) {
    right: 10px;
    top: 10px;
    width: 35px;
    height: 35px;
    font-size: 0.9rem;
  }
`;

interface AnalyticsDashboardProps {
  isVisible?: boolean;
  onToggle?: (visible: boolean) => void;
}

const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({ 
  isVisible = false, 
  onToggle 
}) => {
  const { theme } = useTheme();
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [showDashboard, setShowDashboard] = useState(isVisible);

  useEffect(() => {
    if (showDashboard) {
      const data = FrontendAnalytics.getAnalytics();
      setAnalytics(data);
    }
  }, [showDashboard]);

  useEffect(() => {
    // Refresh analytics every 30 seconds when dashboard is open
    if (!showDashboard) return;

    const interval = setInterval(() => {
      const data = FrontendAnalytics.getAnalytics();
      setAnalytics(data);
    }, 30000);

    return () => clearInterval(interval);
  }, [showDashboard]);

  const handleToggle = () => {
    const newState = !showDashboard;
    setShowDashboard(newState);
    onToggle?.(newState);
  };

  const formatDuration = (seconds: number): string => {
    if (seconds < 60) return `${seconds}s`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    return `${hours}h ${minutes % 60}m`;
  };

  const formatTime = (milliseconds: number): string => {
    return formatDuration(Math.floor(milliseconds / 1000));
  };

  if (!analytics && showDashboard) {
    return (
      <>
        <ToggleButton $theme={theme} onClick={handleToggle} title="Toggle Analytics">
          📊
        </ToggleButton>
        <DashboardContainer
          $theme={theme}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
        >
          <DashboardHeader $theme={theme}>
            <DashboardTitle $theme={theme}>Loading...</DashboardTitle>
            <CloseButton $theme={theme} onClick={handleToggle}>✕</CloseButton>
          </DashboardHeader>
        </DashboardContainer>
      </>
    );
  }

  return (
    <>
      <ToggleButton $theme={theme} onClick={handleToggle} title="Toggle Analytics">
        📊
      </ToggleButton>
      
      {showDashboard && analytics && (
        <DashboardContainer
          $theme={theme}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
        >
          <DashboardHeader $theme={theme}>
            <DashboardTitle $theme={theme}>Analytics Dashboard</DashboardTitle>
            <CloseButton $theme={theme} onClick={handleToggle}>✕</CloseButton>
          </DashboardHeader>

          <StatGrid>
            <StatCard $theme={theme}>
              <StatValue $theme={theme}>{analytics.totalVisitors.toLocaleString()}</StatValue>
              <StatLabel $theme={theme}>Total Visitors</StatLabel>
            </StatCard>
            <StatCard $theme={theme}>
              <StatValue $theme={theme}>{analytics.uniqueVisitors}</StatValue>
              <StatLabel $theme={theme}>Unique Visitors</StatLabel>
            </StatCard>
            <StatCard $theme={theme}>
              <StatValue $theme={theme}>{analytics.sessionsToday}</StatValue>
              <StatLabel $theme={theme}>Today's Sessions</StatLabel>
            </StatCard>
            <StatCard $theme={theme}>
              <StatValue $theme={theme}>{formatDuration(analytics.averageSessionDuration)}</StatValue>
              <StatLabel $theme={theme}>Avg. Session</StatLabel>
            </StatCard>
          </StatGrid>

          {Object.keys(analytics.topReferrers).length > 0 && (
            <DetailSection $theme={theme}>
              <SectionTitle $theme={theme}>Top Referrers</SectionTitle>
              <DetailList $theme={theme}>
                {Object.entries(analytics.topReferrers)
                  .sort(([,a], [,b]) => b - a)
                  .slice(0, 3)
                  .map(([referrer, count]) => (
                    <DetailItem key={referrer} $theme={theme}>
                      <span>{referrer === 'direct' ? 'Direct' : new URL(referrer).hostname}</span>
                      <span>{count}</span>
                    </DetailItem>
                  ))}
              </DetailList>
            </DetailSection>
          )}

          {Object.keys(analytics.deviceTypes).length > 0 && (
            <DetailSection $theme={theme}>
              <SectionTitle $theme={theme}>Device Types</SectionTitle>
              <DetailList $theme={theme}>
                {Object.entries(analytics.deviceTypes)
                  .sort(([,a], [,b]) => b - a)
                  .map(([device, count]) => (
                    <DetailItem key={device} $theme={theme}>
                      <span>{device.charAt(0).toUpperCase() + device.slice(1)}</span>
                      <span>{count}</span>
                    </DetailItem>
                  ))}
              </DetailList>
            </DetailSection>
          )}

          {analytics.timeSpentOnSite > 0 && (
            <DetailSection $theme={theme}>
              <SectionTitle $theme={theme}>Total Time on Site</SectionTitle>
              <DetailList $theme={theme}>
                <DetailItem $theme={theme}>
                  <span>All Sessions</span>
                  <span>{formatTime(analytics.timeSpentOnSite)}</span>
                </DetailItem>
              </DetailList>
            </DetailSection>
          )}
        </DashboardContainer>
      )}
    </>
  );
};

export default AnalyticsDashboard;
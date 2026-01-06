import { useState, useEffect } from 'react';
import TabNavigation from './components/TabNavigation';
import ChatBotWidget from './components/ChatBotWidget';
import ThemeDropdown from './components/ThemeDropdown';
import GlobalVisitorCounter from './components/GlobalVisitorCounter';

import ProfileSkillsTab from './components/profile/ProfileSkillsTab';
import ExperienceTab from './components/profile/ExperienceTab';
import ProjectsTab from './components/profile/ProjectsTab';
import CertificationsTab from './components/profile/CertificationsTab';
import ContactTab from './components/profile/ContactTab';
import { sampleProfileData, sampleExtendedProfileData } from './data/sampleProfile';
import { initializePerformanceOptimizations, cleanupPerformanceOptimizations } from './utils/performanceInit';
import { defaultTheme } from './styles/theme';
import { ExtendedProfileData } from './types/profile';
import InteractiveBackground from './components/InteractiveBackground';
import { useTheme } from './contexts/ThemeContext';

function App() {
  const { theme } = useTheme();
  // Extended profile data state
  const [extendedProfile, setExtendedProfile] = useState<ExtendedProfileData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize performance optimizations on app mount
  useEffect(() => {
    // Initialize performance optimizations
    initializePerformanceOptimizations().catch(error => {
      console.warn('Failed to initialize performance optimizations:', error);
    });

    // Cleanup on unmount
    return () => {
      cleanupPerformanceOptimizations();
    };
  }, []);

  // Load extended profile data
  useEffect(() => {
    const loadExtendedProfile = async () => {
      try {
        setIsLoading(true);
        // Simulate API call loading time
        setTimeout(() => {
          setExtendedProfile(sampleExtendedProfileData);
          setIsLoading(false);
        }, 500);
      } catch (err) {
        setIsLoading(false);
      }
    };

    loadExtendedProfile();
  }, []);



  const tabs = [
    {
      id: 'profile-skills',
      label: 'Profile & Skills',
      content: (
        <ProfileSkillsTab
          profile={sampleProfileData}
          extendedProfile={extendedProfile}
          styling={defaultTheme}
        />
      )
    },
    {
      id: 'experience',
      label: 'Experience',
      content: !isLoading && extendedProfile ? (
        <ExperienceTab
          profile={extendedProfile}
          styling={defaultTheme}
        />
      ) : (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100%',
          color: '#94A3B8',
          fontSize: '1.1rem'
        }}>
          Loading experience information...
        </div>
      )
    },
    {
      id: 'projects',
      label: 'Personal Projects',
      content: !isLoading && extendedProfile ? (
        <ProjectsTab
          profile={extendedProfile}
          styling={defaultTheme}
        />
      ) : (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100%',
          color: '#94A3B8',
          fontSize: '1.1rem'
        }}>
          Loading projects information...
        </div>
      )
    },
    {
      id: 'certifications',
      label: 'Certifications',
      content: !isLoading && extendedProfile ? (
        <CertificationsTab
          profile={extendedProfile}
          styling={defaultTheme}
        />
      ) : (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100%',
          color: '#94A3B8',
          fontSize: '1.1rem'
        }}>
          Loading certifications information...
        </div>
      )
    },
    {
      id: 'contact',
      label: 'Contact',
      content: !isLoading && extendedProfile ? (
        <ContactTab
          profile={extendedProfile}
          styling={defaultTheme}
        />
      ) : (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100%',
          color: theme.colors.textSecondary,
          fontSize: '1.1rem'
        }}>
          Loading contact information...
        </div>
      )
    }
  ];

  const handleTabChange = (tabId: string) => {
    console.log(`Switched to tab: ${tabId}`);
  };

  return (
    <>
      <style>{`
        @keyframes glow {
          from {
            text-shadow: 0 0 10px rgba(255, 255, 255, 0.1);
          }
          to {
            text-shadow: 0 0 20px rgba(255, 255, 255, 0.2);
          }
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        
        @keyframes pulse-border {
          0%, 100% { border-color: ${theme.glass.border}; }
          50% { border-color: rgba(255, 255, 255, 0.2); }
        }
        
        .ai-card {
          animation: float 6s ease-in-out infinite;
        }
        
        body {
          margin: 0;
          overflow: hidden;
          background: ${theme.colors.background};
          color: ${theme.colors.text};
          font-family: ${theme.typography.fontFamily.primary};
        }
      `}</style>

      <InteractiveBackground />

      <div style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        minHeight: '100dvh',
        overflow: 'hidden',
        position: 'relative',
        zIndex: 1
      }}>
        {/* Header Section - Simple heading/label only */}
        <div style={{
          height: '10vh',
          minHeight: '60px',
          maxHeight: '80px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '0 1rem'
        }}>
          <div style={{
            textAlign: 'center'
          }}>
            <h1 style={{
              fontSize: '2.5rem',
              fontWeight: '700',
              margin: 0,
              color: theme.colors.text,
              letterSpacing: '-0.02em',
              textShadow: '0 2px 10px rgba(0,0,0,0.5)'
            }}>
              {sampleProfileData.name}
            </h1>
            <p style={{
              fontSize: '1rem',
              color: theme.colors.textSecondary,
              margin: '0.25rem 0 0 0',
              fontWeight: '500',
              textShadow: `0 0 10px ${theme.colors.aiBlue}30`
            }}>
              {sampleProfileData.title}
            </p>
          </div>
        </div>

        {/* Tabs Section - Adjusted height to leave space for bottom footer */}
        <div style={{
          height: '85vh',
          maxHeight: '85vh',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          padding: '0 0.5rem 0 0.5rem'
        }}>
          <div style={{
            background: theme.glass.medium,
            backdropFilter: theme.glass.blur,
            borderRadius: theme.borderRadius.xl,
            border: `1px solid ${theme.glass.light}`,
            boxShadow: theme.shadows.elevation,
            height: '100%',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            position: 'relative'
          }}>
            <TabNavigation
              tabs={tabs}
              defaultActiveTab="profile-skills"
              onTabChange={handleTabChange}
            />
          </div>
        </div>

        {/* Bottom Footer - Visitor Counter and Theme Dropdown */}
        <div style={{
          height: '5vh',
          minHeight: '40px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 1rem',
          position: 'relative'
        }}>
          {/* Visitor Counter - Bottom Left */}
          <div style={{
            display: 'flex',
            alignItems: 'center'
          }}>
            <GlobalVisitorCounter />
          </div>
          
          {/* Theme Dropdown - Bottom Right */}
          <div style={{
            display: 'flex',
            alignItems: 'center'
          }}>
            <ThemeDropdown />
          </div>
        </div>

        {/* Floating Chat Bot Widget */}
        <ChatBotWidget />
      </div>
    </>
  );
}

export default App;
import { useState, useEffect } from 'react';
import TabNavigation from './components/TabNavigation';
import ChatBotWidget from './components/ChatBotWidget';

import ProfileOverview from './components/profile/ProfileOverview';
import ExperienceTab from './components/profile/ExperienceTab';
import SkillsTab from './components/profile/SkillsTab';
import ProjectsTab from './components/profile/ProjectsTab';
import CertificationsTab from './components/profile/CertificationsTab';
import ContactTab from './components/profile/ContactTab';
import { sampleProfileData, sampleExtendedProfileData } from './data/sampleProfile';
import { initializePerformanceOptimizations, cleanupPerformanceOptimizations } from './utils/performanceInit';
import { defaultTheme } from './styles/theme';
import aiTheme from './styles/aiTheme';
import { ExtendedProfileData } from './types/profile';
import InteractiveBackground from './components/InteractiveBackground';

function App() {
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
      id: 'skills',
      label: 'Skills',
      content: !isLoading && extendedProfile ? (
        <SkillsTab
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
          Loading skills information...
        </div>
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
          color: aiTheme.colors.textSecondary,
          fontSize: '1.1rem'
        }}>
          Loading contact information...
        </div>
      )
    },
    {
      id: 'profile',
      label: 'Profile',
      content: (
        <ProfileOverview
          profile={sampleProfileData}
          styling={defaultTheme}
        />
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
          0%, 100% { border-color: ${aiTheme.glass.border}; }
          50% { border-color: rgba(255, 255, 255, 0.2); }
        }
        
        .ai-card {
          animation: float 6s ease-in-out infinite;
        }
        
        body {
          margin: 0;
          overflow: hidden;
          background: ${aiTheme.colors.background};
          color: ${aiTheme.colors.text};
          font-family: ${aiTheme.typography.fontFamily.primary};
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
        {/* Header Section - Simple heading/label */}
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
              color: '#FFFFFF',
              letterSpacing: '-0.02em',
              textShadow: '0 2px 10px rgba(0,0,0,0.5)'
            }}>
              {sampleProfileData.name}
            </h1>
            <p style={{
              fontSize: '1rem',
              color: aiTheme.colors.textSecondary,
              margin: '0.25rem 0 0 0',
              fontWeight: '500',
              textShadow: `0 0 10px ${aiTheme.colors.aiBlue}30`
            }}>
              {sampleProfileData.title}
            </p>
          </div>
        </div>

        {/* Tabs Section - 90% of viewport height */}
        <div style={{
          height: '90vh',
          maxHeight: '90vh',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          padding: '0 0.5rem 0.5rem 0.5rem'
        }}>
          <div style={{
            background: aiTheme.glass.medium,
            backdropFilter: aiTheme.glass.blur,
            borderRadius: aiTheme.borderRadius.xl,
            border: `1px solid ${aiTheme.glass.light}`,
            boxShadow: aiTheme.shadows.elevation,
            height: '100%',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            position: 'relative'
          }}>
            <TabNavigation
              tabs={tabs}
              defaultActiveTab="skills"
              onTabChange={handleTabChange}
            />
          </div>
        </div>

        {/* Floating Chat Bot Widget */}
        <ChatBotWidget />
      </div>
    </>
  );
}

export default App;
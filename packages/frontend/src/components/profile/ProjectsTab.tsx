// ProjectsTab - Personal projects content for tab display
import React, { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { ExtendedProfileData, ProfileStyling } from '../../types/profile';
import { Heading, Text, Flex } from '../../styles/styled';
import aiTheme from '../../styles/aiTheme';

interface ProjectsTabProps {
  profile: ExtendedProfileData;
  styling: ProfileStyling;
}

const TabContainer = styled.div`
  padding: 2rem;
  height: 100%;
  overflow-y: auto;
  background: transparent;
`;

const ProjectsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 1.5rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
`;

const ProjectCard = styled(motion.div)<{ theme: ProfileStyling }>`
  background: ${aiTheme.glass.medium};
  backdrop-filter: ${aiTheme.glass.blur};
  border: 1px solid ${aiTheme.glass.light};
  border-radius: ${aiTheme.borderRadius.xl};
  padding: 1.5rem;
  transition: all ${aiTheme.animations.duration.normal} ${aiTheme.animations.easing.smooth};
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: ${aiTheme.gradients.neural};
    opacity: 0.1;
    transform: skewX(-25deg);
    transition: left 0.7s ease;
  }
  
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 4px;
    height: 100%;
    background: ${aiTheme.gradients.neural};
    transform: scaleY(0);
    transition: transform 0.3s ease;
  }
  
  &:hover {
    background: ${aiTheme.glass.heavy};
    border-color: ${aiTheme.colors.aiCyan}40;
    transform: translateY(-4px);
    box-shadow: ${aiTheme.shadows.aiGlow};
    
    &::before {
      left: 100%;
    }
    
    &::after {
      transform: scaleY(1);
    }
  }
`;

const ProjectImage = styled.img<{ theme: ProfileStyling }>`
  width: 100%;
  height: 200px;
  object-fit: cover;
  border-radius: ${aiTheme.borderRadius.lg};
  margin-bottom: 1rem;
  background: ${aiTheme.glass.light};
  border: 1px solid ${aiTheme.glass.border};
`;

const ImageFallback = styled.div<{ theme: ProfileStyling }>`
  width: 100%;
  height: 200px;
  background: ${aiTheme.glass.light};
  border-radius: ${aiTheme.borderRadius.lg};
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${aiTheme.colors.textSecondary};
  font-size: 1rem;
  border: 2px dashed ${aiTheme.glass.border};
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 60px;
    height: 60px;
    background: ${aiTheme.gradients.neural};
    border-radius: 50%;
    opacity: 0.3;
  }
`;

const SkillTag = styled.span<{ theme: ProfileStyling }>`
  display: inline-block;
  padding: 0.35rem 0.75rem;
  margin: 2px 4px 2px 0;
  background: rgba(255, 255, 255, 0.1);
  color: ${aiTheme.colors.textSecondary};
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: ${aiTheme.borderRadius.md};
  font-size: 0.8rem;
  font-weight: 500;
  transition: all 0.2s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.15);
    color: ${aiTheme.colors.text};
    border-color: rgba(255, 255, 255, 0.2);
    transform: translateY(-1px);
  }
`;

const ProjectLink = styled.a<{ theme: ProfileStyling }>`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: ${aiTheme.gradients.neural};
  color: ${aiTheme.colors.aiBlue};
  text-decoration: none;
  border-radius: ${aiTheme.borderRadius.lg};
  font-weight: 500;
  transition: all ${aiTheme.animations.duration.normal} ${aiTheme.animations.easing.smooth};
  border: 1px solid ${aiTheme.colors.aiCyan}40;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: ${aiTheme.gradients.cyber};
    opacity: 0.3;
    transition: left 0.5s ease;
  }
  
  &:hover {
    background: ${aiTheme.gradients.quantum};
    color: ${aiTheme.colors.text};
    transform: translateY(-2px);
    box-shadow: ${aiTheme.shadows.glow};
    border-color: ${aiTheme.colors.aiCyan}60;
    
    &::before {
      left: 100%;
    }
  }
`;

const ProjectButton = styled.button<{ theme: ProfileStyling }>`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: ${aiTheme.gradients.neural};
  color: ${aiTheme.colors.aiPurple};
  border: 1px solid ${aiTheme.colors.aiPurple}40;
  border-radius: ${aiTheme.borderRadius.lg};
  font-weight: 500;
  transition: all ${aiTheme.animations.duration.normal} ${aiTheme.animations.easing.smooth};
  cursor: pointer;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: ${aiTheme.gradients.cyber};
    opacity: 0.3;
    transition: left 0.5s ease;
  }
  
  &:hover {
    background: ${aiTheme.gradients.quantum};
    color: ${aiTheme.colors.text};
    transform: translateY(-2px);
    box-shadow: ${aiTheme.shadows.glow};
    border-color: ${aiTheme.colors.aiPurple}60;
    
    &::before {
      left: 100%;
    }
  }
`;

// Safe image component with error handling
const SafeProjectImage: React.FC<{ src?: string; alt: string; theme: ProfileStyling }> = ({ src, alt, theme }) => {
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const handleImageError = () => {
    setHasError(true);
    setIsLoading(false);
  };

  const handleImageLoad = () => {
    setHasError(false);
    setIsLoading(false);
  };

  if (!src || hasError) {
    return (
      <ImageFallback theme={theme}>
        📷 Project Image
      </ImageFallback>
    );
  }

  return (
    <>
      {isLoading && (
        <ImageFallback theme={theme}>
          Loading image...
        </ImageFallback>
      )}
      <ProjectImage
        src={src}
        alt={alt}
        theme={theme}
        onError={handleImageError}
        onLoad={handleImageLoad}
        style={{ display: isLoading ? 'none' : 'block' }}
      />
    </>
  );
};

const ProjectsTab: React.FC<ProjectsTabProps> = ({ profile, styling }) => {
  const handleIntelGenStudioClick = () => {
    // Scroll to bottom right to show the chat widget
    const chatWidget = document.querySelector('[aria-label="Open chat"]');
    if (chatWidget instanceof HTMLElement) {
      chatWidget.click();

      // Optional: scroll to the widget area
      window.scrollTo({
        top: document.body.scrollHeight,
        behavior: 'smooth'
      });
    }
  };

  if (!profile.projects || profile.projects.length === 0) {
    return (
      <TabContainer>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100%',
          color: aiTheme.colors.textSecondary,
          fontSize: '1.1rem'
        }}>
          No projects information available
        </div>
      </TabContainer>
    );
  }

  return (
    <TabContainer>
      <Heading level={2} theme={styling} style={{
        marginBottom: '2rem',
        color: aiTheme.colors.text,
        fontSize: '1.5rem',
        fontWeight: '600'
      }}>
        Personal Projects
      </Heading>

      <ProjectsGrid>
        {profile.projects.map((project, index) => (
          <ProjectCard 
            key={project.id} 
            theme={styling}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <SafeProjectImage
              src={project.image}
              alt={`${project.name} screenshot`}
              theme={styling}
            />
            <Flex direction="column" gap="0.75rem" theme={styling}>
              <Flex justify="space-between" align="flex-start" theme={styling}>
                <Heading level={3} theme={styling} style={{
                  color: aiTheme.colors.text,
                  fontSize: '1.2rem',
                  flex: 1
                }}>
                  {project.name}
                </Heading>
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  {project.demoLink && (
                    <ProjectLink
                      href={project.demoLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      theme={styling}
                      style={{ background: aiTheme.gradients.quantum }}
                    >
                      Live Demo
                      <span>🚀</span>
                    </ProjectLink>
                  )}
                  {project.link && (
                    project.link === '#intelligen-studio' ? (
                      <ProjectButton
                        onClick={handleIntelGenStudioClick}
                        theme={styling}
                        title="Open chat interface"
                      >
                        Try Demo
                        <span>💬</span>
                      </ProjectButton>
                    ) : (
                      <ProjectLink
                        href={project.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        theme={styling}
                      >
                        View Code
                        <span>🔗</span>
                      </ProjectLink>
                    )
                  )}
                </div>
              </Flex>
              <Text variant="body" theme={styling} style={{
                color: aiTheme.colors.textSecondary,
                lineHeight: '1.6'
              }}>
                {project.description}
              </Text>
              {project.note && (
                <div style={{
                  padding: '0.75rem',
                  background: aiTheme.glass.light,
                  border: `1px solid ${aiTheme.colors.aiBlue}30`,
                  borderRadius: aiTheme.borderRadius.md,
                  marginTop: '0.5rem'
                }}>
                  <Text variant="caption" theme={styling} style={{
                    color: aiTheme.colors.aiBlue,
                    fontSize: '0.85rem',
                    fontStyle: 'italic',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}>
                    <span>💡</span>
                    {project.note}
                  </Text>
                </div>
              )}
              <div style={{ marginTop: '0.5rem' }}>
                <Text variant="caption" theme={styling} style={{
                  color: aiTheme.colors.textSecondary,
                  marginBottom: '0.5rem',
                  display: 'block',
                  fontSize: '0.9rem'
                }}>
                  Technologies:
                </Text>
                <div>
                  {project.technologies.map((tech, index) => (
                    <SkillTag key={index} theme={styling}>
                      {tech}
                    </SkillTag>
                  ))}
                </div>
              </div>
            </Flex>
          </ProjectCard>
        ))}
      </ProjectsGrid>
    </TabContainer>
  );
};

export default ProjectsTab;
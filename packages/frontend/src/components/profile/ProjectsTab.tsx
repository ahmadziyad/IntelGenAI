// ProjectsTab - Personal projects content for tab display
import React, { useState } from 'react';
import styled from 'styled-components';
import { ExtendedProfileData, ProfileStyling } from '../../types/profile';
import { Heading, Text, Flex } from '../../styles/styled';

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

const ProjectCard = styled.div<{ theme: ProfileStyling }>`
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 12px;
  padding: 1.5rem;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  
  &:hover {
    background: rgba(255, 255, 255, 0.12);
    border-color: rgba(255, 255, 255, 0.25);
    transform: translateY(-4px);
    box-shadow: 0 12px 24px rgba(0, 0, 0, 0.2);
  }
`;

const ProjectImage = styled.img<{ theme: ProfileStyling }>`
  width: 100%;
  height: 200px;
  object-fit: cover;
  border-radius: 8px;
  margin-bottom: 1rem;
  background: rgba(255, 255, 255, 0.05);
`;

const ImageFallback = styled.div<{ theme: ProfileStyling }>`
  width: 100%;
  height: 200px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #94A3B8;
  font-size: 1rem;
  border: 2px dashed rgba(255, 255, 255, 0.2);
`;

const SkillTag = styled.span<{ theme: ProfileStyling }>`
  display: inline-block;
  padding: 0.25rem 0.75rem;
  margin: 2px 4px 2px 0;
  background: rgba(96, 165, 250, 0.2);
  color: #60A5FA;
  border-radius: 8px;
  font-size: 0.8rem;
  font-weight: 500;
`;

const ProjectLink = styled.a<{ theme: ProfileStyling }>`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: rgba(96, 165, 250, 0.2);
  color: #60A5FA;
  text-decoration: none;
  border-radius: 8px;
  font-weight: 500;
  transition: all 0.3s ease;
  border: 1px solid rgba(96, 165, 250, 0.3);
  
  &:hover {
    background: rgba(96, 165, 250, 0.3);
    color: #93C5FD;
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(96, 165, 250, 0.2);
  }
`;

const ProjectButton = styled.button<{ theme: ProfileStyling }>`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: rgba(167, 139, 250, 0.2);
  color: #A78BFA;
  border: 1px solid rgba(167, 139, 250, 0.3);
  border-radius: 8px;
  font-weight: 500;
  transition: all 0.3s ease;
  cursor: pointer;
  
  &:hover {
    background: rgba(167, 139, 250, 0.3);
    color: #C4B5FD;
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(167, 139, 250, 0.2);
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
          color: '#94A3B8',
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
        color: '#E2E8F0',
        fontSize: '1.5rem',
        fontWeight: '600'
      }}>
        Personal Projects
      </Heading>

      <ProjectsGrid>
        {profile.projects.map((project) => (
          <ProjectCard key={project.id} theme={styling}>
            <SafeProjectImage
              src={project.image}
              alt={`${project.name} screenshot`}
              theme={styling}
            />
            <Flex direction="column" gap="0.75rem" theme={styling}>
              <Flex justify="space-between" align="flex-start" theme={styling}>
                <Heading level={3} theme={styling} style={{
                  color: '#E2E8F0',
                  fontSize: '1.2rem',
                  flex: 1
                }}>
                  {project.name}
                </Heading>
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
                      View Project
                      <span>🔗</span>
                    </ProjectLink>
                  )
                )}
              </Flex>
              <Text variant="body" theme={styling} style={{
                color: '#CBD5E1',
                lineHeight: '1.6'
              }}>
                {project.description}
              </Text>
              <div style={{ marginTop: '0.5rem' }}>
                <Text variant="caption" theme={styling} style={{
                  color: '#94A3B8',
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
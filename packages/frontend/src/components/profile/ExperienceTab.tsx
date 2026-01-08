// ExperienceTab - Professional experience content for tab display
import React, { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { ExtendedProfileData, ProfileStyling } from '../../types/profile';
import { Heading, Text, Flex } from '../../styles/styled';
import { useTheme } from '../../contexts/ThemeContext';

interface ExperienceTabProps {
  profile: ExtendedProfileData;
  styling: ProfileStyling;
}

const TabContainer = styled.div`
  padding: 2rem;
  height: 100%;
  overflow-y: auto;
  background: transparent;
`;

const ExperienceCard = styled(motion.div)<{ theme: ProfileStyling; $currentTheme: any }>`
  background: ${props => props.$currentTheme.glass.medium};
  backdrop-filter: ${props => props.$currentTheme.glass.blur};
  border: 1px solid ${props => props.$currentTheme.glass.light};
  border-radius: ${props => props.$currentTheme.borderRadius.xl};
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  transition: all ${props => props.$currentTheme.animations.duration.normal} ${props => props.$currentTheme.animations.easing.smooth};
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: ${props => props.$currentTheme.gradients.neural};
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
    background: ${props => props.$currentTheme.gradients.neural};
    transform: scaleY(0);
    transition: transform 0.3s ease;
  }
  
  &:hover {
    background: ${props => props.$currentTheme.glass.heavy};
    border-color: ${props => props.$currentTheme.colors.aiCyan}40;
    transform: translateY(-4px);
    box-shadow: ${props => props.$currentTheme.shadows.aiGlow};
    
    &::before {
      left: 100%;
    }
    
    &::after {
      transform: scaleY(1);
    }
  }
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const SkillTag = styled.span<{ theme: ProfileStyling; $currentTheme: any }>`
  display: inline-block;
  padding: 0.35rem 0.75rem;
  margin: 2px 4px 2px 0;
  background: rgba(255, 255, 255, 0.1);
  color: ${props => props.$currentTheme.colors.textSecondary};
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: ${props => props.$currentTheme.borderRadius.md};
  font-size: 0.8rem;
  font-weight: 500;
  transition: all 0.2s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.15);
    color: ${props => props.$currentTheme.colors.text};
    border-color: rgba(255, 255, 255, 0.2);
    transform: translateY(-1px);
  }
`;

const ClientInfo = styled.div<{ $currentTheme: any }>`
  background: ${props => props.$currentTheme.glass.light};
  border: 1px solid ${props => props.$currentTheme.glass.border};
  border-radius: ${props => props.$currentTheme.borderRadius.md};
  padding: 0.75rem;
  margin: 0.75rem 0;
  border-left: 3px solid ${props => props.$currentTheme.colors.aiBlue};
`;

const DescriptionContainer = styled.div`
  position: relative;
`;

const DescriptionText = styled(Text)<{ $isExpanded: boolean }>`
  overflow: hidden;
  transition: all 0.3s ease;
  ${props => !props.$isExpanded && `
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    line-clamp: 2;
  `}
`;

const ReadMoreButton = styled.button<{ $currentTheme: any }>`
  background: none;
  border: none;
  color: ${props => props.$currentTheme.colors.aiBlue};
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  padding: 0.25rem 0;
  margin-top: 0.5rem;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 0.25rem;
  
  &:hover {
    color: ${props => props.$currentTheme.colors.aiCyan};
    text-decoration: underline;
  }
  
  &:focus {
    outline: 2px solid ${props => props.$currentTheme.colors.aiBlue}40;
    outline-offset: 2px;
    border-radius: 4px;
  }
`;

const ExperienceTab: React.FC<ExperienceTabProps> = ({ profile, styling }) => {
  const { theme } = useTheme();
  const hasExperience = profile.experience && profile.experience.length > 0;
  const hasEducation = profile.education && profile.education.length > 0;

  // Component for expandable description
  const ExpandableDescription: React.FC<{ description: string; styling: ProfileStyling }> = ({ description, styling }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    
    // Split description into sentences and check if it's longer than 2 lines worth
    const sentences = description.split('. ');
    const needsTruncation = sentences.length > 2 || description.length > 200;
    
    const toggleExpanded = () => {
      setIsExpanded(!isExpanded);
    };

    return (
      <DescriptionContainer>
        <DescriptionText 
          variant="body" 
          theme={styling} 
          $isExpanded={isExpanded}
          style={{
            color: theme.colors.textSecondary,
            lineHeight: '1.6',
            marginTop: '0.5rem'
          }}
        >
          {description}
        </DescriptionText>
        {needsTruncation && (
          <ReadMoreButton 
            onClick={toggleExpanded}
            $currentTheme={theme}
            aria-label={isExpanded ? 'Show less' : 'Show more'}
          >
            {isExpanded ? (
              <>
                Read less
                <span style={{ fontSize: '0.8rem' }}>▲</span>
              </>
            ) : (
              <>
                Read more
                <span style={{ fontSize: '0.8rem' }}>▼</span>
              </>
            )}
          </ReadMoreButton>
        )}
      </DescriptionContainer>
    );
  };

  if (!hasExperience && !hasEducation) {
    return (
      <TabContainer>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100%',
          color: theme.colors.textSecondary,
          fontSize: '1.1rem'
        }}>
          No experience or education information available
        </div>
      </TabContainer>
    );
  }

  return (
    <TabContainer>
      {/* Professional Experience Section */}
      {hasExperience && (
        <>
          <Heading level={2} theme={styling} style={{
            marginBottom: '2rem',
            color: theme.colors.text,
            fontSize: '1.5rem',
            fontWeight: '600'
          }}>
            Professional Experience
          </Heading>

          {profile.experience.map((exp) => (
            <ExperienceCard 
              key={exp.id} 
              theme={styling}
              $currentTheme={theme}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              <Flex direction="column" gap="0.5rem" theme={styling}>
                <Heading level={3} theme={styling} style={{
                  color: theme.colors.text,
                  fontSize: '1.2rem',
                  marginBottom: '0.25rem'
                }}>
                  {exp.position}
                </Heading>
                <Text variant="subtitle" theme={styling} style={{
                  color: theme.colors.aiBlue,
                  fontSize: '1rem',
                  fontWeight: '500'
                }}>
                  {exp.company} • {exp.duration}
                </Text>
                
                
                {/* Expandable Description */}
                <ExpandableDescription description={exp.description} styling={styling} />
                {exp.technologies && exp.technologies.length > 0 && (
                  <div style={{ marginTop: '1rem' }}>
                    <Text variant="caption" theme={styling} style={{
                      color: theme.colors.textSecondary,
                      marginBottom: '0.5rem',
                      display: 'block',
                      fontSize: '0.9rem'
                    }}>
                      Technologies:
                    </Text>
                    <div>
                      {exp.technologies.map((tech, index) => (
                        <SkillTag key={index} theme={styling} $currentTheme={theme}>
                          {tech}
                        </SkillTag>
                      ))}
                    </div>
                  </div>
                )}
              </Flex>
            </ExperienceCard>
          ))}
        </>
      )}

      {/* Education Section */}
      {hasEducation && (
        <>
          <Heading level={2} theme={styling} style={{
            marginBottom: '2rem',
            marginTop: hasExperience ? '3rem' : '0',
            color: theme.colors.text,
            fontSize: '1.5rem',
            fontWeight: '600'
          }}>
            Education
          </Heading>

          {profile.education.map((edu) => (
            <ExperienceCard key={edu.id} theme={styling} $currentTheme={theme}>
              <Flex direction="column" gap="0.5rem" theme={styling}>
                <Heading level={3} theme={styling} style={{
                  color: theme.colors.text,
                  fontSize: '1.2rem',
                  marginBottom: '0.25rem'
                }}>
                  {edu.degree}
                </Heading>
                <Text variant="subtitle" theme={styling} style={{
                  color: theme.colors.aiBlue,
                  fontSize: '1rem',
                  fontWeight: '500'
                }}>
                  {edu.institution} • {edu.field}
                </Text>
                <Text variant="caption" theme={styling} style={{
                  color: theme.colors.textSecondary,
                  fontSize: '0.9rem',
                  marginTop: '0.25rem'
                }}>
                  {edu.duration}
                </Text>
                {edu.description && (
                  <ExpandableDescription description={edu.description} styling={styling} />
                )}
              </Flex>
            </ExperienceCard>
          ))}
        </>
      )}
    </TabContainer>
  );
};

export default ExperienceTab;
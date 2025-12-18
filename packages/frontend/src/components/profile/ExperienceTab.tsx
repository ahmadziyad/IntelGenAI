// ExperienceTab - Professional experience content for tab display
import React from 'react';
import styled from 'styled-components';
import { ExtendedProfileData, ProfileStyling } from '../../types/profile';
import { Heading, Text, Flex } from '../../styles/styled';

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

const ExperienceCard = styled.div<{ theme: ProfileStyling }>`
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  
  &:hover {
    background: rgba(255, 255, 255, 0.12);
    border-color: rgba(255, 255, 255, 0.25);
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
  }
  
  &:last-child {
    margin-bottom: 0;
  }
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

const ExperienceTab: React.FC<ExperienceTabProps> = ({ profile, styling }) => {
  const hasExperience = profile.experience && profile.experience.length > 0;
  const hasEducation = profile.education && profile.education.length > 0;

  if (!hasExperience && !hasEducation) {
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
            color: '#E2E8F0',
            fontSize: '1.5rem',
            fontWeight: '600'
          }}>
            Professional Experience
          </Heading>

          {profile.experience.map((exp) => (
            <ExperienceCard key={exp.id} theme={styling}>
              <Flex direction="column" gap="0.5rem" theme={styling}>
                <Heading level={3} theme={styling} style={{
                  color: '#E2E8F0',
                  fontSize: '1.2rem',
                  marginBottom: '0.25rem'
                }}>
                  {exp.position}
                </Heading>
                <Text variant="subtitle" theme={styling} style={{
                  color: '#60A5FA',
                  fontSize: '1rem',
                  fontWeight: '500'
                }}>
                  {exp.company} • {exp.duration}
                </Text>
                <Text variant="body" theme={styling} style={{
                  color: '#CBD5E1',
                  lineHeight: '1.6',
                  marginTop: '0.5rem'
                }}>
                  {exp.description}
                </Text>
                {exp.technologies && exp.technologies.length > 0 && (
                  <div style={{ marginTop: '1rem' }}>
                    <Text variant="caption" theme={styling} style={{
                      color: '#94A3B8',
                      marginBottom: '0.5rem',
                      display: 'block',
                      fontSize: '0.9rem'
                    }}>
                      Technologies:
                    </Text>
                    <div>
                      {exp.technologies.map((tech, index) => (
                        <SkillTag key={index} theme={styling}>
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
            color: '#E2E8F0',
            fontSize: '1.5rem',
            fontWeight: '600'
          }}>
            Education
          </Heading>

          {profile.education.map((edu) => (
            <ExperienceCard key={edu.id} theme={styling}>
              <Flex direction="column" gap="0.5rem" theme={styling}>
                <Heading level={3} theme={styling} style={{
                  color: '#E2E8F0',
                  fontSize: '1.2rem',
                  marginBottom: '0.25rem'
                }}>
                  {edu.degree}
                </Heading>
                <Text variant="subtitle" theme={styling} style={{
                  color: '#60A5FA',
                  fontSize: '1rem',
                  fontWeight: '500'
                }}>
                  {edu.institution} • {edu.field}
                </Text>
                <Text variant="caption" theme={styling} style={{
                  color: '#94A3B8',
                  fontSize: '0.9rem',
                  marginTop: '0.25rem'
                }}>
                  {edu.duration}
                </Text>
                {edu.description && (
                  <Text variant="body" theme={styling} style={{
                    color: '#CBD5E1',
                    lineHeight: '1.6',
                    marginTop: '0.5rem'
                  }}>
                    {edu.description}
                  </Text>
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
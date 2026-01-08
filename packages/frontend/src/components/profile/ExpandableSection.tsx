// DetailedProfile - Extended profile information with clickable cards for popup details
import React from 'react';
import styled from 'styled-components';
import { ExtendedProfileData, ProfileStyling } from '../../types/profile';
import { media } from '../../styles/theme';

interface ExpandableSectionProps {
  onSectionClick: (section: string) => void;
  styling: ProfileStyling;
  profile: ExtendedProfileData;
}
const SectionContainer = styled.div<{ theme: ProfileStyling }>`
  width: 100%;
  margin: 0;
  padding: 0;
  background: transparent;
`;

const CompactRow = styled.div`
  display: flex;
  flex-direction: row;
  gap: 1rem;
  padding: 1rem 2rem 2rem;
  overflow-x: auto;
  flex-wrap: wrap;
  justify-content: center;

  /* Hide scrollbar but keep functionality */
  scrollbar-width: none;  /* Firefox */
  &::-webkit-scrollbar {
    display: none; /* Chrome/Safari */
  }

  ${media.mobile} {
    gap: 0.75rem;
    padding: 1rem 1rem 1.5rem;
    flex-wrap: nowrap;
  }
`;

const InfoCard = styled.button<{ theme: ProfileStyling }>`
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 12px;
  padding: 1rem 2rem;
  cursor: pointer;
  text-align: center;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  min-width: 140px;
  flex: 0 0 auto;
  position: relative;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);

  /* Modern gradient border effect on hover */
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 2px;
    background: linear-gradient(90deg, #60A5FA, #A78BFA);
    transform: scaleX(0);
    transition: transform 0.3s ease;
  }

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
    background: rgba(255, 255, 255, 0.12);
    border-color: rgba(255, 255, 255, 0.25);
    
    &::before {
      transform: scaleX(1);
    }
  }

  &:active {
    transform: translateY(0);
  }

  &:focus-visible {
    outline: 2px solid #60A5FA;
    outline-offset: 2px;
  }

  ${media.mobile} {
    padding: 0.75rem 1.5rem;
    min-width: 120px;
  }
`;

const CardTitle = styled.span<{ theme: ProfileStyling }>`
  font-size: 1rem;
  font-weight: 500;
  color: #E2E8F0;
  white-space: nowrap;

  ${media.mobile} {
    font-size: 0.9rem;
  }
`;

const ExpandableSection: React.FC<ExpandableSectionProps> = ({
  onSectionClick,
  styling,
  profile
}) => {
  return (
    <SectionContainer theme={styling}>


      <CompactRow>
        {/* Experience Card */}
        {profile.experience && profile.experience.length > 0 && (
          <InfoCard
            theme={styling}
            onClick={() => onSectionClick('experience')}
            aria-label="View Professional Experience"
          >
            <CardTitle theme={styling}>Experience</CardTitle>
          </InfoCard>
        )}

        {/* Skills Card */}
        {profile.skills && profile.skills.length > 0 && (
          <InfoCard
            theme={styling}
            onClick={() => onSectionClick('skills')}
            aria-label="View Skills and Technologies"
          >
            <CardTitle theme={styling}>Skills</CardTitle>
          </InfoCard>
        )}

        {/* Personal Projects Card */}
        {profile.projects && profile.projects.length > 0 && (
          <InfoCard
            theme={styling}
            onClick={() => onSectionClick('projects')}
            aria-label="View Personal Projects"
          >
            <CardTitle theme={styling}>Personal Projects</CardTitle>
          </InfoCard>
        )}

        {/* Certifications Card */}
        {profile.certifications && profile.certifications.length > 0 && (
          <InfoCard
            theme={styling}
            onClick={() => onSectionClick('certifications')}
            aria-label="View Certifications"
          >
            <CardTitle theme={styling}>Certifications</CardTitle>
          </InfoCard>
        )}

        {/* Contact Card */}
        {(profile.contact || profile.social) && (
          <InfoCard
            theme={styling}
            onClick={() => onSectionClick('contact')}
            aria-label="View Contact Information"
          >
            <CardTitle theme={styling}>Contact</CardTitle>
          </InfoCard>
        )}
      </CompactRow>
    </SectionContainer>
  );
};

export default ExpandableSection;

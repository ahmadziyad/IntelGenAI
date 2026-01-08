// ProfileCard - Modern card component with gradient backgrounds and responsive layout
import React, { useRef } from 'react';
import styled from 'styled-components';
import { motion, useInView } from 'framer-motion';
import { ProfileCardProps } from '../../types/profile';
import { Flex, Heading, Text } from '../../styles/styled';
import { media, animations } from '../../styles/theme';
import ProfileImage from './ProfileImage';

// Styled card container with modern design and enhanced animations
const StyledProfileCard = styled(motion.div) <{ theme: any }>`
  width: 100%;
  overflow: visible;
  position: relative;
  transition: all ${animations.duration.normal} ${animations.easing.easeInOut};
  
  /* Completely transparent - no visual separation from tab content */
  background: transparent;
  box-shadow: none;
  border-radius: 0;
  border: none;

  /* Responsive adjustments */
  ${media.mobile} {
    margin: 0; /* Removed margin */
  }

  ${media.tablet} {
    max-width: 500px;
  }

  ${media.desktop} {
    max-width: 600px;
  }

  /* Touch device optimizations */
  ${media.touch} {
    &:hover {
      transform: none;
      
      &::before {
        height: 4px;
      }
      
      .profile-image {
        transform: none;
      }
      
      .action-button {
        transform: none;
      }
      
      .profile-content {
        .name-heading {
          background-size: 100% 100%;
        }
        
        .title-text {
          color: ${props => props.theme.colors.textSecondary};
        }
      }
    }
    
    &:active {
      transform: scale(0.98);
    }
  }

  /* Reduced motion support */
  ${media.reducedMotion} {
    transition: none;
    
    &:hover {
      transform: none;
      
      .profile-image {
        transform: none;
      }
      
      .action-button {
        transform: none;
      }
    }
  }
`;

// Enhanced responsive grid container for card content organization
const CardGrid = styled.div<{ theme: any }>`
  display: grid;
  align-items: center;
  transition: all 300ms cubic-bezier(0.4, 0, 0.2, 1);
  
  /* Mobile-first layout - stack vertically */
  grid-template-columns: 1fr;
  grid-template-areas: 
    "image"
    "content";
  gap: 1rem;
  padding: 1.5rem 2rem;
  text-align: center;

  /* Mobile landscape - compact vertical layout */
  ${media.mobileLandscape} {
    gap: 1rem;
    padding: 1rem 1.5rem;
  }

  /* Tablet layout - side-by-side with responsive adjustments */
  ${media.tablet} {
    grid-template-columns: auto 1fr;
    grid-template-areas: 
      "image content";
    gap: 2rem;
    padding: 2rem 3rem;
    text-align: left;
  }

  /* Tablet portrait - maintain side-by-side but reduce spacing */
  ${media.tabletPortrait} {
    gap: 1.5rem;
  }

  /* Desktop and larger - optimal spacing */
  ${media.desktop} {
    gap: 2.5rem;
    padding: 2.5rem 3rem;
  }

  /* Large desktop - maximum spacing */
  ${media.desktopLarge} {
    gap: 3rem;
    padding: 3rem 4rem;
  }

  /* Reduced motion support */
  ${media.reducedMotion} {
    transition: none;
  }
`;

// Enhanced responsive image container with modern styling
const ImageContainer = styled.div<{ theme: any }>`
  grid-area: image;
  border-radius: 50%;
  overflow: hidden;
  background: linear-gradient(135deg, #60A5FA 0%, #A78BFA 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  position: relative;
  transition: all 300ms cubic-bezier(0.4, 0, 0.2, 1);
  
  /* Mobile-first responsive sizing - larger for tab layout */
  width: 80px;
  height: 80px;
  justify-self: center;

  /* Mobile large */
  ${media.mobileLarge} {
    width: 90px;
    height: 90px;
  }

  /* Mobile landscape - maintain good size */
  ${media.mobileLandscape} {
    width: 80px;
    height: 80px;
  }

  /* Tablet responsive sizing */
  ${media.tablet} {
    width: 120px;
    height: 120px;
    justify-self: start;
  }

  /* Tablet landscape - optimize for horizontal space */
  ${media.tabletLandscape} {
    width: 110px;
    height: 110px;
  }

  /* Desktop optimal sizing */
  ${media.desktop} {
    width: 140px;
    height: 140px;
  }

  /* Large desktop - maximum impact */
  ${media.desktopLarge} {
    width: 160px;
    height: 160px;
  }
  
  /* Gradient ring effect */
  &::before {
    content: '';
    position: absolute;
    top: -3px;
    left: -3px;
    right: -3px;
    bottom: -3px;
    background: linear-gradient(135deg, #60A5FA 0%, #A78BFA 100%);
    border-radius: 50%;
    z-index: -1;
  }

  .profile-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform ${animations.duration.normal} ${animations.easing.easeInOut};
  }

  /* Hover effects for devices that support hover */
  ${media.hover} {
    &:hover .profile-image {
      transform: scale(1.05);
    }
  }

  /* Enhanced hover interactions */
  ${media.hover} {
    &:hover .profile-image {
      transform: scale(1.08) rotate(3deg);
      box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
    }
  }

  /* Touch device optimizations */
  ${media.touch} {
    /* Remove hover effects on touch devices */
    &:hover .profile-image {
      transform: none;
      box-shadow: none;
    }
    
    &:active .profile-image {
      transform: scale(0.95);
    }
  }

  /* Reduced motion support */
  ${media.reducedMotion} {
    transition: none;
    
    .profile-image {
      transition: none;
    }
    
    &:hover .profile-image {
      transform: none;
      box-shadow: none;
    }
  }
`;

// Content area with typography hierarchy
const ContentArea = styled.div<{ theme: any }>`
  grid-area: content;
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
  min-width: 0; /* Prevent overflow */

  /* Mobile adjustments */
  ${media.mobile} {
    text-align: center;
    align-items: center;
  }
`;

// Name heading with gradient text and enhanced animations
const NameHeading = styled(Heading) <{ theme: any }>`
  background: ${props => props.theme.gradients.primary};
  background-size: 100% 100%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  font-size: ${props => props.theme.typography.fontSize.medium};
  font-weight: 700;
  margin-bottom: 0;
  transition: all ${animations.duration.normal} ${animations.easing.easeInOut};

  ${media.mobile} {
    font-size: ${props => props.theme.typography.fontSize.medium};
  }

  ${media.tablet} {
    font-size: ${props => props.theme.typography.fontSize.large};
  }

  ${media.desktop} {
    font-size: ${props => props.theme.typography.fontSize.large};
  }

  /* Reduced motion support */
  ${media.reducedMotion} {
    transition: none;
  }
`;

// Title text with secondary color and smooth transitions
const TitleText = styled(Text) <{ theme: any }>`
  color: ${props => props.theme.colors.textSecondary};
  font-size: ${props => props.theme.typography.fontSize.small};
  font-weight: 500;
  margin-bottom: 0;
  transition: color ${animations.duration.normal} ${animations.easing.easeInOut};

  ${media.mobile} {
    font-size: ${props => props.theme.typography.fontSize.small};
  }

  /* Reduced motion support */
  ${media.reducedMotion} {
    transition: none;
  }
`;

// Description with proper line height and truncation
const DescriptionText = styled(Text) <{ theme: any }>`
  color: #E2E8F0;
  font-size: 0.8rem;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;

  ${media.mobile} {
    -webkit-line-clamp: 2;
    font-size: 0.75rem;
  }

  ${media.tablet} {
    -webkit-line-clamp: 2;
  }
`;



// Placeholder image component for fallback
const PlaceholderImage = styled.div<{ theme: any }>`
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #60A5FA 0%, #A78BFA 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 2rem;
  font-weight: bold;
`;

const ProfileCard: React.FC<ProfileCardProps> = ({
  profile,
  styling,
  headingId,
  descriptionId
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(cardRef, { once: true, margin: "-50px" });

  // Extract first letter of name for placeholder
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  // Animation variants for staggered content reveal
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: {
      opacity: 0,
      y: 20,
      scale: 0.95,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,

    },
  };

  const imageVariants = {
    hidden: {
      opacity: 0,
      scale: 0.8,
      rotate: -10,
    },
    visible: {
      opacity: 1,
      scale: 1,
      rotate: 0,
    },
  };

  const buttonVariants = {
    hidden: {
      opacity: 0,
      y: 30,
      scale: 0.9,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,

    },
  };

  return (
    <StyledProfileCard
      ref={cardRef}
      theme={styling}
      data-testid="profile-card"
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={containerVariants}

    >
      <CardGrid theme={styling}>
        {/* Profile Image with entrance animation */}
        <ImageContainer theme={styling}>
          <motion.div variants={imageVariants}>
            {profile.image?.src ? (
              <ProfileImage
                src={profile.image.src}
                alt={profile.image.alt}
                size="medium"
                shape="circle"
              />
            ) : (
              <PlaceholderImage theme={styling}>
                {getInitials(profile.name)}
              </PlaceholderImage>
            )}
          </motion.div>
        </ImageContainer>

        {/* Profile Content with staggered animations */}
        <ContentArea theme={styling} className="profile-content">
          <motion.div variants={itemVariants}>
            <DescriptionText
              theme={styling}
              variant="body"
              id={descriptionId}
              style={{ fontSize: '1rem', lineHeight: '1.5', WebkitLineClamp: 'unset' }}
            >
              {profile.description}
            </DescriptionText>
          </motion.div>
        </ContentArea>


      </CardGrid>
    </StyledProfileCard>
  );
};

export default ProfileCard;
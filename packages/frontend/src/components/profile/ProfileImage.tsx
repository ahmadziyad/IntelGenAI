// ProfileImage - Optimized image display component with lazy loading, fallback handling, and accessibility
import React, { useState, useRef, useEffect } from 'react';
import styled, { css } from 'styled-components';
import { motion } from 'framer-motion';
import { ProfileImageProps } from '../../types/profile';
import { media, animations } from '../../styles/theme';
import { 
  createProfileError, 
  ProfileErrorType,
  ProfileError 
} from '../../utils/errorHandling';
import { 
  createOptimizedImage, 
  globalLazyLoader,
  OptimizedImageResult 
} from '../../utils/imageOptimization';
import {
  usePrefersReducedMotion,
  createAccessibleFocusStyles,
  generateAccessibleId
} from '../../utils/accessibility';

// Styled components for the image container and image element with enhanced animations
const ImageContainer = styled(motion.div)<{
  $size: 'small' | 'medium' | 'large';
  $shape: 'circle' | 'rounded' | 'square';
  $isLoading: boolean;
  $hasError: boolean;
}>`
  position: relative;
  display: inline-block;
  overflow: hidden;
  background: linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%);
  transition: all ${animations.duration.normal} ${animations.easing.easeInOut};
  cursor: pointer;

  /* Enhanced hover effects for devices that support hover */
  ${media.hover} {
    &:hover {
      transform: scale(1.05) rotate(2deg);
      box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
      
      img {
        filter: brightness(1.1) contrast(1.05);
      }
    }
  }

  /* Touch device interactions */
  ${media.touch} {
    &:active {
      transform: scale(0.95);
    }
    
    /* Remove hover effects on touch devices */
    &:hover {
      transform: none;
      box-shadow: none;
      
      img {
        filter: none;
      }
    }
  }

  /* Focus styles for accessibility */
  &:focus-visible {
    ${() => createAccessibleFocusStyles('#3B82F6')};
    box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.2);
  }

  /* Reduced motion support */
  ${media.reducedMotion} {
    transition: none;
    
    &:hover {
      transform: none;
      
      img {
        filter: none;
      }
    }
    
    &:active {
      transform: none;
    }
  }

  /* Size variants */
  ${props => props.$size === 'small' && css`
    width: 60px;
    height: 60px;
    
    ${media.tablet} {
      width: 80px;
      height: 80px;
    }
  `}

  ${props => props.$size === 'medium' && css`
    width: 100px;
    height: 100px;
    
    ${media.tablet} {
      width: 120px;
      height: 120px;
    }
    
    ${media.desktop} {
      width: 140px;
      height: 140px;
    }
  `}

  ${props => props.$size === 'large' && css`
    width: 140px;
    height: 140px;
    
    ${media.tablet} {
      width: 180px;
      height: 180px;
    }
    
    ${media.desktop} {
      width: 200px;
      height: 200px;
    }
  `}

  /* Shape variants */
  ${props => props.$shape === 'circle' && css`
    border-radius: 50%;
  `}

  ${props => props.$shape === 'rounded' && css`
    border-radius: 12px;
  `}

  ${props => props.$shape === 'square' && css`
    border-radius: 4px;
  `}

  /* Loading state */
  ${props => props.$isLoading && css`
    &::after {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent);
      animation: shimmer 1.5s infinite;
    }

    @keyframes shimmer {
      0% { transform: translateX(-100%); }
      100% { transform: translateX(100%); }
    }
  `}

  /* Error state */
  ${props => props.$hasError && css`
    display: flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(135deg, #fee2e2 0%, #fecaca 100%);
    color: #dc2626;
  `}
`;

const Image = styled.img<{
  $isLoaded: boolean;
  $shape: 'circle' | 'rounded' | 'square';
}>`
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
  transition: all ${animations.duration.normal} ${animations.easing.easeInOut};
  opacity: ${props => props.$isLoaded ? 1 : 0};

  /* Maintain aspect ratio */
  aspect-ratio: 1;

  /* Shape-specific adjustments */
  ${props => props.$shape === 'circle' && css`
    border-radius: 50%;
  `}

  ${props => props.$shape === 'rounded' && css`
    border-radius: 12px;
  `}

  ${props => props.$shape === 'square' && css`
    border-radius: 4px;
  `}

  /* Touch device optimizations */
  ${media.touch} {
    transition: opacity ${animations.duration.normal} ${animations.easing.easeInOut};
  }

  /* Reduced motion support */
  ${media.reducedMotion} {
    transition: opacity ${animations.duration.fast} ease;
  }
`;

const FallbackIcon = styled.div<{
  $size: 'small' | 'medium' | 'large';
}>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  color: #9ca3af;
  
  svg {
    ${props => props.$size === 'small' && css`
      width: 24px;
      height: 24px;
    `}

    ${props => props.$size === 'medium' && css`
      width: 32px;
      height: 32px;
    `}

    ${props => props.$size === 'large' && css`
      width: 40px;
      height: 40px;
    `}
  }
`;

// Default user icon SVG
const UserIcon: React.FC = () => (
  <svg
    fill="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      fillRule="evenodd"
      d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z"
      clipRule="evenodd"
    />
  </svg>
);

const ProfileImage: React.FC<ProfileImageProps> = ({ 
  src, 
  alt, 
  size = 'medium', 
  shape = 'rounded' 
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [errorDetails, setErrorDetails] = useState<ProfileError | null>(null);
  const [optimizedImage, setOptimizedImage] = useState<OptimizedImageResult | null>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Accessibility state
  const [imageId] = useState(() => generateAccessibleId('profile-image'));
  const prefersReducedMotion = usePrefersReducedMotion();
  
  const MAX_RETRY_ATTEMPTS = 2;
  const RETRY_DELAY = 1000; // 1 second

  // Initialize optimized image configuration
  useEffect(() => {
    const initializeOptimizedImage = async () => {
      try {
        const sizeMap = { small: 160, medium: 280, large: 400 };
        const targetWidth = sizeMap[size];
        
        const optimized = await createOptimizedImage(src, {
          width: targetWidth,
          height: targetWidth,
          quality: 85,
          format: 'auto',
          lazy: true
        });
        
        setOptimizedImage(optimized);
      } catch (error) {
        createProfileError(
          ProfileErrorType.IMAGE_LOAD_ERROR,
          `Failed to create optimized image configuration: ${error instanceof Error ? error.message : 'Unknown error'}`,
          { src, size }
        );
        
        // Fallback to basic configuration
        setOptimizedImage({
          src,
          loading: 'lazy',
          decoding: 'async'
        });
      }
    };

    initializeOptimizedImage();
  }, [src, size]);

  // Enhanced intersection observer with global lazy loader
  useEffect(() => {
    // Check if IntersectionObserver is available and properly implemented
    if (typeof IntersectionObserver === 'undefined' || 
        typeof window === 'undefined' ||
        process.env.NODE_ENV === 'test') {
      // In test environment or when IntersectionObserver is not available, immediately set as in view
      setIsInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      {
        threshold: 0.1,
        rootMargin: '50px',
      }
    );

    const currentContainer = containerRef.current;
    const currentImg = imgRef.current;

    if (currentContainer) {
      observer.observe(currentContainer);
      
      // Also register with global lazy loader if image element exists
      if (currentImg) {
        globalLazyLoader.observe(currentImg);
      }
    }

    return () => {
      observer.disconnect();
      if (currentImg) {
        globalLazyLoader.unobserve(currentImg);
      }
    };
  }, []);

  // Handle image loading
  const handleImageLoad = () => {
    setIsLoading(false);
    setIsLoaded(true);
    setHasError(false);
  };

  // Enhanced image error handling with retry mechanism
  const handleImageLoadError = (event: React.SyntheticEvent<HTMLImageElement, Event>) => {
    const imgElement = event.currentTarget;
    const errorSrc = imgElement.src;
    
    // Create detailed error information
    const error = createProfileError(
      ProfileErrorType.IMAGE_LOAD_ERROR,
      `Failed to load image after ${retryCount + 1} attempts`,
      { 
        originalSrc: src,
        currentSrc: errorSrc,
        retryCount,
        size,
        shape,
        naturalWidth: imgElement.naturalWidth,
        naturalHeight: imgElement.naturalHeight
      }
    );
    
    setErrorDetails(error);
    
    // Retry logic
    if (retryCount < MAX_RETRY_ATTEMPTS) {
      setTimeout(() => {
        setRetryCount(prev => prev + 1);
        setIsLoading(true);
        setHasError(false);
        
        // Try different image optimization parameters on retry
        if (errorSrc.includes('unsplash.com')) {
          const url = new URL(errorSrc);
          url.searchParams.set('q', '70'); // Lower quality
          url.searchParams.delete('fm'); // Remove WebP format
          // For retry, we'll use the original src
          imgElement.src = src;
        } else {
          // For other sources, try the original URL again
          imgElement.src = src;
        }
      }, RETRY_DELAY * (retryCount + 1)); // Exponential backoff
      
      return;
    }
    
    // Final failure - show fallback
    setIsLoading(false);
    setHasError(true);
    setIsLoaded(false);
  };

  // Animation variants for image entrance (respecting reduced motion)
  const imageVariants = {
    hidden: { 
      opacity: 0, 
      scale: prefersReducedMotion ? 1 : 0.8,
      rotate: prefersReducedMotion ? 0 : -5,
    },
    visible: { 
      opacity: 1, 
      scale: 1,
      rotate: 0,
      transition: {
        duration: prefersReducedMotion ? 0.1 : 0.6,
      },
    },
  };

  return (
    <ImageContainer
      ref={containerRef}
      $size={size}
      $shape={shape}
      $isLoading={isLoading}
      $hasError={hasError}
      data-testid="profile-image-container"
      className="profile-image"
      variants={imageVariants}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      whileHover={prefersReducedMotion ? {} : { 
        scale: 1.08,
        rotate: 3,
        transition: { duration: 0.3 }
      }}
      whileTap={prefersReducedMotion ? {} : { 
        scale: 0.95,
        transition: { duration: 0.1 }
      }}
      role="img"
      aria-labelledby={imageId}
      tabIndex={0}
    >
      {hasError ? (
        <FallbackIcon $size={size} data-testid="profile-image-fallback">
          <UserIcon />
          <span 
            id={imageId}
            style={{ 
              position: 'absolute', 
              left: '-10000px', 
              width: '1px', 
              height: '1px', 
              overflow: 'hidden' 
            }}
          >
            {alt} (image failed to load)
          </span>
        </FallbackIcon>
      ) : (
        isInView && optimizedImage && (
          <Image
            ref={imgRef}
            src={optimizedImage.src}
            srcSet={optimizedImage.srcSet}
            sizes={optimizedImage.sizes}
            alt={alt}
            $shape={shape}
            $isLoaded={isLoaded}
            onLoad={handleImageLoad}
            onError={handleImageLoadError}
            loading={optimizedImage.loading}
            decoding={optimizedImage.decoding}
            data-testid="profile-image"
            data-retry-count={retryCount}
            data-error-details={errorDetails ? JSON.stringify(errorDetails) : undefined}
            data-src={optimizedImage.src}
            data-srcset={optimizedImage.srcSet}
            id={imageId}
            className="lazy"
          />
        )
      )}
    </ImageContainer>
  );
};

export default ProfileImage;
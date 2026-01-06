import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme, ThemeOption } from '../contexts/ThemeContext';

const DropdownContainer = styled.div`
  position: relative;
  display: inline-block;
`;

const DropdownButton = styled.button<{ theme: any }>`
  background: ${props => props.theme.glass.medium};
  backdrop-filter: ${props => props.theme.glass.blur};
  border: 1px solid ${props => props.theme.glass.border};
  border-radius: ${props => props.theme.borderRadius.lg};
  color: ${props => props.theme.colors.text};
  padding: 0.75rem 1rem;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all ${props => props.theme.animations.duration.normal} ${props => props.theme.animations.easing.smooth};
  min-width: 140px;
  justify-content: space-between;
  white-space: nowrap;
  
  &:hover {
    background: ${props => props.theme.glass.heavy};
    border-color: ${props => props.theme.colors.aiCyan}40;
    transform: translateY(-1px);
    box-shadow: ${props => props.theme.shadows.glow};
  }
  
  &:active {
    transform: translateY(0);
  }
  
  @media (max-width: 768px) {
    padding: 0.5rem 0.75rem;
    font-size: 0.8rem;
    min-width: 120px;
  }
  
  @media (max-width: 480px) {
    padding: 0.4rem 0.6rem;
    font-size: 0.75rem;
    min-width: 100px;
    gap: 0.25rem;
  }
`;

const DropdownIcon = styled.span<{ isOpen: boolean; theme: any }>`
  transition: transform ${props => props.theme.animations.duration.fast} ${props => props.theme.animations.easing.smooth};
  transform: ${props => props.isOpen ? 'rotate(180deg)' : 'rotate(0deg)'};
  font-size: 0.8rem;
  color: ${props => props.theme.colors.textSecondary};
`;

const DropdownMenu = styled(motion.div)<{ theme: any }>`
  position: absolute;
  top: calc(100% + 0.5rem);
  right: 0;
  background: ${props => props.theme.colors.surface};
  backdrop-filter: ${props => props.theme.glass.blur};
  border: 1px solid ${props => props.theme.glass.border};
  border-radius: ${props => props.theme.borderRadius.lg};
  box-shadow: ${props => props.theme.shadows.floating};
  z-index: 1000;
  min-width: 280px;
  overflow: hidden;
  max-height: 70vh;
  overflow-y: auto;
  
  @media (max-width: 768px) {
    min-width: 240px;
    right: -20px;
    max-height: 60vh;
  }
  
  @media (max-width: 480px) {
    min-width: 200px;
    right: -40px;
    max-height: 50vh;
    top: calc(100% + 0.25rem);
  }
`;

const DropdownHeader = styled.div<{ theme: any }>`
  padding: 1rem;
  border-bottom: 1px solid ${props => props.theme.glass.border};
  background: ${props => props.theme.glass.light};
`;

const DropdownTitle = styled.h3<{ theme: any }>`
  margin: 0;
  font-size: 0.9rem;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
`;

const ThemeOptionItem = styled.button<{ isActive: boolean; theme: any }>`
  width: 100%;
  padding: 1rem;
  border: none;
  background: ${props => props.isActive ? props.theme.glass.medium : 'transparent'};
  color: ${props => props.theme.colors.text};
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  transition: all ${props => props.theme.animations.duration.fast} ${props => props.theme.animations.easing.smooth};
  border-bottom: 1px solid ${props => props.theme.glass.border};
  
  &:last-child {
    border-bottom: none;
  }
  
  &:hover {
    background: ${props => props.theme.glass.medium};
  }
  
  &:active {
    background: ${props => props.theme.glass.heavy};
  }
`;

const ThemePreview = styled.div<{ color: string }>`
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: ${props => props.color};
  border: 2px solid rgba(255, 255, 255, 0.2);
  flex-shrink: 0;
`;

const ThemeInfo = styled.div`
  flex: 1;
  text-align: left;
`;

const ThemeName = styled.div<{ theme: any }>`
  font-weight: 600;
  font-size: 0.9rem;
  color: ${props => props.theme.colors.text};
  margin-bottom: 0.25rem;
`;

const ThemeDescription = styled.div<{ theme: any }>`
  font-size: 0.75rem;
  color: ${props => props.theme.colors.textSecondary};
  line-height: 1.3;
`;

const ActiveIndicator = styled.span<{ theme: any }>`
  color: ${props => props.theme.colors.aiCyan};
  font-size: 1rem;
`;

const ThemeDropdown: React.FC = () => {
  const { currentTheme, setTheme, themeOptions, theme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Close dropdown on escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, []);

  const handleThemeSelect = (themeId: string) => {
    setTheme(themeId as any);
    setIsOpen(false);
  };

  const currentThemeOption = themeOptions.find(option => option.id === currentTheme);

  return (
    <DropdownContainer ref={dropdownRef}>
      <DropdownButton
        onClick={() => setIsOpen(!isOpen)}
        theme={theme}
        aria-label="Theme selector"
        aria-expanded={isOpen}
      >
        <span>🎨 {currentThemeOption?.name || 'Theme'}</span>
        <DropdownIcon isOpen={isOpen} theme={theme}>
          ▼
        </DropdownIcon>
      </DropdownButton>

      <AnimatePresence>
        {isOpen && (
          <DropdownMenu
            theme={theme}
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
          >
            <DropdownHeader theme={theme}>
              <DropdownTitle theme={theme}>Choose Theme</DropdownTitle>
            </DropdownHeader>
            
            {themeOptions.map((option: ThemeOption) => (
              <ThemeOptionItem
                key={option.id}
                isActive={option.id === currentTheme}
                theme={theme}
                onClick={() => handleThemeSelect(option.id)}
              >
                <ThemePreview color={option.preview} />
                <ThemeInfo>
                  <ThemeName theme={theme}>{option.name}</ThemeName>
                  <ThemeDescription theme={theme}>{option.description}</ThemeDescription>
                </ThemeInfo>
                {option.id === currentTheme && (
                  <ActiveIndicator theme={theme}>✓</ActiveIndicator>
                )}
              </ThemeOptionItem>
            ))}
          </DropdownMenu>
        )}
      </AnimatePresence>
    </DropdownContainer>
  );
};

export default ThemeDropdown;
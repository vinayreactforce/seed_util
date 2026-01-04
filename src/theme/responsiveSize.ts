// utils/scaling.ts
import { Dimensions, StatusBar, Platform } from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// iPhone 15 baseline (width x height)
const GUIDELINE_BASE_WIDTH = 393;
const GUIDELINE_BASE_HEIGHT = 852;

/**
 * Horizontal scaling (width-based)
 */
export const scale = (size: number): number => (SCREEN_WIDTH / GUIDELINE_BASE_WIDTH) * size;

/**
 * Vertical scaling (height-based)
 */
export const verticalScale = (size: number): number =>
  (SCREEN_HEIGHT / GUIDELINE_BASE_HEIGHT) * size;

/**
 * Moderate horizontal scaling (soft scaling for fonts or spacing)
 * factor = 0 → no scale, factor = 1 → full scale
 */
export const moderateScale = (size: number, factor = 0.5): number =>
  size + (scale(size) - size) * factor;

/**
 * Moderate vertical scaling
 */
export const moderateVerticalScale = (size: number, factor = 0.5): number =>
  size + (verticalScale(size) - size) * factor;

/**
 * Text scaling as a percentage of screen height
 * Handles taller screens and notch adjustments
 * @param percent - percentage of screen height (0-100)
 */
export const textScale = (percent: number): number => {
  const ratio = SCREEN_HEIGHT / SCREEN_WIDTH;

  // Adjust device height for Android status bar
  const adjustedHeight =
    Platform.OS === 'android' ? SCREEN_HEIGHT - (StatusBar.currentHeight ?? 0) : SCREEN_HEIGHT;

  // Adjust guideline depending on screen ratio (for taller phones like 18.5:9)
  const guidelineHeight = ratio > 1.8 ? adjustedHeight * 0.126 : adjustedHeight * 0.15;

  return Math.round((percent * guidelineHeight) / 100);
};

/**
 * Export constants for convenience
 */
export { SCREEN_WIDTH as width, SCREEN_HEIGHT as height };

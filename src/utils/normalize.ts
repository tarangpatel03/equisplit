import { Dimensions, PixelRatio, useWindowDimensions } from 'react-native';

const { width: INITIAL_WIDTH, height: INITIAL_HEIGHT } = Dimensions.get('window');

export const SCREEN_WIDTH = INITIAL_WIDTH;
export const SCREEN_HEIGHT = INITIAL_HEIGHT;

const GUIDELINE_BASE_WIDTH = 375;
const GUIDELINE_BASE_HEIGHT = 812;

/**
 * Standard horizontal scale based on 375dp guideline width
 */
export const scale = (size: number): number => {
  return PixelRatio.roundToNearestPixel((SCREEN_WIDTH / GUIDELINE_BASE_WIDTH) * size);
};

/**
 * Standard vertical scale based on 812dp guideline height
 */
export const verticalScale = (size: number): number => {
  return PixelRatio.roundToNearestPixel((SCREEN_HEIGHT / GUIDELINE_BASE_HEIGHT) * size);
};

/**
 * Moderate scaling that dampens extreme size variations on very small/large devices
 * @param size Target size at 375dp base
 * @param factor Factor between 0 (no resize) and 1 (full proportional resize). Default 0.5.
 */
export const moderateScale = (size: number, factor: number = 0.5): number => {
  const scaled = (SCREEN_WIDTH / GUIDELINE_BASE_WIDTH) * size;
  return PixelRatio.roundToNearestPixel(size + (scaled - size) * factor);
};

/**
 * Moderate vertical scaling
 */
export const moderateVerticalScale = (size: number, factor: number = 0.5): number => {
  const scaled = (SCREEN_HEIGHT / GUIDELINE_BASE_HEIGHT) * size;
  return PixelRatio.roundToNearestPixel(size + (scaled - size) * factor);
};

/**
 * Backward-compatible normalize function
 */
export const normalize = (
  size: number,
  based: 'width' | 'height' = 'width',
): number => {
  return based === 'height' ? verticalScale(size) : scale(size);
};

/**
 * Hook providing dynamic responsive dimensions, flags, and scalers that update on orientation/split screen changes
 */
export const useResponsive = () => {
  const { width, height } = useWindowDimensions();

  const isSmallDevice = width < 360;
  const isTablet = width >= 600;
  const isLandscape = width > height;

  const dynScale = (size: number) =>
    PixelRatio.roundToNearestPixel((width / GUIDELINE_BASE_WIDTH) * size);

  const dynVerticalScale = (size: number) =>
    PixelRatio.roundToNearestPixel((height / GUIDELINE_BASE_HEIGHT) * size);

  const dynModerateScale = (size: number, factor: number = 0.5) => {
    const scaled = (width / GUIDELINE_BASE_WIDTH) * size;
    return PixelRatio.roundToNearestPixel(size + (scaled - size) * factor);
  };

  return {
    width,
    height,
    isSmallDevice,
    isTablet,
    isLandscape,
    scale: dynScale,
    verticalScale: dynVerticalScale,
    moderateScale: dynModerateScale,
  };
};

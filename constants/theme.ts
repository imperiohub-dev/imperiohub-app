/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import { Platform } from 'react-native';

const tintColorLight = '#0a7ea4';
const tintColorDark = '#fff';

/**
 * Brand Colors - Define your main brand colors here
 */
export const BrandColors = {
  primary: '#0a7ea4',
  secondary: '#FF6B6B',
  tertiary: '#4ECDC4',
  success: '#4CAF50',
  warning: '#FFC107',
  error: '#F44336',
  info: '#2196F3',
};

/**
 * Neutral Colors - Grayscale palette
 */
export const NeutralColors = {
  white: '#FFFFFF',
  black: '#000000',
  gray50: '#F9FAFB',
  gray100: '#F3F4F6',
  gray200: '#E5E7EB',
  gray300: '#D1D5DB',
  gray400: '#9CA3AF',
  gray500: '#6B7280',
  gray600: '#4B5563',
  gray700: '#374151',
  gray800: '#1F2937',
  gray900: '#111827',
};

/**
 * Theme Colors - Light and Dark mode
 */
export const Colors = {
  light: {
    text: '#11181C',
    textSecondary: NeutralColors.gray600,
    textMuted: NeutralColors.gray500,
    background: '#fff',
    backgroundSecondary: NeutralColors.gray50,
    tint: tintColorLight,
    border: NeutralColors.gray200,
    icon: '#687076',
    tabIconDefault: '#687076',
    tabIconSelected: tintColorLight,
    card: '#fff',
    overlay: 'rgba(0, 0, 0, 0.5)',
  },
  dark: {
    text: '#ECEDEE',
    textSecondary: NeutralColors.gray400,
    textMuted: NeutralColors.gray500,
    background: '#151718',
    backgroundSecondary: '#1F2937',
    tint: tintColorDark,
    border: NeutralColors.gray700,
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: tintColorDark,
    card: '#1F2937',
    overlay: 'rgba(0, 0, 0, 0.7)',
  },
};

/**
 * Spacing Scale - Consistent spacing throughout the app
 */
export const Spacing = {
  xxs: 2,
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
  xxxl: 64,
};

/**
 * Border Radius - Rounded corners
 */
export const BorderRadius = {
  none: 0,
  xs: 2,
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  xxl: 24,
  full: 9999,
};

/**
 * Font Sizes - Typography scale
 */
export const FontSizes = {
  xxs: 10,
  xs: 12,
  sm: 14,
  md: 16,
  lg: 18,
  xl: 20,
  xxl: 24,
  xxxl: 32,
  display: 40,
  huge: 48,
};

/**
 * Font Weights - Typography weights
 */
export const FontWeights = {
  thin: '100' as const,
  extralight: '200' as const,
  light: '300' as const,
  normal: '400' as const,
  medium: '500' as const,
  semibold: '600' as const,
  bold: '700' as const,
  extrabold: '800' as const,
  black: '900' as const,
};

/**
 * Line Heights - Typography line heights
 */
export const LineHeights = {
  tight: 1.2,
  normal: 1.5,
  relaxed: 1.75,
  loose: 2,
};

/**
 * Icon Sizes - Standard icon sizes
 */
export const IconSizes = {
  xs: 12,
  sm: 16,
  md: 24,
  lg: 32,
  xl: 48,
  xxl: 64,
};

/**
 * Z-Index - Layer ordering
 */
export const ZIndex = {
  base: 0,
  dropdown: 1000,
  sticky: 1100,
  fixed: 1200,
  overlay: 1300,
  modal: 1400,
  popover: 1500,
  tooltip: 1600,
};

/**
 * Opacity - Transparency levels
 */
export const Opacity = {
  transparent: 0,
  semiTransparent: 0.5,
  mostlyOpaque: 0.8,
  opaque: 1,
  disabled: 0.4,
  hover: 0.7,
};

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});

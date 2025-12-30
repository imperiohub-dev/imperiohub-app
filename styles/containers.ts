/**
 * Container Styles - Predefined layout and container styles
 */

import { ViewStyle } from 'react-native';
import { Spacing } from '@/constants/theme';

/**
 * Layout Container Styles
 */
export const ContainerStyles: Record<string, ViewStyle> = {
  /**
   * Screen container - Full screen wrapper
   */
  screen: {
    flex: 1,
    backgroundColor: '#fff',
  },

  /**
   * Content container - Main content area with padding
   */
  content: {
    flex: 1,
    padding: Spacing.md,
  },

  /**
   * Centered container - Center content vertically and horizontally
   */
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.md,
  },

  /**
   * Safe area container - Respects safe area insets
   */
  safeArea: {
    flex: 1,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.lg,
  },

  /**
   * Section container - Content section with spacing
   */
  section: {
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.md,
  },

  /**
   * Compact section - Smaller section spacing
   */
  sectionCompact: {
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.md,
  },
};

/**
 * Flexbox Layout Styles
 */
export const FlexStyles: Record<string, ViewStyle> = {
  /**
   * Row - Horizontal flex layout
   */
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  /**
   * Row with space between
   */
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  /**
   * Row with centered items
   */
  rowCenter: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },

  /**
   * Column - Vertical flex layout
   */
  column: {
    flexDirection: 'column',
  },

  /**
   * Column with centered items
   */
  columnCenter: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },

  /**
   * Column with space between
   */
  columnBetween: {
    flexDirection: 'column',
    justifyContent: 'space-between',
  },

  /**
   * Wrap - Flex wrap
   */
  wrap: {
    flexWrap: 'wrap',
  },
};

/**
 * Gap Styles - Spacing between flex children
 */
export const GapStyles: Record<string, ViewStyle> = {
  xs: { gap: Spacing.xs },
  sm: { gap: Spacing.sm },
  md: { gap: Spacing.md },
  lg: { gap: Spacing.lg },
  xl: { gap: Spacing.xl },
};

/**
 * Grid Styles - Grid-like layouts
 */
export const GridStyles: Record<string, ViewStyle> = {
  /**
   * Two column grid
   */
  twoColumn: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.md,
  },

  /**
   * Three column grid
   */
  threeColumn: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
};

/**
 * Padding Styles - Common padding patterns
 */
export const PaddingStyles: Record<string, ViewStyle> = {
  none: { padding: 0 },
  xs: { padding: Spacing.xs },
  sm: { padding: Spacing.sm },
  md: { padding: Spacing.md },
  lg: { padding: Spacing.lg },
  xl: { padding: Spacing.xl },
  xxl: { padding: Spacing.xxl },

  // Horizontal only
  horizontalXs: { paddingHorizontal: Spacing.xs },
  horizontalSm: { paddingHorizontal: Spacing.sm },
  horizontalMd: { paddingHorizontal: Spacing.md },
  horizontalLg: { paddingHorizontal: Spacing.lg },
  horizontalXl: { paddingHorizontal: Spacing.xl },

  // Vertical only
  verticalXs: { paddingVertical: Spacing.xs },
  verticalSm: { paddingVertical: Spacing.sm },
  verticalMd: { paddingVertical: Spacing.md },
  verticalLg: { paddingVertical: Spacing.lg },
  verticalXl: { paddingVertical: Spacing.xl },
};

/**
 * Margin Styles - Common margin patterns
 */
export const MarginStyles: Record<string, ViewStyle> = {
  none: { margin: 0 },
  xs: { margin: Spacing.xs },
  sm: { margin: Spacing.sm },
  md: { margin: Spacing.md },
  lg: { margin: Spacing.lg },
  xl: { margin: Spacing.xl },
  xxl: { margin: Spacing.xxl },

  // Horizontal only
  horizontalXs: { marginHorizontal: Spacing.xs },
  horizontalSm: { marginHorizontal: Spacing.sm },
  horizontalMd: { marginHorizontal: Spacing.md },
  horizontalLg: { marginHorizontal: Spacing.lg },
  horizontalXl: { marginHorizontal: Spacing.xl },

  // Vertical only
  verticalXs: { marginVertical: Spacing.xs },
  verticalSm: { marginVertical: Spacing.sm },
  verticalMd: { marginVertical: Spacing.md },
  verticalLg: { marginVertical: Spacing.lg },
  verticalXl: { marginVertical: Spacing.xl },
};

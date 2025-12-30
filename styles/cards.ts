/**
 * Card Styles - Predefined card components styles
 */

import { ViewStyle } from 'react-native';
import { BorderRadius, Spacing } from '@/constants/theme';
import { Shadows } from '@/constants/shadows';

/**
 * Base Card Styles
 */
export const CardStyles: Record<string, ViewStyle> = {
  /**
   * Basic card - Simple card with subtle shadow
   */
  basic: {
    backgroundColor: '#fff',
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    ...Shadows.sm,
  },

  /**
   * Elevated card - Card with more prominent shadow
   */
  elevated: {
    backgroundColor: '#fff',
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    ...Shadows.md,
  },

  /**
   * Outlined card - Card with border instead of shadow
   */
  outlined: {
    backgroundColor: '#fff',
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    padding: Spacing.md,
  },

  /**
   * Flat card - No shadow, just background
   */
  flat: {
    backgroundColor: '#F9FAFB',
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
  },

  /**
   * Compact card - Smaller padding
   */
  compact: {
    backgroundColor: '#fff',
    borderRadius: BorderRadius.sm,
    padding: Spacing.sm,
    ...Shadows.sm,
  },
};

/**
 * Card Header Styles
 */
export const CardHeaderStyles: Record<string, ViewStyle> = {
  default: {
    paddingBottom: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
};

/**
 * Card Footer Styles
 */
export const CardFooterStyles: Record<string, ViewStyle> = {
  default: {
    paddingTop: Spacing.sm,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
};

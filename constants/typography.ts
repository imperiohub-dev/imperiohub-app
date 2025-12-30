/**
 * Typography Styles - Predefined text styles for consistent typography
 */

import { TextStyle } from 'react-native';
import { FontSizes, FontWeights, LineHeights } from './theme';

/**
 * Heading Styles - For titles and headings
 */
export const HeadingStyles: Record<string, TextStyle> = {
  h1: {
    fontSize: FontSizes.huge,
    fontWeight: FontWeights.bold,
    lineHeight: FontSizes.huge * LineHeights.tight,
  },
  h2: {
    fontSize: FontSizes.display,
    fontWeight: FontWeights.bold,
    lineHeight: FontSizes.display * LineHeights.tight,
  },
  h3: {
    fontSize: FontSizes.xxxl,
    fontWeight: FontWeights.semibold,
    lineHeight: FontSizes.xxxl * LineHeights.tight,
  },
  h4: {
    fontSize: FontSizes.xxl,
    fontWeight: FontWeights.semibold,
    lineHeight: FontSizes.xxl * LineHeights.normal,
  },
  h5: {
    fontSize: FontSizes.xl,
    fontWeight: FontWeights.semibold,
    lineHeight: FontSizes.xl * LineHeights.normal,
  },
  h6: {
    fontSize: FontSizes.lg,
    fontWeight: FontWeights.semibold,
    lineHeight: FontSizes.lg * LineHeights.normal,
  },
};

/**
 * Body Text Styles - For regular content
 */
export const BodyStyles: Record<string, TextStyle> = {
  large: {
    fontSize: FontSizes.lg,
    fontWeight: FontWeights.normal,
    lineHeight: FontSizes.lg * LineHeights.normal,
  },
  regular: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.normal,
    lineHeight: FontSizes.md * LineHeights.normal,
  },
  small: {
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.normal,
    lineHeight: FontSizes.sm * LineHeights.normal,
  },
  tiny: {
    fontSize: FontSizes.xs,
    fontWeight: FontWeights.normal,
    lineHeight: FontSizes.xs * LineHeights.normal,
  },
};

/**
 * Label Styles - For form labels, captions, etc.
 */
export const LabelStyles: Record<string, TextStyle> = {
  large: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.medium,
    lineHeight: FontSizes.md * LineHeights.normal,
  },
  medium: {
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.medium,
    lineHeight: FontSizes.sm * LineHeights.normal,
  },
  small: {
    fontSize: FontSizes.xs,
    fontWeight: FontWeights.medium,
    lineHeight: FontSizes.xs * LineHeights.normal,
  },
};

/**
 * Link Styles - For clickable text
 */
export const LinkStyles: Record<string, TextStyle> = {
  large: {
    fontSize: FontSizes.lg,
    fontWeight: FontWeights.medium,
    lineHeight: FontSizes.lg * LineHeights.normal,
    textDecorationLine: 'underline',
  },
  medium: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.medium,
    lineHeight: FontSizes.md * LineHeights.normal,
    textDecorationLine: 'underline',
  },
  small: {
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.medium,
    lineHeight: FontSizes.sm * LineHeights.normal,
    textDecorationLine: 'underline',
  },
};

/**
 * Caption Styles - For metadata, hints, etc.
 */
export const CaptionStyles: Record<string, TextStyle> = {
  regular: {
    fontSize: FontSizes.xs,
    fontWeight: FontWeights.normal,
    lineHeight: FontSizes.xs * LineHeights.normal,
  },
  semibold: {
    fontSize: FontSizes.xs,
    fontWeight: FontWeights.semibold,
    lineHeight: FontSizes.xs * LineHeights.normal,
  },
};

/**
 * Button Text Styles - For buttons
 */
export const ButtonTextStyles: Record<string, TextStyle> = {
  large: {
    fontSize: FontSizes.lg,
    fontWeight: FontWeights.semibold,
    lineHeight: FontSizes.lg * LineHeights.tight,
  },
  medium: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.semibold,
    lineHeight: FontSizes.md * LineHeights.tight,
  },
  small: {
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.semibold,
    lineHeight: FontSizes.sm * LineHeights.tight,
  },
};

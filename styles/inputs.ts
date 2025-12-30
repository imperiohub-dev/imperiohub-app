/**
 * Input Styles - Predefined input component styles
 */

import { ViewStyle, TextStyle } from 'react-native';
import { BorderRadius, Spacing, NeutralColors, BrandColors, FontSizes } from '@/constants/theme';
import { Shadows } from '@/constants/shadows';

/**
 * Input Container Styles
 */
export const InputStyles: Record<string, ViewStyle> = {
  /**
   * Default input - Standard text input
   */
  default: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: NeutralColors.gray300,
    borderRadius: BorderRadius.md,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.md,
    fontSize: FontSizes.md,
  },

  /**
   * Outlined input - Input with border
   */
  outlined: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: NeutralColors.gray300,
    borderRadius: BorderRadius.md,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.md,
    fontSize: FontSizes.md,
  },

  /**
   * Filled input - Input with background
   */
  filled: {
    backgroundColor: NeutralColors.gray100,
    borderWidth: 0,
    borderRadius: BorderRadius.md,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.md,
    fontSize: FontSizes.md,
  },

  /**
   * Focused input - Active state
   */
  focused: {
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: BrandColors.primary,
    borderRadius: BorderRadius.md,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.md,
    fontSize: FontSizes.md,
  },

  /**
   * Error input - Invalid state
   */
  error: {
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: BrandColors.error,
    borderRadius: BorderRadius.md,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.md,
    fontSize: FontSizes.md,
  },

  /**
   * Disabled input - Non-editable state
   */
  disabled: {
    backgroundColor: NeutralColors.gray100,
    borderWidth: 1,
    borderColor: NeutralColors.gray300,
    borderRadius: BorderRadius.md,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.md,
    fontSize: FontSizes.md,
    opacity: 0.6,
  },

  /**
   * Search input - Input with search styling
   */
  search: {
    backgroundColor: NeutralColors.gray100,
    borderWidth: 0,
    borderRadius: BorderRadius.full,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    fontSize: FontSizes.md,
  },
};

/**
 * Input Size Variants
 */
export const InputSizeStyles: Record<string, ViewStyle> = {
  small: {
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.sm,
    fontSize: FontSizes.sm,
    borderRadius: BorderRadius.sm,
  },
  medium: {
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.md,
    fontSize: FontSizes.md,
    borderRadius: BorderRadius.md,
  },
  large: {
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.lg,
    fontSize: FontSizes.lg,
    borderRadius: BorderRadius.lg,
  },
};

/**
 * Input Label Styles
 */
export const InputLabelStyles: Record<string, TextStyle> = {
  default: {
    fontSize: FontSizes.sm,
    fontWeight: '500',
    color: NeutralColors.gray700,
    marginBottom: Spacing.xs,
  },
  required: {
    fontSize: FontSizes.sm,
    fontWeight: '500',
    color: NeutralColors.gray700,
    marginBottom: Spacing.xs,
  },
  error: {
    fontSize: FontSizes.sm,
    fontWeight: '500',
    color: BrandColors.error,
    marginBottom: Spacing.xs,
  },
};

/**
 * Input Helper Text Styles
 */
export const InputHelperStyles: Record<string, TextStyle> = {
  default: {
    fontSize: FontSizes.xs,
    color: NeutralColors.gray600,
    marginTop: Spacing.xs,
  },
  error: {
    fontSize: FontSizes.xs,
    color: BrandColors.error,
    marginTop: Spacing.xs,
  },
  success: {
    fontSize: FontSizes.xs,
    color: BrandColors.success,
    marginTop: Spacing.xs,
  },
};

/**
 * Textarea Styles
 */
export const TextareaStyles: Record<string, ViewStyle> = {
  default: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: NeutralColors.gray300,
    borderRadius: BorderRadius.md,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.md,
    fontSize: FontSizes.md,
    minHeight: 100,
    textAlignVertical: 'top',
  },
};

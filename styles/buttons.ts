/**
 * Button Styles - Predefined button component styles
 */

import { ViewStyle, TextStyle } from "react-native";
import {
  BorderRadius,
  Spacing,
  BrandColors,
  NeutralColors,
} from "@/constants/theme";
import { Shadows } from "@/constants/shadows";
import { ButtonTextStyles } from "@/constants/typography";

/**
 * Button Container Styles
 */
export const ButtonStyles: Record<string, ViewStyle> = {
  /**
   * Primary button - Main action button
   */
  primary: {
    backgroundColor: BrandColors.primary,
    borderRadius: BorderRadius.md,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    alignItems: "center",
    justifyContent: "center",
    ...Shadows.sm,
  },

  /**
   * Secondary button - Alternative action
   */
  secondary: {
    backgroundColor: BrandColors.secondary,
    borderRadius: BorderRadius.md,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    alignItems: "center",
    justifyContent: "center",
    ...Shadows.sm,
  },

  /**
   * Outlined button - Button with border
   */
  outlined: {
    backgroundColor: "transparent",
    borderWidth: 2,
    borderColor: BrandColors.primary,
    borderRadius: BorderRadius.md,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    alignItems: "center",
    justifyContent: "center",
  },

  /**
   * Ghost button - Transparent button
   */
  ghost: {
    backgroundColor: "transparent",
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    alignItems: "center",
    justifyContent: "center",
  },

  /**
   * Text button - Minimal button
   */
  text: {
    backgroundColor: "transparent",
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    alignItems: "center",
    justifyContent: "center",
  },

  /**
   * Danger button - For destructive actions
   */
  danger: {
    backgroundColor: BrandColors.error,
    borderRadius: BorderRadius.md,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    alignItems: "center",
    justifyContent: "center",
    ...Shadows.sm,
  },

  /**
   * Success button - For positive actions
   */
  success: {
    backgroundColor: BrandColors.success,
    borderRadius: BorderRadius.md,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    alignItems: "center",
    justifyContent: "center",
    ...Shadows.sm,
  },

  /**
   * Disabled button - Non-interactive state
   */
  disabled: {
    backgroundColor: NeutralColors.gray300,
    borderRadius: BorderRadius.md,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    alignItems: "center",
    justifyContent: "center",
    opacity: 0.6,
  },
};

/**
 * Button Size Variants
 */
export const ButtonSizeStyles: Record<string, ViewStyle> = {
  small: {
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderRadius: BorderRadius.sm,
  },
  medium: {
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    borderRadius: BorderRadius.md,
  },
  large: {
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.xl,
    borderRadius: BorderRadius.lg,
  },
};

/**
 * Button Text Styles
 */
export const ButtonTextColorStyles: Record<string, TextStyle> = {
  primary: {
    color: "#fff",
    ...ButtonTextStyles.medium,
  },
  secondary: {
    color: "#fff",
    ...ButtonTextStyles.medium,
  },
  outlined: {
    color: BrandColors.primary,
    ...ButtonTextStyles.medium,
  },
  ghost: {
    color: BrandColors.primary,
    ...ButtonTextStyles.medium,
  },
  text: {
    color: BrandColors.primary,
    ...ButtonTextStyles.medium,
  },
  danger: {
    color: "#fff",
    ...ButtonTextStyles.medium,
  },
  success: {
    color: "#fff",
    ...ButtonTextStyles.medium,
  },
  disabled: {
    color: NeutralColors.gray600,
    ...ButtonTextStyles.medium,
  },
};

/**
 * Button Component - Reusable button component with different variants
 */

import React from 'react';
import { TouchableOpacity, Text, ViewStyle, TextStyle, ActivityIndicator } from 'react-native';
import { ButtonStyles, ButtonSizeStyles, ButtonTextColorStyles } from '@/styles/buttons';

interface ButtonProps {
  children: React.ReactNode;
  onPress?: () => void;
  variant?: 'primary' | 'secondary' | 'outlined' | 'ghost' | 'text' | 'danger' | 'success' | 'disabled';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export function Button({
  children,
  onPress,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  style,
  textStyle,
}: ButtonProps) {
  const isDisabled = disabled || loading;
  const buttonVariant = isDisabled ? 'disabled' : variant;

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={isDisabled}
      style={[
        ButtonStyles[buttonVariant],
        ButtonSizeStyles[size],
        style,
      ]}
      activeOpacity={0.7}
    >
      {loading ? (
        <ActivityIndicator color={ButtonTextColorStyles[buttonVariant].color} />
      ) : (
        <Text style={[ButtonTextColorStyles[buttonVariant], textStyle]}>
          {children}
        </Text>
      )}
    </TouchableOpacity>
  );
}

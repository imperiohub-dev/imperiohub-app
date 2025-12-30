/**
 * Input Component - Reusable text input component with different variants
 */

import React, { useState } from 'react';
import { View, TextInput, Text, TextInputProps, ViewStyle, TextStyle } from 'react-native';
import {
  InputStyles,
  InputSizeStyles,
  InputLabelStyles,
  InputHelperStyles,
} from '@/styles/inputs';
import { NeutralColors } from '@/constants/theme';

interface InputProps extends TextInputProps {
  label?: string;
  helperText?: string;
  errorText?: string;
  variant?: 'default' | 'outlined' | 'filled';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  required?: boolean;
  containerStyle?: ViewStyle;
  inputStyle?: ViewStyle;
  labelStyle?: TextStyle;
}

export function Input({
  label,
  helperText,
  errorText,
  variant = 'default',
  size = 'medium',
  disabled = false,
  required = false,
  containerStyle,
  inputStyle,
  labelStyle,
  ...textInputProps
}: InputProps) {
  const [isFocused, setIsFocused] = useState(false);
  const hasError = !!errorText;

  const getInputStyle = () => {
    if (disabled) return InputStyles.disabled;
    if (hasError) return InputStyles.error;
    if (isFocused) return InputStyles.focused;
    return InputStyles[variant];
  };

  const getLabelStyle = () => {
    if (hasError) return InputLabelStyles.error;
    if (required) return InputLabelStyles.required;
    return InputLabelStyles.default;
  };

  return (
    <View style={containerStyle}>
      {label && (
        <Text style={[getLabelStyle(), labelStyle]}>
          {label}{required && ' *'}
        </Text>
      )}

      <TextInput
        {...textInputProps}
        editable={!disabled}
        onFocus={(e) => {
          setIsFocused(true);
          textInputProps.onFocus?.(e);
        }}
        onBlur={(e) => {
          setIsFocused(false);
          textInputProps.onBlur?.(e);
        }}
        style={[
          getInputStyle(),
          InputSizeStyles[size],
          inputStyle,
        ]}
        placeholderTextColor={NeutralColors.gray400}
      />

      {(helperText || errorText) && (
        <Text style={hasError ? InputHelperStyles.error : InputHelperStyles.default}>
          {errorText || helperText}
        </Text>
      )}
    </View>
  );
}

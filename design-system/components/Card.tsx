/**
 * Card Component - Reusable card component with different variants
 */

import React from 'react';
import { View, ViewStyle, StyleSheet } from 'react-native';
import { CardStyles, CardHeaderStyles, CardFooterStyles } from '@/styles/cards';

interface CardProps {
  children: React.ReactNode;
  variant?: 'basic' | 'elevated' | 'outlined' | 'flat' | 'compact';
  style?: ViewStyle;
}

export function Card({ children, variant = 'basic', style }: CardProps) {
  return (
    <View style={[CardStyles[variant], style]}>
      {children}
    </View>
  );
}

interface CardHeaderProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

export function CardHeader({ children, style }: CardHeaderProps) {
  return (
    <View style={[CardHeaderStyles.default, style]}>
      {children}
    </View>
  );
}

interface CardBodyProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

export function CardBody({ children, style }: CardBodyProps) {
  return (
    <View style={style}>
      {children}
    </View>
  );
}

interface CardFooterProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

export function CardFooter({ children, style }: CardFooterProps) {
  return (
    <View style={[CardFooterStyles.default, style]}>
      {children}
    </View>
  );
}

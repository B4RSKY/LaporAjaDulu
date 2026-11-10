import React from 'react';
import { StyleProp, StyleSheet, View, ViewProps, ViewStyle } from 'react-native';
import { colors, radius, shadows, spacing } from '../../theme';

export interface NeuCardProps extends ViewProps {
  children?: React.ReactNode;
  variant?: 'flat' | 'raised' | 'pressed';
  style?: StyleProp<ViewStyle>;
  padding?: number;
  accessible?: boolean;
}

/**
 * NeuCard — Reusable Container Component
 * Kartu berlatar surface dengan aksen soft neumorphism yang kompatibel untuk Android.
 */
export const NeuCard: React.FC<NeuCardProps> = ({
  children,
  variant = 'raised',
  style,
  padding = spacing.md,
  accessible = false,
  ...restProps
}) => {
  const variantStyle =
    variant === 'flat'
      ? shadows.neuFlat
      : variant === 'pressed'
      ? shadows.neuPressed
      : shadows.neuRaised;

  return (
    <View
      accessible={accessible}
      style={[
        styles.base,
        variantStyle,
        { padding },
        style,
      ]}
      {...restProps}
    >
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  base: {
    borderRadius: radius.md,
    backgroundColor: colors.surface,
  },
});

import React from 'react';
import { ActivityIndicator, StyleProp, StyleSheet, Text, View, ViewStyle } from 'react-native';
import { colors, spacing, typography } from '../../theme';
import { NeuCard } from './NeuCard';

export interface LoadingStateProps {
  message?: string;
  style?: StyleProp<ViewStyle>;
}

/**
 * LoadingState — Reusable Loading Indicator Component
 * Menampilkan animasi pemuatan data yang terpusat dengan aksen visual tema LaporAjaDulu.
 */
export const LoadingState: React.FC<LoadingStateProps> = ({
  message = 'Memuat data...',
  style,
}) => {
  return (
    <View
      style={[styles.container, style]}
      accessible={true}
      accessibilityRole="progressbar"
      accessibilityLabel={message}
    >
      <NeuCard variant="flat" style={styles.card}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.messageText}>{message}</Text>
      </NeuCard>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.lg,
  },
  card: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xl,
    paddingHorizontal: spacing.xxl,
    minWidth: 200,
  },
  messageText: {
    ...typography.body,
    color: colors.textSecondary,
    marginTop: spacing.md,
    textAlign: 'center',
  },
});

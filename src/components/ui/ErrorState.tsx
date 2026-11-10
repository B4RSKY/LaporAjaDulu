import React from 'react';
import { Pressable, StyleProp, StyleSheet, Text, View, ViewStyle } from 'react-native';
import { colors, radius, spacing, touchTarget, typography } from '../../theme';
import { NeuCard } from './NeuCard';

export interface ErrorStateProps {
  title: string;
  message: string;
  onRetry?: () => void;
  retryLabel?: string;
  style?: StyleProp<ViewStyle>;
}

/**
 * ErrorState — Reusable Error Feedback Component
 * Menampilkan pesan kesalahan secara ramah pengguna dengan tombol aksi pemulihan (retry).
 */
export const ErrorState: React.FC<ErrorStateProps> = ({
  title,
  message,
  onRetry,
  retryLabel = 'Coba Lagi',
  style,
}) => {
  return (
    <View style={[styles.container, style]}>
      <NeuCard variant="raised" style={styles.card}>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>PERHATIAN</Text>
        </View>

        <Text style={styles.titleText}>{title}</Text>
        <Text style={styles.messageText}>{message}</Text>

        {onRetry && (
          <Pressable
            onPress={onRetry}
            accessible={true}
            accessibilityRole="button"
            accessibilityLabel={retryLabel}
            accessibilityHint="Menekan tombol ini untuk mengulang proses pemuatan data"
            style={({ pressed }) => [
              styles.retryButton,
              pressed && styles.retryButtonPressed,
            ]}
          >
            <Text style={styles.retryButtonText}>{retryLabel}</Text>
          </Pressable>
        )}
      </NeuCard>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    alignItems: 'center',
    width: '100%',
    maxWidth: 380,
    paddingVertical: spacing.xl,
    paddingHorizontal: spacing.lg,
  },
  badge: {
    backgroundColor: colors.dangerBackground,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: radius.round,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.danger,
  },
  badgeText: {
    ...typography.badge,
    color: colors.dangerText,
  },
  titleText: {
    ...typography.sectionTitle,
    color: colors.textPrimary,
    textAlign: 'center',
    marginBottom: spacing.xs,
  },
  messageText: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  retryButton: {
    backgroundColor: colors.primary,
    minHeight: touchTarget.minHeight,
    minWidth: touchTarget.minWidth,
    paddingHorizontal: spacing.xl,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
  },
  retryButtonPressed: {
    backgroundColor: colors.primaryDark,
    opacity: 0.9,
  },
  retryButtonText: {
    ...typography.sectionTitle,
    color: colors.textInverse,
  },
});

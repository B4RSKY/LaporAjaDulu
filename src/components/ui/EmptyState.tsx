import React from 'react';
import { Pressable, StyleProp, StyleSheet, Text, View, ViewStyle } from 'react-native';
import { colors, radius, spacing, touchTarget, typography } from '../../theme';
import { NeuCard } from './NeuCard';

export interface EmptyStateProps {
  title?: string;
  message?: string;
  onActionPress?: () => void;
  actionLabel?: string;
  style?: StyleProp<ViewStyle>;
}

/**
 * EmptyState — Reusable Empty State Feedback Component
 * Menampilkan informasi visual ramah saat tidak ada laporan pada radius pemetaan saat ini.
 */
export const EmptyState: React.FC<EmptyStateProps> = ({
  title = 'Belum Ada Laporan',
  message = 'Saat ini belum ada laporan kejadian infrastruktur atau bencana di sekitar area pandang Anda.',
  onActionPress,
  actionLabel = 'Segarkan Peta',
  style,
}) => {
  return (
    <View style={[styles.container, style]}>
      <NeuCard variant="flat" style={styles.card}>
        <View style={styles.iconCircle}>
          <View style={styles.innerDot} />
        </View>

        <Text style={styles.titleText}>{title}</Text>
        <Text style={styles.messageText}>{message}</Text>

        {onActionPress && (
          <Pressable
            onPress={onActionPress}
            accessible={true}
            accessibilityRole="button"
            accessibilityLabel={actionLabel}
            accessibilityHint="Menekan tombol ini untuk menyegarkan area peta"
            style={({ pressed }) => [
              styles.actionButton,
              pressed && styles.actionButtonPressed,
            ]}
          >
            <Text style={styles.actionButtonText}>{actionLabel}</Text>
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
  iconCircle: {
    width: 52,
    height: 52,
    borderRadius: radius.round,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
    borderWidth: 1.5,
    borderColor: colors.borderSubtle,
  },
  innerDot: {
    width: 20,
    height: 20,
    borderRadius: radius.round,
    backgroundColor: colors.primary,
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
    marginBottom: spacing.md,
    lineHeight: 20,
  },
  actionButton: {
    backgroundColor: colors.primaryLight,
    minHeight: touchTarget.minHeight,
    minWidth: touchTarget.minWidth,
    paddingHorizontal: spacing.xl,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.primary,
    marginTop: spacing.sm,
  },
  actionButtonPressed: {
    backgroundColor: colors.borderSubtle,
    opacity: 0.8,
  },
  actionButtonText: {
    ...typography.body,
    color: colors.primaryDark,
    fontWeight: '600',
  },
});

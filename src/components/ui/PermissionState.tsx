import React from 'react';
import { Pressable, StyleProp, StyleSheet, Text, View, ViewStyle } from 'react-native';
import { colors, radius, spacing, touchTarget, typography } from '../../theme';
import { NeuCard } from './NeuCard';

export interface PermissionStateProps {
  permissionStatus: 'undetermined' | 'denied';
  onRequestPermission: () => void;
  onDismiss?: () => void;
  style?: StyleProp<ViewStyle>;
}

/**
 * PermissionState — Reusable Location Permission Explainer Component
 * Mengedukasi pengguna mengenai alasan perlunya izin lokasi tanpa memicu native dialog secara langsung.
 */
export const PermissionState: React.FC<PermissionStateProps> = ({
  permissionStatus,
  onRequestPermission,
  onDismiss,
  style,
}) => {
  const isDenied = permissionStatus === 'denied';

  const title = isDenied ? 'Izin Lokasi Belum Aktif' : 'Akses Lokasi Diperlukan';
  const description = isDenied
    ? 'LaporAjaDulu tidak dapat memetakan laporan bencana dan infrastruktur di sekitar Anda karena izin lokasi tidak diberikan. Aktifkan izin lokasi agar peta interaktif dapat berfungsi secara optimal.'
    : 'LaporAjaDulu membutuhkan izin lokasi perangkat untuk mendeteksi posisi Anda dan menyajikan informasi laporan infrastruktur kota serta mitigasi bencana secara akurat.';

  const buttonLabel = isDenied ? 'Coba Berikan Izin' : 'Izinkan Akses Lokasi';

  return (
    <View style={[styles.container, style]}>
      <NeuCard variant="raised" style={styles.card}>
        <View style={[styles.badge, isDenied ? styles.badgeDenied : styles.badgeInfo]}>
          <Text style={[styles.badgeText, isDenied ? styles.badgeTextDenied : styles.badgeTextInfo]}>
            {isDenied ? 'LOKASI NONAKTIF' : 'LAYANAN LOKASI'}
          </Text>
        </View>

        <Text style={styles.titleText}>{title}</Text>
        <Text style={styles.descriptionText}>{description}</Text>

        <View style={styles.buttonGroup}>
          <Pressable
            onPress={onRequestPermission}
            accessible={true}
            accessibilityRole="button"
            accessibilityLabel={buttonLabel}
            accessibilityHint="Memicu permintaan izin lokasi perangkat"
            style={({ pressed }) => [
              styles.primaryButton,
              pressed && styles.primaryButtonPressed,
            ]}
          >
            <Text style={styles.primaryButtonText}>{buttonLabel}</Text>
          </Pressable>

          {onDismiss && (
            <Pressable
              onPress={onDismiss}
              accessible={true}
              accessibilityRole="button"
              accessibilityLabel="Tutup pemberitahuan"
              style={({ pressed }) => [
                styles.dismissButton,
                pressed && styles.dismissButtonPressed,
              ]}
            >
              <Text style={styles.dismissButtonText}>Nanti Saja</Text>
            </Pressable>
          )}
        </View>
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
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: radius.round,
    marginBottom: spacing.md,
    borderWidth: 1,
  },
  badgeInfo: {
    backgroundColor: colors.primaryLight,
    borderColor: colors.primary,
  },
  badgeDenied: {
    backgroundColor: colors.warningBackground,
    borderColor: colors.warning,
  },
  badgeText: {
    ...typography.badge,
  },
  badgeTextInfo: {
    color: colors.primaryDark,
  },
  badgeTextDenied: {
    color: colors.warningText,
  },
  titleText: {
    ...typography.sectionTitle,
    color: colors.textPrimary,
    textAlign: 'center',
    marginBottom: spacing.xs,
  },
  descriptionText: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.lg,
    lineHeight: 22,
  },
  buttonGroup: {
    width: '100%',
    alignItems: 'center',
    gap: spacing.sm,
  },
  primaryButton: {
    backgroundColor: colors.primary,
    minHeight: touchTarget.minHeight,
    minWidth: touchTarget.minWidth,
    width: '100%',
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
    elevation: 2,
  },
  primaryButtonPressed: {
    backgroundColor: colors.primaryDark,
    opacity: 0.9,
  },
  primaryButtonText: {
    ...typography.sectionTitle,
    color: colors.textInverse,
  },
  dismissButton: {
    minHeight: touchTarget.minHeight,
    minWidth: touchTarget.minWidth,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
  },
  dismissButtonPressed: {
    opacity: 0.6,
  },
  dismissButtonText: {
    ...typography.body,
    color: colors.textMuted,
    fontWeight: '500',
  },
});

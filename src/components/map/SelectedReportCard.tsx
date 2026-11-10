import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, radius, spacing, touchTarget, typography } from '../../theme';
import { ReportCategory, ReportUrgency, UIReport } from '../../types/ui';
import { NeuCard } from '../ui/NeuCard';

export interface SelectedReportCardProps {
  report: UIReport;
  onClose: () => void;
  onActionPress?: (reportId: string) => void;
}

function getCategoryBadge(category: ReportCategory) {
  switch (category) {
    case 'flood':
      return { label: 'Banjir', bg: colors.primaryLight, text: colors.primaryDark };
    case 'fire':
      return { label: 'Kebakaran', bg: colors.dangerBackground, text: colors.dangerText };
    case 'landslide':
      return { label: 'Tanah Longsor', bg: colors.warningBackground, text: colors.warningText };
    case 'infrastructure':
      return { label: 'Infrastruktur', bg: colors.primaryLight, text: colors.primaryDark };
    case 'other':
    default:
      return { label: 'Lainnya', bg: colors.background, text: colors.textSecondary };
  }
}

function getUrgencyBadge(urgency: ReportUrgency) {
  switch (urgency) {
    case 'critical':
      return { label: 'KRITIS', bg: colors.dangerBackground, text: colors.dangerText };
    case 'high':
      return { label: 'TINGGI', bg: colors.dangerBackground, text: colors.dangerText };
    case 'medium':
      return { label: 'SEDANG', bg: colors.warningBackground, text: colors.warningText };
    case 'low':
    default:
      return { label: 'RENDAH', bg: colors.successBackground, text: colors.successText };
  }
}

/**
 * SelectedReportCard — Bottom Floating Card Laporan Terpilih
 * Menyajikan ringkasan informasi laporan yang dipilih dari marker peta secara proporsional.
 */
const SelectedReportCardComponent: React.FC<SelectedReportCardProps> = ({
  report,
  onClose,
  onActionPress,
}) => {
  const categoryBadge = getCategoryBadge(report.category);
  const urgencyBadge = getUrgencyBadge(report.urgency);

  const handleAction = () => {
    if (onActionPress) {
      onActionPress(report.id);
    }
  };

  return (
    <NeuCard variant="raised" style={styles.card}>
      {/* Header Bar: Kategori, Urgensi & Tombol Tutup */}
      <View style={styles.headerRow}>
        <View style={styles.badgesRow}>
          <View style={[styles.badge, { backgroundColor: categoryBadge.bg }]}>
            <Text style={[styles.badgeText, { color: categoryBadge.text }]}>
              {categoryBadge.label}
            </Text>
          </View>
          <View style={[styles.badge, { backgroundColor: urgencyBadge.bg }]}>
            <Text style={[styles.badgeText, { color: urgencyBadge.text }]}>
              {urgencyBadge.label}
            </Text>
          </View>
        </View>

        <Pressable
          onPress={onClose}
          accessible={true}
          accessibilityRole="button"
          accessibilityLabel="Tutup kartu ringkasan laporan"
          accessibilityHint="Menutup panel informasi laporan ini"
          style={({ pressed }) => [
            styles.closeButton,
            pressed && styles.buttonPressed,
          ]}
        >
          <Text style={styles.closeButtonText}>✕</Text>
        </Pressable>
      </View>

      {/* Konten Utama */}
      <Text style={styles.titleText} numberOfLines={2}>
        {report.title}
      </Text>

      <Text style={styles.descriptionText} numberOfLines={3}>
        {report.description}
      </Text>

      {/* Baris Meta: Tanggal & Jarak */}
      <View style={styles.metaRow}>
        <Text style={styles.metaText}>{report.createdAtFormatted}</Text>
        {report.distanceFormatted && (
          <View style={styles.distanceBadge}>
            <Text style={styles.distanceText}>📍 {report.distanceFormatted}</Text>
          </View>
        )}
      </View>

      {/* Tombol Aksi Opsional */}
      {onActionPress && (
        <Pressable
          onPress={handleAction}
          accessible={true}
          accessibilityRole="button"
          accessibilityLabel="Lihat rincian lengkap laporan"
          style={({ pressed }) => [
            styles.actionButton,
            pressed && styles.actionButtonPressed,
          ]}
        >
          <Text style={styles.actionButtonText}>Lihat Detail Laporan</Text>
        </Pressable>
      )}
    </NeuCard>
  );
};

export const SelectedReportCard = React.memo(SelectedReportCardComponent);

const styles = StyleSheet.create({
  card: {
    width: '100%',
    padding: spacing.md,
    maxHeight: 280,
    backgroundColor: colors.surface,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  badgesRow: {
    flexDirection: 'row',
    gap: spacing.xs,
  },
  badge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: radius.sm,
  },
  badgeText: {
    ...typography.badge,
    fontSize: 10,
  },
  closeButton: {
    minWidth: touchTarget.minWidth,
    minHeight: touchTarget.minHeight,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.round,
  },
  closeButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.textSecondary,
    textAlign: 'center',
  },
  buttonPressed: {
    opacity: 0.6,
  },
  titleText: {
    ...typography.sectionTitle,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  descriptionText: {
    ...typography.body,
    color: colors.textSecondary,
    marginBottom: spacing.md,
    lineHeight: 18,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: spacing.xs,
    borderTopWidth: 1,
    borderTopColor: colors.borderSubtle,
  },
  metaText: {
    ...typography.caption,
    color: colors.textMuted,
  },
  distanceBadge: {
    backgroundColor: colors.primaryLight,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: radius.round,
  },
  distanceText: {
    ...typography.caption,
    color: colors.primaryDark,
    fontWeight: '600',
  },
  actionButton: {
    backgroundColor: colors.primary,
    minHeight: touchTarget.minHeight,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.md,
    elevation: 2,
  },
  actionButtonPressed: {
    backgroundColor: colors.primaryDark,
    opacity: 0.9,
  },
  actionButtonText: {
    ...typography.sectionTitle,
    color: colors.textInverse,
    fontSize: 14,
  },
});

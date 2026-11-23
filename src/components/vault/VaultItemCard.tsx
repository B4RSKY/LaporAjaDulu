import React from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, radius, shadows, spacing, touchTarget, typography } from '../../theme';
import { VaultItem } from '../../types/vault';
import { NeuCard } from '../ui/NeuCard';

export interface VaultItemCardProps {
  item: VaultItem;
  onPress: (item: VaultItem) => void;
}

/**
 * VaultItemCard — Kartu Arsip Dokumen Scoped Storage (Milestone 2)
 * Menampilkan berkas foto laporan warga yang tersimpan secara offline di sandbox perangkat.
 */
const VaultItemCardComponent: React.FC<VaultItemCardProps> = ({ item, onPress }) => {
  return (
    <NeuCard variant="raised" style={styles.card}>
      <Pressable
        onPress={() => onPress(item)}
        accessible={true}
        accessibilityRole="button"
        accessibilityLabel={`Dokumen arsip laporan ${item.reportTitle}, ukuran ${item.formattedSize}`}
        accessibilityHint="Ketuk untuk melihat detail berkas arsip dan watermark bukti"
        style={({ pressed }) => [styles.touchable, pressed && styles.pressed]}
      >
        <Image source={{ uri: item.thumbnailUri }} style={styles.thumbnail} />

        <View style={styles.infoContainer}>
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryText}>{item.category.toUpperCase()}</Text>
            <Text style={styles.sizeText}>{item.formattedSize}</Text>
          </View>

          <Text style={styles.titleText} numberOfLines={2}>
            {item.reportTitle}
          </Text>

          <Text style={styles.dateText}>🕒 {item.createdAtFormatted}</Text>
          <Text style={styles.coordText}>
            📍 {item.watermark.latitude.toFixed(4)}, {item.watermark.longitude.toFixed(4)}
          </Text>
        </View>
      </Pressable>
    </NeuCard>
  );
};

export const VaultItemCard = React.memo(VaultItemCardComponent);

const styles = StyleSheet.create({
  card: {
    marginBottom: spacing.sm,
    padding: spacing.xs,
  },
  touchable: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.xs,
    minHeight: touchTarget.minHeight,
  },
  pressed: {
    opacity: 0.85,
  },
  thumbnail: {
    width: 80,
    height: 80,
    borderRadius: radius.sm,
    backgroundColor: colors.borderSubtle,
  },
  infoContainer: {
    flex: 1,
    marginLeft: spacing.md,
    justifyContent: 'center',
  },
  categoryBadge: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 2,
  },
  categoryText: {
    ...typography.badge,
    color: colors.primary,
    fontSize: 9,
  },
  sizeText: {
    ...typography.caption,
    color: colors.textMuted,
    fontSize: 10,
    fontWeight: '600',
  },
  titleText: {
    ...typography.body,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 2,
    lineHeight: 18,
  },
  dateText: {
    ...typography.caption,
    color: colors.textSecondary,
    fontSize: 11,
  },
  coordText: {
    ...typography.caption,
    color: colors.textMuted,
    fontSize: 10,
  },
});

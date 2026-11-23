import React from 'react';
import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { colors, radius, shadows, spacing, touchTarget, typography } from '../../theme';
import { PhotoWatermark } from '../../types/vault';

export interface WatermarkPreviewProps {
  photoUri: string | null;
  watermark: PhotoWatermark | null;
  onCapturePress: () => void;
  onRemovePhoto?: () => void;
}

/**
 * WatermarkPreview — Pratinjau Foto Bukti Lapangan dengan Watermark Koordinat & Waktu
 * Memenuhi kriteria verifikasi keaslian laporan warga SDG 11.
 */
export const WatermarkPreview: React.FC<WatermarkPreviewProps> = ({
  photoUri,
  watermark,
  onCapturePress,
  onRemovePhoto,
}) => {
  if (!photoUri) {
    return (
      <View style={styles.container}>
        <Text style={styles.sectionLabel}>Bukti Foto Lapangan</Text>
        <Pressable
          onPress={onCapturePress}
          accessible={true}
          accessibilityRole="button"
          accessibilityLabel="Ambil foto bukti lapangan dengan kamera"
          accessibilityHint="Membuka kamera untuk mengambil foto dengan watermark lokasi dan waktu"
          style={({ pressed }) => [
            styles.placeholderContainer,
            pressed && styles.placeholderPressed,
          ]}
        >
          <View style={styles.cameraIconCircle}>
            <Text style={styles.cameraEmoji}>📷</Text>
          </View>
          <Text style={styles.placeholderTitle}>Ambil Foto Bukti</Text>
          <Text style={styles.placeholderSubtitle}>
            Watermark koordinat GPS & waktu akan disematkan secara otomatis
          </Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.sectionLabel}>Bukti Foto (Ter-watermark)</Text>
        {onRemovePhoto && (
          <Pressable
            onPress={onRemovePhoto}
            accessible={true}
            accessibilityRole="button"
            accessibilityLabel="Hapus foto ini dan ambil ulang"
            style={styles.retakeButton}
          >
            <Text style={styles.retakeText}>Ambil Ulang</Text>
          </Pressable>
        )}
      </View>

      <View style={styles.imageWrapper}>
        <Image source={{ uri: photoUri }} style={styles.image} resizeMode="cover" />

        {/* Overlay Watermark Bukti Lapangan */}
        {watermark && (
          <View style={styles.watermarkOverlay}>
            <View style={styles.watermarkHeader}>
              <Text style={styles.watermarkBrand}>LAPORAJA DULU • SDG 11</Text>
              <Text style={styles.watermarkStatus}>BUKTI TERVERIFIKASI</Text>
            </View>
            <Text style={styles.watermarkCoord}>
              📍 Lat: {watermark.latitude.toFixed(6)}, Lng: {watermark.longitude.toFixed(6)}
            </Text>
            <Text style={styles.watermarkTime}>🕒 {watermark.timestampFormatted}</Text>
            {watermark.locationLabel ? (
              <Text style={styles.watermarkLoc}>🏢 {watermark.locationLabel}</Text>
            ) : null}
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.md,
    width: '100%',
  },
  sectionLabel: {
    ...typography.caption,
    color: colors.textPrimary,
    fontWeight: '600',
    marginBottom: spacing.xs,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  retakeButton: {
    paddingVertical: 2,
    paddingHorizontal: spacing.sm,
  },
  retakeText: {
    ...typography.caption,
    color: colors.dangerText,
    fontWeight: '600',
  },
  placeholderContainer: {
    ...shadows.neuFlat,
    borderWidth: 2,
    borderColor: colors.borderSubtle,
    borderStyle: 'dashed',
    borderRadius: radius.md,
    padding: spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface,
    minHeight: 160,
  },
  placeholderPressed: {
    backgroundColor: colors.primaryLight,
    opacity: 0.8,
  },
  cameraIconCircle: {
    width: 52,
    height: 52,
    borderRadius: radius.round,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  cameraEmoji: {
    fontSize: 24,
  },
  placeholderTitle: {
    ...typography.sectionTitle,
    color: colors.primaryDark,
    marginBottom: 4,
  },
  placeholderSubtitle: {
    ...typography.caption,
    color: colors.textSecondary,
    textAlign: 'center',
    maxWidth: 240,
  },
  imageWrapper: {
    position: 'relative',
    width: '100%',
    height: 220,
    borderRadius: radius.md,
    overflow: 'hidden',
    backgroundColor: '#000',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  watermarkOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(23, 43, 69, 0.82)',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.25)',
  },
  watermarkHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 2,
  },
  watermarkBrand: {
    ...typography.badge,
    color: '#FFE082', // Aksen emas peringatan
    fontSize: 9,
    letterSpacing: 0.8,
  },
  watermarkStatus: {
    ...typography.badge,
    color: '#A5D6A7', // Aksen hijau terverifikasi
    fontSize: 8,
  },
  watermarkCoord: {
    ...typography.caption,
    color: colors.textInverse,
    fontSize: 11,
    fontWeight: '600',
    lineHeight: 14,
  },
  watermarkTime: {
    ...typography.caption,
    color: colors.textInverse,
    fontSize: 10,
    lineHeight: 13,
  },
  watermarkLoc: {
    ...typography.caption,
    color: colors.primaryLight,
    fontSize: 10,
    lineHeight: 13,
  },
});

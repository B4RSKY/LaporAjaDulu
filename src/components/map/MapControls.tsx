import React from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, radius, shadows, spacing, touchTarget, typography } from '../../theme';

export interface MapControlsProps {
  isTrackingActive: boolean;
  isLoadingLocation: boolean;
  onRecenterPress: () => void;
  onRefreshPress: () => void;
}

/**
 * MapControls — Floating Presentational Map Buttons
 * Menyediakan tombol re-center (pusatkan ke pengguna) dan refresh (segarkan laporan).
 *
 * BATAS TANGGUNG JAWAB:
 * Komponen ini murni presentasional dan TIDAK mengelola GPS, mapRef, atau pergerakan kamera peta.
 */
const MapControlsComponent: React.FC<MapControlsProps> = ({
  isTrackingActive,
  isLoadingLocation,
  onRecenterPress,
  onRefreshPress,
}) => {
  const isRecenterDisabled = !isTrackingActive || isLoadingLocation;

  return (
    <View style={styles.container}>
      {/* Tombol Re-center ke Lokasi Pengguna */}
      <Pressable
        onPress={onRecenterPress}
        disabled={isRecenterDisabled}
        accessible={true}
        accessibilityRole="button"
        accessibilityLabel="Pusatkan peta ke lokasi saya"
        accessibilityHint="Menggeser tampilan peta kembali ke koordinat GPS terkini Anda"
        accessibilityState={{ disabled: isRecenterDisabled }}
        style={({ pressed }) => [
          styles.controlButton,
          isRecenterDisabled && styles.buttonDisabled,
          pressed && !isRecenterDisabled && styles.buttonPressed,
        ]}
      >
        {isLoadingLocation ? (
          <ActivityIndicator size="small" color={colors.primary} />
        ) : (
          <Text
            style={[
              styles.iconText,
              isRecenterDisabled ? styles.iconDisabled : styles.iconActive,
            ]}
          >
            ⌖
          </Text>
        )}
      </Pressable>

      {/* Tombol Segarkan Laporan Peta */}
      <Pressable
        onPress={onRefreshPress}
        accessible={true}
        accessibilityRole="button"
        accessibilityLabel="Segarkan data laporan peta"
        accessibilityHint="Memperbarui daftar laporan bencana dan infrastruktur di area ini"
        style={({ pressed }) => [
          styles.controlButton,
          pressed && styles.buttonPressed,
        ]}
      >
        <Text style={[styles.iconText, styles.iconActive]}>↻</Text>
      </Pressable>
    </View>
  );
};

export const MapControls = React.memo(MapControlsComponent);

const styles = StyleSheet.create({
  container: {
    gap: spacing.sm,
    alignItems: 'center',
  },
  controlButton: {
    ...shadows.neuRaised,
    width: touchTarget.minWidth,
    height: touchTarget.minHeight,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.borderSubtle,
  },
  buttonDisabled: {
    backgroundColor: colors.background,
    borderColor: colors.borderSubtle,
    elevation: 0,
    opacity: 0.6,
  },
  buttonPressed: {
    backgroundColor: colors.primaryLight,
    elevation: 1,
    transform: [{ scale: 0.96 }],
  },
  iconText: {
    ...typography.sectionTitle,
    fontSize: 22,
    lineHeight: 26,
    textAlign: 'center',
  },
  iconActive: {
    color: colors.primary,
  },
  iconDisabled: {
    color: colors.textMuted,
  },
});

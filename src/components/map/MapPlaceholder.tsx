import React from 'react';
import { StyleProp, StyleSheet, Text, View, ViewStyle } from 'react-native';
import { colors, radius, spacing, typography } from '../../theme';

export interface MapPlaceholderProps {
  children?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}

/**
 * MapPlaceholder — Sandbox Container Peta Sementara (Fase C)
 * Digunakan untuk menguji layout Flexbox, Safe Area, dan floating controls
 * sebelum modul native react-native-maps diintegrasikan oleh Anggota 3.
 */
export const MapPlaceholder: React.FC<MapPlaceholderProps> = ({
  children,
  style,
}) => {
  return (
    <View
      style={[styles.container, style]}
      accessible={true}
      accessibilityLabel="Area simulasi peta interaktif LaporAjaDulu"
    >
      {/* Grid dekoratif simulasi peta/jalan raya (pure View) */}
      <View style={styles.gridOverlay}>
        <View style={[styles.gridRoadHorizontal, { top: '25%' }]} />
        <View style={[styles.gridRoadHorizontal, { top: '60%' }]} />
        <View style={[styles.gridRoadVertical, { left: '30%' }]} />
        <View style={[styles.gridRoadVertical, { left: '70%' }]} />
        <View style={styles.riverCurve} />
      </View>

      {/* Watermark/Banner status simulasi */}
      <View style={styles.badgeBanner}>
        <Text style={styles.badgeText}>PETA SIMULASI — MALANG</Text>
      </View>

      {/* Layer anak (marker atau overlay presentasional) */}
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    backgroundColor: '#D9E8F7', // Latar peta biru muda lembut
    position: 'relative',
    overflow: 'hidden',
  },
  gridOverlay: {
    ...StyleSheet.absoluteFill,
    opacity: 0.6,
  },
  gridRoadHorizontal: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 14,
    backgroundColor: colors.surfaceElevated,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#C7DAEE',
  },
  gridRoadVertical: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: 14,
    backgroundColor: colors.surfaceElevated,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: '#C7DAEE',
  },
  riverCurve: {
    position: 'absolute',
    top: '40%',
    left: -20,
    right: -20,
    height: 24,
    backgroundColor: '#BDD7EE',
    transform: [{ rotate: '-8deg' }],
  },
  badgeBanner: {
    position: 'absolute',
    top: spacing.md,
    left: spacing.md,
    backgroundColor: 'rgba(23, 43, 69, 0.75)',
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
    borderRadius: radius.sm,
  },
  badgeText: {
    ...typography.badge,
    color: colors.textInverse,
    fontSize: 9,
    letterSpacing: 0.8,
  },
});

import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, radius, shadows, touchTarget, typography } from '../../theme';
import { ReportCategory, ReportUrgency } from '../../types/ui';

export interface ReportMarkerProps {
  id: string;
  latitude: number;
  longitude: number;
  category: ReportCategory;
  urgency: ReportUrgency;
  isSelected: boolean;
  onSelect: (id: string) => void;
}

/**
 * Mendapatkan warna aksen pin berdasarkan tingkat urgensi laporan.
 */
function getUrgencyColor(urgency: ReportUrgency): string {
  switch (urgency) {
    case 'critical':
      return colors.danger;
    case 'high':
      return colors.danger;
    case 'medium':
      return colors.warning;
    case 'low':
    default:
      return colors.primary;
  }
}

/**
 * Singkatan label visual kategori (tanpa ikon eksternal).
 */
function getCategoryLabel(category: ReportCategory): string {
  switch (category) {
    case 'flood':
      return 'AIR';
    case 'fire':
      return 'API';
    case 'landslide':
      return 'LSR';
    case 'infrastructure':
      return 'INF';
    case 'other':
    default:
      return 'LPR';
  }
}

const ReportMarkerComponent: React.FC<ReportMarkerProps> = ({
  id,
  category,
  urgency,
  isSelected,
  onSelect,
}) => {
  const accentColor = getUrgencyColor(urgency);
  const categoryLabel = getCategoryLabel(category);

  const handlePress = () => {
    onSelect(id);
  };

  return (
    <View style={styles.touchArea}>
      <Pressable
        onPress={handlePress}
        accessible={true}
        accessibilityRole="button"
        accessibilityLabel={`Laporan ${category}, status urgensi ${urgency}${isSelected ? ', terpilih' : ''}`}
        accessibilityHint="Ketuk dua kali untuk melihat ringkasan laporan ini"
        style={({ pressed }) => [
          styles.markerBase,
          isSelected && styles.markerSelected,
          isSelected && { borderColor: colors.primaryDark },
          pressed && styles.markerPressed,
        ]}
      >
        <View style={[styles.innerBadge, { backgroundColor: accentColor }]}>
          <Text style={styles.badgeText}>{categoryLabel}</Text>
        </View>

        {/* Pointer tip segitiga bawah */}
        <View style={[styles.pointerTip, { borderTopColor: accentColor }]} />
      </Pressable>
    </View>
  );
};

export const ReportMarker = React.memo(ReportMarkerComponent);

const styles = StyleSheet.create({
  touchArea: {
    minWidth: touchTarget.minWidth,
    minHeight: touchTarget.minHeight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  markerBase: {
    ...shadows.neuRaised,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 2,
    borderRadius: radius.sm,
    backgroundColor: colors.surfaceElevated,
    borderWidth: 1.5,
    borderColor: colors.borderSubtle,
  },
  markerSelected: {
    borderWidth: 2.5,
    transform: [{ scale: 1.15 }],
    elevation: 6,
  },
  markerPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.95 }],
  },
  innerBadge: {
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    ...typography.badge,
    color: colors.textInverse,
    fontSize: 9,
    lineHeight: 11,
  },
  pointerTip: {
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderLeftWidth: 4,
    borderRightWidth: 4,
    borderTopWidth: 5,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
  },
});

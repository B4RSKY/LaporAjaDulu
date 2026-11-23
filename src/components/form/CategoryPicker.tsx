import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, radius, spacing, touchTarget, typography } from '../../theme';
import { ReportCategory } from '../../types/ui';

export interface CategoryOption {
  key: ReportCategory;
  label: string;
  iconText: string;
}

const CATEGORIES: CategoryOption[] = [
  { key: 'infrastructure', label: 'Infrastruktur', iconText: '🏗️' },
  { key: 'flood', label: 'Banjir', iconText: '🌊' },
  { key: 'landslide', label: 'Longsor', iconText: '⛰️' },
  { key: 'fire', label: 'Kebakaran', iconText: '🔥' },
  { key: 'other', label: 'Lainnya', iconText: '⚠️' },
];

export interface CategoryPickerProps {
  selectedCategory: ReportCategory;
  onSelectCategory: (category: ReportCategory) => void;
}

/**
 * CategoryPicker — Pilihan Kategori Bencana & Infrastruktur
 * Menampilkan opsi kategori dengan target sentuh aman (>= 48dp) dan indikator aktif.
 */
export const CategoryPicker: React.FC<CategoryPickerProps> = ({
  selectedCategory,
  onSelectCategory,
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.sectionLabel}>Kategori Laporan</Text>
      <View style={styles.optionsGrid}>
        {CATEGORIES.map((cat) => {
          const isSelected = cat.key === selectedCategory;

          return (
            <Pressable
              key={cat.key}
              onPress={() => onSelectCategory(cat.key)}
              accessible={true}
              accessibilityRole="button"
              accessibilityLabel={`Kategori ${cat.label}${isSelected ? ', terpilih' : ''}`}
              accessibilityState={{ selected: isSelected }}
              style={({ pressed }) => [
                styles.optionButton,
                isSelected && styles.optionButtonSelected,
                pressed && styles.optionButtonPressed,
              ]}
            >
              <Text style={styles.icon}>{cat.iconText}</Text>
              <Text
                style={[
                  styles.optionText,
                  isSelected && styles.optionTextSelected,
                ]}
              >
                {cat.label}
              </Text>
            </Pressable>
          );
        })}
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
  optionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
  },
  optionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: touchTarget.minHeight,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
    borderWidth: 1.5,
    borderColor: colors.borderSubtle,
    gap: 6,
  },
  optionButtonSelected: {
    backgroundColor: colors.primaryLight,
    borderColor: colors.primary,
  },
  optionButtonPressed: {
    opacity: 0.8,
  },
  icon: {
    fontSize: 16,
  },
  optionText: {
    ...typography.caption,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  optionTextSelected: {
    color: colors.primaryDark,
    fontWeight: '700',
  },
});

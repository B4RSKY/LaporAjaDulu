import { ViewStyle } from 'react-native';
import { colors } from './colors';

/**
 * LaporAjaDulu — Soft Neumorphic Elevation Presets
 * Pendekatan realistis untuk Android yang memadukan elevation moderat,
 * specular highlight border lembut, dan latar surface konsisten.
 */

export const shadows = {
  neuFlat: {
    backgroundColor: colors.surface,
    elevation: 2,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
  },
  neuRaised: {
    backgroundColor: colors.surface,
    elevation: 4,
    borderTopWidth: 1.5,
    borderLeftWidth: 1,
    borderTopColor: colors.surfaceElevated,
    borderLeftColor: colors.surfaceElevated,
    borderBottomWidth: 1.5,
    borderRightWidth: 1,
    borderBottomColor: '#D0DFEE',
    borderRightColor: '#D0DFEE',
    shadowColor: colors.primaryDark,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.12,
    shadowRadius: 5,
  },
  neuPressed: {
    backgroundColor: '#E4EDF7',
    elevation: 0,
    borderWidth: 1,
    borderColor: '#CBDCF0',
  },
} as const satisfies Record<string, ViewStyle>;

export type ShadowPreset = keyof typeof shadows;

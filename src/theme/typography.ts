import { TextStyle } from 'react-native';

/**
 * LaporAjaDulu — Typography Tokens
 * Skala tipografi yang konsisten, mudah dibaca, dan accessible pada perangkat mobile.
 */

export const typography = {
  screenTitle: {
    fontSize: 20,
    fontWeight: '700',
    lineHeight: 26,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 22,
  },
  body: {
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 20,
  },
  caption: {
    fontSize: 12,
    fontWeight: '500',
    lineHeight: 16,
  },
  badge: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
} as const satisfies Record<string, TextStyle>;

export type TypographyVariant = keyof typeof typography;

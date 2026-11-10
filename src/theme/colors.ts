/**
 * LaporAjaDulu — Theme Colors Token
 * Identitas visual biru dengan kontras tinggi yang memenuhi standar WCAG 2.1 AA/AAA.
 */

export const colors = {
  // Brand Identity (Biru sebagai fondasi utama)
  primary: '#285F9B',
  primaryDark: '#173B67',
  primaryLight: '#DCE9F7',

  // Surface & Canvas
  background: '#EAF2FB',
  surface: '#F5F8FC',
  surfaceElevated: '#FFFFFF',

  // Typography Tokens (Lolos uji kontras WCAG AA/AAA pada surface & background)
  textPrimary: '#172B45',
  textSecondary: '#4B617A',
  textMuted: '#566D85',
  textInverse: '#FFFFFF',

  // Semantic & Disaster Status Indicators
  danger: '#D94B4B',
  dangerBackground: '#FDECEC',
  dangerText: '#9A2222',

  warning: '#E69A38',
  warningBackground: '#FEF6EC',
  warningText: '#874D00',

  success: '#1B663E',
  successBackground: '#E8F5EE',
  successText: '#1B663E',

  // Borders, Dividers & Overlays
  borderSubtle: '#D4E2F1',
  overlay: 'rgba(23, 43, 69, 0.4)',
} as const;

export type ColorToken = keyof typeof colors;
export type ColorValue = (typeof colors)[ColorToken];

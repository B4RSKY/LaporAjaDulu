/**
 * LaporAjaDulu — Spacing, Radius & Dimension Tokens
 * Skala konsisten berbasis kelipatan 4 dengan standar aksesibilitas sentuhan minimum 48dp Android.
 */

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
} as const;

export const radius = {
  sm: 8,
  md: 12,
  lg: 16,
  round: 9999,
} as const;

export const touchTarget = {
  minWidth: 48,
  minHeight: 48,
} as const;

export const dimensions = {
  minTouchTarget: 48,
  buttonHeight: 48,
  iconSizeSm: 16,
  iconSizeMd: 24,
  iconSizeLg: 32,
} as const;

export type SpacingToken = keyof typeof spacing;
export type RadiusToken = keyof typeof radius;

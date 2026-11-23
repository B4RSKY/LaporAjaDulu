import React from 'react';
import {
  StyleProp,
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  View,
  ViewStyle,
} from 'react-native';
import { colors, radius, spacing, touchTarget, typography } from '../../theme';

export interface FormInputProps extends TextInputProps {
  label: string;
  error?: string;
  containerStyle?: StyleProp<ViewStyle>;
}

/**
 * FormInput — Reusable Neumorphic Text Input Component
 * Input teks dengan gaya permukaan halus, border fokus yang kontras,
 * dan label aksesibilitas yang jelas.
 */
export const FormInput: React.FC<FormInputProps> = ({
  label,
  error,
  containerStyle,
  style,
  ...restProps
}) => {
  const [isFocused, setIsFocused] = React.useState(false);

  return (
    <View style={[styles.container, containerStyle]}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        accessible={true}
        accessibilityLabel={label}
        placeholderTextColor={colors.textMuted}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        style={[
          styles.input,
          isFocused && styles.inputFocused,
          error ? styles.inputError : null,
          style,
        ]}
        {...restProps}
      />
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.md,
    width: '100%',
  },
  label: {
    ...typography.caption,
    color: colors.textPrimary,
    fontWeight: '600',
    marginBottom: spacing.xs,
  },
  input: {
    ...typography.body,
    color: colors.textPrimary,
    backgroundColor: colors.surface,
    minHeight: touchTarget.minHeight,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderWidth: 1.5,
    borderColor: colors.borderSubtle,
  },
  inputFocused: {
    borderColor: colors.primary,
    backgroundColor: colors.surfaceElevated,
  },
  inputError: {
    borderColor: colors.danger,
    backgroundColor: colors.dangerBackground,
  },
  errorText: {
    ...typography.caption,
    color: colors.dangerText,
    marginTop: 4,
    fontSize: 11,
  },
});

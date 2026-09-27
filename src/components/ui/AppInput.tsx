import { FC } from 'react';
import {
  StyleSheet,
  TextInput,
  TextInputProps,
  View,
  ViewStyle,
} from 'react-native';

import { colors, radius, space } from '@/theme';

import { AppText } from './AppText';

type Props = TextInputProps & {
  label?: string;
  error?: string;
  containerStyle?: ViewStyle;
  /** Prefix element rendered inside the input row (e.g. a currency symbol or icon). */
  prefix?: React.ReactNode;
  /** Suffix element rendered inside the input row (e.g. a unit label). */
  suffix?: React.ReactNode;
};

export const AppInput: FC<Props> = ({
  label,
  error,
  containerStyle,
  style,
  prefix,
  suffix,
  ...rest
}) => {
  return (
    <View style={[styles.container, containerStyle]}>
      {label ? <AppText style={styles.label}>{label}</AppText> : null}
      <View style={[styles.inputRow, error ? styles.inputError : styles.inputNormal]}>
        {prefix ?? null}
        <TextInput
          style={[styles.input, style]}
          placeholderTextColor={colors.textSecondary}
          {...rest}
        />
        {suffix ?? null}
      </View>
      {error ? <AppText style={styles.errorText}>{error}</AppText> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: space.sm,
  },
  label: {
    fontSize: 13,
    fontWeight: '500',
    color: colors.textSecondary,
    marginBottom: 4,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
    paddingHorizontal: space.sm,
    minHeight: 48,
  },
  inputNormal: {
    borderColor: colors.border,
  },
  inputError: {
    borderColor: colors.error,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: colors.textPrimary,
    paddingVertical: space.sm,
  },
  errorText: {
    fontSize: 12,
    color: colors.error,
    marginTop: 4,
  },
});

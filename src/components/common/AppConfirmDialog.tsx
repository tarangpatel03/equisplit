import { FC, memo } from 'react';
import { Image, Modal, Pressable, StyleSheet, View } from 'react-native';

import { assets } from '@/assets';
import { AppButton } from '@/components/ui/AppButton';
import { AppText } from '@/components/ui/AppText';
import { colors, radius, space, useAppTheme } from '@/theme';

type Props = {
  visible: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  confirmVariant?: 'primary' | 'danger';
  loading?: boolean;
  useModal?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
};

export const AppConfirmDialog: FC<Props> = memo(
  ({
    visible,
    title,
    message,
    confirmLabel = 'Delete',
    cancelLabel = 'Cancel',
    confirmVariant = 'danger',
    loading = false,
    useModal = true,
    onConfirm,
    onCancel,
  }) => {
    const { colors: themeColors } = useAppTheme();

    if (!visible) return null;

    const dialogContent = (
      <View style={styles.overlay}>
        <Pressable style={styles.backdrop} onPress={onCancel} />

        <View
          style={[
            styles.dialogCard,
            {
              backgroundColor: themeColors.surface,
              borderColor: themeColors.border,
            },
          ]}
        >
          {/* Warning Icon Badge */}
          <View style={styles.iconBadge}>
            <Image
              source={assets.icons.ic_delete}
              style={styles.deleteIcon}
              resizeMode="contain"
            />
          </View>

          <AppText style={[styles.title, { color: themeColors.textPrimary }]}>
            {title}
          </AppText>
          <AppText
            style={[styles.message, { color: themeColors.textSecondary }]}
          >
            {message}
          </AppText>

          {/* Action Buttons */}
          <View style={styles.buttonRow}>
            {cancelLabel ? (
              <AppButton
                label={cancelLabel}
                variant="ghost"
                style={styles.cancelButton}
                onPress={onCancel}
                disabled={loading}
              />
            ) : null}
            <AppButton
              label={confirmLabel}
              variant={confirmVariant}
              style={cancelLabel ? styles.confirmButton : styles.singleButton}
              loading={loading}
              onPress={onConfirm}
            />
          </View>
        </View>
      </View>
    );

    if (!useModal) {
      return <View style={StyleSheet.absoluteFill}>{dialogContent}</View>;
    }

    return (
      <Modal
        visible={visible}
        animationType="fade"
        transparent
        onRequestClose={onCancel}
      >
        {dialogContent}
      </Modal>
    );
  },
);

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: colors.overlay,
    alignItems: 'center',
    justifyContent: 'center',
    padding: space.lg,
  },
  backdrop: {
    ...StyleSheet.absoluteFill,
  },
  dialogCard: {
    width: '100%',
    maxWidth: 340,
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    padding: space.lg,
    alignItems: 'center',
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
    borderWidth: 1,
  },
  iconBadge: {
    width: 48,
    height: 48,
    borderRadius: radius.full,
    backgroundColor: colors.debtLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: space.sm,
  },
  deleteIcon: {
    width: 22,
    height: 22,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.textPrimary,
    textAlign: 'center',
    marginBottom: space.xs,
  },
  message: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: space.lg,
  },
  buttonRow: {
    flexDirection: 'row',
    width: '100%',
    gap: space.sm,
  },
  cancelButton: {
    flex: 1,
  },
  confirmButton: {
    flex: 1,
  },
  singleButton: {
    flex: 1,
  },
});

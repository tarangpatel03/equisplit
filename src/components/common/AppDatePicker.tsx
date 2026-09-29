import { FC, memo, useEffect, useState } from 'react';
import { Image, Modal, Pressable, StyleSheet, View } from 'react-native';

import { assets } from '@/assets';
import { AppButton } from '@/components/ui/AppButton';
import { AppText } from '@/components/ui/AppText';
import { colors, radius, space, useAppTheme } from '@/theme';

const MONTH_NAMES = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

const WEEK_DAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

type Props = {
  visible: boolean;
  value: Date;
  onConfirm: (selected: Date) => void;
  onCancel: () => void;
};

export const AppDatePicker: FC<Props> = memo(
  ({ visible, value, onConfirm, onCancel }) => {
    const { colors: themeColors } = useAppTheme();
    const [viewDate, setViewDate] = useState(() => new Date(value));
    const [selectedDate, setSelectedDate] = useState(() => new Date(value));

    useEffect(() => {
      if (visible) {
        setViewDate(new Date(value));
        setSelectedDate(new Date(value));
      }
    }, [visible, value]);

    if (!visible) return null;

    const currentYear = viewDate.getFullYear();
    const currentMonth = viewDate.getMonth();

    const handlePrevMonth = () => {
      setViewDate(new Date(currentYear, currentMonth - 1, 1));
    };

    const handleNextMonth = () => {
      setViewDate(new Date(currentYear, currentMonth + 1, 1));
    };

    const handleSelectDay = (day: number) => {
      setSelectedDate(new Date(currentYear, currentMonth, day));
    };

    const handleQuickToday = () => {
      const today = new Date();
      setViewDate(new Date(today));
      setSelectedDate(new Date(today));
    };

    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const firstDayOfWeek = new Date(currentYear, currentMonth, 1).getDay();

    const today = new Date();
    const isToday = (day: number) =>
      today.getFullYear() === currentYear &&
      today.getMonth() === currentMonth &&
      today.getDate() === day;

    const isSelected = (day: number) =>
      selectedDate.getFullYear() === currentYear &&
      selectedDate.getMonth() === currentMonth &&
      selectedDate.getDate() === day;

    // Generate calendar weeks (chunks of 7)
    const calendarSlots: (number | null)[] = [];
    for (let i = 0; i < firstDayOfWeek; i++) {
      calendarSlots.push(null);
    }
    for (let d = 1; d <= daysInMonth; d++) {
      calendarSlots.push(d);
    }
    while (calendarSlots.length % 7 !== 0) {
      calendarSlots.push(null);
    }

    const weeks: (number | null)[][] = [];
    for (let i = 0; i < calendarSlots.length; i += 7) {
      weeks.push(calendarSlots.slice(i, i + 7));
    }

    return (
      <Modal
        visible={visible}
        animationType="fade"
        transparent
        onRequestClose={onCancel}
      >
        <View style={styles.overlay}>
          <Pressable style={styles.backdrop} onPress={onCancel} />

          <View
            style={[
              styles.card,
              {
                backgroundColor: themeColors.surface,
                borderColor: themeColors.border,
              },
            ]}
          >
            {/* Modal Title Header */}
            <View
              style={[
                styles.modalHeader,
                { borderBottomColor: themeColors.border },
              ]}
            >
              <View style={styles.modalTitleRow}>
                <Image
                  source={assets.icons.ic_calendar}
                  style={[
                    styles.modalCalendarIcon,
                    { tintColor: themeColors.primary },
                  ]}
                  resizeMode="contain"
                />
                <AppText
                  style={[
                    styles.modalTitle,
                    { color: themeColors.textPrimary },
                  ]}
                >
                  {'Select Date'}
                </AppText>
              </View>
            </View>

            {/* Header: Month & Year switcher */}
            <View style={styles.headerRow}>
              <Pressable
                onPress={handlePrevMonth}
                hitSlop={12}
                style={[
                  styles.navBtn,
                  { backgroundColor: themeColors.surfaceAlt },
                ]}
              >
                <AppText
                  style={[styles.navArrow, { color: themeColors.primary }]}
                >
                  {'‹'}
                </AppText>
              </Pressable>

              <AppText
                style={[styles.monthTitle, { color: themeColors.textPrimary }]}
              >
                {`${MONTH_NAMES[currentMonth]} ${currentYear}`}
              </AppText>

              <Pressable
                onPress={handleNextMonth}
                hitSlop={12}
                style={[
                  styles.navBtn,
                  { backgroundColor: themeColors.surfaceAlt },
                ]}
              >
                <AppText
                  style={[styles.navArrow, { color: themeColors.primary }]}
                >
                  {'›'}
                </AppText>
              </Pressable>
            </View>

            {/* Weekdays header */}
            <View style={styles.weekDaysRow}>
              {WEEK_DAYS.map(day => (
                <View key={day} style={styles.dayCol}>
                  <AppText
                    style={[
                      styles.weekDayText,
                      { color: themeColors.textSecondary },
                    ]}
                  >
                    {day}
                  </AppText>
                </View>
              ))}
            </View>

            {/* Days grid rendered as 7-slot week rows */}
            <View style={styles.grid}>
              {weeks.map((week, wIdx) => (
                <View key={`week-${wIdx}`} style={styles.weekRow}>
                  {week.map((day, dIdx) => {
                    if (day === null) {
                      return (
                        <View
                          key={`blank-${wIdx}-${dIdx}`}
                          style={styles.daySlot}
                        />
                      );
                    }

                    const selected = isSelected(day);
                    const current = isToday(day);

                    return (
                      <View key={`day-${day}`} style={styles.daySlot}>
                        <Pressable
                          style={[
                            styles.dayButton,
                            current && !selected && styles.todayButton,
                            selected && styles.selectedButton,
                          ]}
                          onPress={() => handleSelectDay(day)}
                        >
                          <AppText
                            style={[
                              styles.dayText,
                              { color: themeColors.textPrimary },
                              selected && styles.selectedDayText,
                              current &&
                                !selected && [
                                  styles.todayText,
                                  { color: themeColors.primary },
                                ],
                            ]}
                          >
                            {day.toString()}
                          </AppText>
                        </Pressable>
                      </View>
                    );
                  })}
                </View>
              ))}
            </View>

            {/* Footer with Today, Cancel, and Confirm */}
            <View
              style={[
                styles.footerRow,
                { borderTopColor: themeColors.divider },
              ]}
            >
              <Pressable
                onPress={handleQuickToday}
                style={[
                  styles.todayPill,
                  { backgroundColor: themeColors.surfaceAlt },
                ]}
              >
                <AppText
                  style={[styles.todayPillText, { color: themeColors.primary }]}
                >
                  {'Today'}
                </AppText>
              </Pressable>

              <View style={styles.actionBtns}>
                <AppButton
                  label="Cancel"
                  variant="ghost"
                  style={styles.actionBtn}
                  onPress={onCancel}
                />
                <AppButton
                  label="Confirm"
                  variant="primary"
                  style={styles.actionBtn}
                  onPress={() => onConfirm(selectedDate)}
                />
              </View>
            </View>
          </View>
        </View>
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
    padding: space.md,
  },
  backdrop: {
    ...StyleSheet.absoluteFill,
  },
  card: {
    width: '100%',
    maxWidth: 340,
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    padding: space.md,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 8,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: space.sm,
    marginBottom: space.xs,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  modalTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.xs,
  },
  modalCalendarIcon: {
    width: 20,
    height: 20,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: space.xs,
    marginBottom: space.sm,
    paddingHorizontal: space.xs,
  },
  navBtn: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.full,
    backgroundColor: colors.surfaceAlt,
  },
  navArrow: {
    fontSize: 22,
    color: colors.primary,
    fontWeight: '300',
    lineHeight: 22,
  },
  monthTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  weekDaysRow: {
    flexDirection: 'row',
    marginBottom: space.xs,
  },
  dayCol: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 4,
  },
  weekDayText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  grid: {
    width: '100%',
  },
  weekRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  daySlot: {
    flex: 1,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayButton: {
    width: 34,
    height: 34,
    borderRadius: radius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  todayButton: {
    borderWidth: 1.5,
    borderColor: colors.primary,
  },
  selectedButton: {
    backgroundColor: colors.primary,
  },
  dayText: {
    fontSize: 14,
    color: colors.textPrimary,
    fontWeight: '500',
  },
  todayText: {
    color: colors.primary,
    fontWeight: '700',
  },
  selectedDayText: {
    color: colors.textOnPrimary,
    fontWeight: '700',
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: space.md,
    paddingTop: space.sm,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.divider,
  },
  todayPill: {
    paddingHorizontal: space.sm,
    paddingVertical: 6,
    borderRadius: radius.full,
    backgroundColor: colors.surfaceAlt,
  },
  todayPillText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.primary,
  },
  actionBtns: {
    flexDirection: 'row',
    gap: space.xs,
  },
  actionBtn: {
    minHeight: 38,
    paddingHorizontal: space.md,
    paddingVertical: 6,
  },
});

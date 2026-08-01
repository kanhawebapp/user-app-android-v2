import React, {useState, useCallback, useMemo} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  StyleSheet,
  ScrollView,
  Platform,
} from 'react-native';
import {useTheme} from '../../../../theme';
import {Icon} from '../../../Icon';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';

interface DatePickerInputProps {
  value: string;
  onChangeText: (text: string) => void;
  error?: string;
}

const DAYS = Array.from({length: 31}, (_, i) => String(i + 1).padStart(2, '0'));
const MONTHS = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];

const getCurrentYear = () => new Date().getFullYear();
const YEARS = (() => {
  const current = getCurrentYear();
  const years = [];
  for (let i = 0; i < 100; i++) {
    years.push(String(current - i));
  }
  return years;
})();

export const DatePickerInput: React.FC<DatePickerInputProps> = ({
  value,
  onChangeText,
  error,
}) => {
  const theme = useTheme();
  const colors = theme.colors;

  const [showPicker, setShowPicker] = useState(false);
  const [selectedDay, setSelectedDay] = useState('01');
  const [selectedMonth, setSelectedMonth] = useState('Jan');
  const [selectedYear, setSelectedYear] = useState(
    String(newDate().getFullYear()),
  );

  const parsedDate = useMemo(() => {
    if (!value) {
      return null;
    }
    const [day, month, year] = value.split('/');
    return {day, month, year};
  }, [value]);

  const getMonthName = useCallback((month: string) => {
    const monthIndex = Number(month);
    if (monthIndex >= 1 && monthIndex <= 12) {
      return MONTHS[monthIndex - 1];
    }
    return 'Jan';
  }, []);

  React.useEffect(() => {
    if (parsedDate) {
      setSelectedDay(parsedDate.day || '01');
      setSelectedMonth(getMonthName(parsedDate.month || '1'));
      setSelectedYear(parsedDate.year || String(new Date().getFullYear()));
    }
  }, [parsedDate, getMonthName]);

  const handleOpenPicker = useCallback(() => {
    if (value) {
      const [day, month, year] = value.split('/');
      setSelectedDay(day || '01');
      setSelectedMonth(getMonthName(month || '1'));
      setSelectedYear(year || String(new Date().getFullYear()));
    }
    setShowPicker(true);
  }, [value, getMonthName]);

  const handleConfirm = useCallback(() => {
    const monthIndex = MONTHS.indexOf(selectedMonth) + 1;
    const formattedMonth = String(monthIndex).padStart(2, '0');
    const dateStr = `${selectedDay}/${formattedMonth}/${selectedYear}`;
    onChangeText(dateStr);
    setShowPicker(false);
  }, [selectedDay, selectedMonth, selectedYear, onChangeText]);

  const handleClear = useCallback(() => {
    onChangeText('');
    setShowPicker(false);
  }, [onChangeText]);

  const getMonthIndex = (month: string) => MONTHS.indexOf(month);

  return (
    <View style={styles.container}>
      <Text style={[styles.label, {color: colors.text.primary}]}>
        Date of Birth <Text style={{color: colors.error.main}}>*</Text>
      </Text>
      <TouchableOpacity
        style={[
          styles.input,
          {
            backgroundColor: colors.background.secondary,
            borderColor: error ? colors.error.main : colors.border.light,
          },
        ]}
        onPress={handleOpenPicker}
        activeOpacity={0.7}>
        {value ? (
          <Text style={[styles.valueText, {color: colors.text.primary}]}>
            {value}
          </Text>
        ) : (
          <Text style={[styles.placeholder, {color: colors.text.tertiary}]}>
            Select date of birth
          </Text>
        )}
        <FontAwesome6
          name="calendar-days"
          size={20}
          color={colors.primary.main}
        />
      </TouchableOpacity>
      {error && (
        <Text style={[styles.errorText, {color: colors.error.main}]}>
          {error}
        </Text>
      )}

      <Modal
        visible={showPicker}
        transparent
        animationType="slide"
        onRequestClose={() => setShowPicker(false)}>
        <View style={styles.modalOverlay}>
          <TouchableOpacity
            style={styles.modalBackdrop}
            activeOpacity={1}
            onPress={() => setShowPicker(false)}
          />
          <View
            style={[
              styles.modalContent,
              {backgroundColor: colors.background.primary},
            ]}>
            <View style={styles.modalHeader}>
              <TouchableOpacity onPress={handleClear}>
                <Text style={[styles.clearText, {color: colors.error.main}]}>
                  Clear
                </Text>
              </TouchableOpacity>
              <Text style={[styles.modalTitle, {color: colors.text.primary}]}>
                Select Date
              </Text>
              <TouchableOpacity onPress={handleConfirm}>
                <Text
                  style={[styles.confirmText, {color: colors.primary.main}]}>
                  Done
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.pickerContainer}>
              <View style={styles.pickerColumn}>
                <Text
                  style={[styles.pickerLabel, {color: colors.text.secondary}]}>
                  Day
                </Text>
                <ScrollView
                  style={styles.scrollColumn}
                  showsVerticalScrollIndicator={false}
                  snapToInterval={44}
                  decelerationRate="fast">
                  {DAYS.map(day => (
                    <TouchableOpacity
                      key={day}
                      style={styles.pickerItem}
                      onPress={() => setSelectedDay(day)}>
                      <Text
                        style={[
                          styles.pickerItemText,
                          {
                            color:
                              selectedDay === day
                                ? colors.primary.main
                                : colors.text.secondary,
                            fontWeight: selectedDay === day ? '600' : '400',
                          },
                        ]}>
                        {day}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>

              <View style={styles.pickerColumn}>
                <Text
                  style={[styles.pickerLabel, {color: colors.text.secondary}]}>
                  Month
                </Text>
                <ScrollView
                  style={styles.scrollColumn}
                  showsVerticalScrollIndicator={false}
                  snapToInterval={44}
                  decelerationRate="fast">
                  {MONTHS.map(month => (
                    <TouchableOpacity
                      key={month}
                      style={styles.pickerItem}
                      onPress={() => setSelectedMonth(month)}>
                      <Text
                        style={[
                          styles.pickerItemText,
                          {
                            color:
                              selectedMonth === month
                                ? colors.primary.main
                                : colors.text.secondary,
                            fontWeight: selectedMonth === month ? '600' : '400',
                          },
                        ]}>
                        {month}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>

              <View style={styles.pickerColumn}>
                <Text
                  style={[styles.pickerLabel, {color: colors.text.secondary}]}>
                  Year
                </Text>
                <ScrollView
                  style={styles.scrollColumn}
                  showsVerticalScrollIndicator={false}
                  snapToInterval={44}
                  decelerationRate="fast">
                  {YEARS.map(year => (
                    <TouchableOpacity
                      key={year}
                      style={styles.pickerItem}
                      onPress={() => setSelectedYear(year)}>
                      <Text
                        style={[
                          styles.pickerItemText,
                          {
                            color:
                              selectedYear === year
                                ? colors.primary.main
                                : colors.text.secondary,
                            fontWeight: selectedYear === year ? '600' : '400',
                          },
                        ]}>
                        {year}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

function newDate() {
  return new Date();
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 10,
  },
  input: {
    height: 52,
    borderRadius: 12,
    paddingHorizontal: 16,
    borderWidth: 1.5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  valueText: {
    fontSize: 16,
  },
  placeholder: {
    fontSize: 16,
  },
  errorText: {
    fontSize: 12,
    marginTop: 6,
    fontWeight: '500',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingBottom: Platform.OS === 'ios' ? 34 : 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.1)',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  clearText: {
    fontSize: 16,
    fontWeight: '500',
  },
  confirmText: {
    fontSize: 16,
    fontWeight: '600',
  },
  pickerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 12,
    paddingVertical: 20,
  },
  pickerColumn: {
    flex: 1,
    alignItems: 'center',
  },
  pickerLabel: {
    fontSize: 12,
    fontWeight: '500',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  scrollColumn: {
    height: 200,
    width: '100%',
  },
  pickerItem: {
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pickerItemText: {
    fontSize: 18,
  },
});

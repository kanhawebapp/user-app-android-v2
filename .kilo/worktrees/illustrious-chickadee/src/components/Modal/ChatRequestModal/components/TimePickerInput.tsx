import React, {useState, useCallback, useMemo} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
  ScrollView,
  Platform,
} from 'react-native';
import {useTheme} from '../../../../theme';
import {Icon} from '../../../Icon';
import Feather from 'react-native-vector-icons/Feather';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';

interface TimePickerInputProps {
  value: string;
  onChangeText: (text: string) => void;
}

const HOURS = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];
const MINUTES = (() => {
  const mins = [];
  for (let i = 0; i < 60; i++) {
    mins.push(String(i).padStart(2, '0'));
  }
  return mins;
})();
const MERIDIEM = ['AM', 'PM'];

export const TimePickerInput: React.FC<TimePickerInputProps> = ({
  value,
  onChangeText,
}) => {
  const theme = useTheme();
  const colors = theme.colors;

  const [showPicker, setShowPicker] = useState(false);
  const [selectedHour, setSelectedHour] = useState('09');
  const [selectedMinute, setSelectedMinute] = useState('00');
  const [selectedMeridiem, setSelectedMeridiem] = useState('AM');

  const parseValue = useCallback(() => {
    if (!value) return {hour: '09', minute: '00', meridiem: 'AM'};

    const [timePart, meridiemPart] = value.split(' ');
    const [h, m] = timePart.split(':');

    let hourNum = parseInt(h, 10);
    let meridiem = meridiemPart || 'AM';

    if (meridiem === 'PM' && hourNum !== 12) {
      hourNum += 12;
    }
    if (meridiem === 'AM' && hourNum === 12) {
      hourNum = 0;
    }

    const displayHour =
      hourNum === 0
        ? '12'
        : String(hourNum > 12 ? hourNum - 12 : hourNum).padStart(2, '0');

    return {
      hour: displayHour,
      minute: m,
      meridiem,
    };
  }, [value]);

  React.useEffect(() => {
    const parsed = parseValue();
    setSelectedHour(parsed.hour);
    setSelectedMinute(parsed.minute);
    setSelectedMeridiem(parsed.meridiem);
  }, [parseValue]);

  const handleOpenPicker = useCallback(() => {
    const parsed = parseValue();
    setSelectedHour(parsed.hour);
    setSelectedMinute(parsed.minute);
    setSelectedMeridiem(parsed.meridiem);
    setShowPicker(true);
  }, [parseValue]);

  const handleConfirm = useCallback(() => {
    const timeStr = `${selectedHour}:${selectedMinute} ${selectedMeridiem}`;
    onChangeText(timeStr);
    setShowPicker(false);
  }, [selectedHour, selectedMinute, selectedMeridiem, onChangeText]);

  const handleClear = useCallback(() => {
    onChangeText('');
    setShowPicker(false);
  }, [onChangeText]);

  const formatDisplayValue = useMemo(() => {
    if (!value) return null;
    return value;
  }, [value]);

  return (
    <View style={styles.container}>
      <Text style={[styles.label, {color: colors.text.secondary}]}>
        Time of Birth{' '}
        <Text style={{color: colors.text.tertiary}}>(Optional)</Text>
      </Text>
      <TouchableOpacity
        style={[
          styles.input,
          {
            backgroundColor: colors.background.secondary,
            borderColor: colors.border.light,
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
            Select time of birth
          </Text>
        )}
        <FontAwesome6 name="clock" size={20} color={colors.text.secondary} />
      </TouchableOpacity>

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
                Select Time
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
                  Hour
                </Text>
                <ScrollView
                  style={styles.scrollColumn}
                  showsVerticalScrollIndicator={false}
                  snapToInterval={44}
                  decelerationRate="fast">
                  {HOURS.map(hour => (
                    <TouchableOpacity
                      key={hour}
                      style={styles.pickerItem}
                      onPress={() => setSelectedHour(hour)}>
                      <Text
                        style={[
                          styles.pickerItemText,
                          {
                            color:
                              selectedHour === hour
                                ? colors.primary.main
                                : colors.text.secondary,
                            fontWeight: selectedHour === hour ? '600' : '400',
                          },
                        ]}>
                        {hour}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>

              <View style={styles.pickerColumn}>
                <Text
                  style={[styles.pickerLabel, {color: colors.text.secondary}]}>
                  Min
                </Text>
                <ScrollView
                  style={styles.scrollColumn}
                  showsVerticalScrollIndicator={false}
                  snapToInterval={44}
                  decelerationRate="fast">
                  {MINUTES.map(minute => (
                    <TouchableOpacity
                      key={minute}
                      style={styles.pickerItem}
                      onPress={() => setSelectedMinute(minute)}>
                      <Text
                        style={[
                          styles.pickerItemText,
                          {
                            color:
                              selectedMinute === minute
                                ? colors.primary.main
                                : colors.text.secondary,
                            fontWeight:
                              selectedMinute === minute ? '600' : '400',
                          },
                        ]}>
                        {minute}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>

              <View style={styles.pickerColumn}>
                <Text
                  style={[styles.pickerLabel, {color: colors.text.secondary}]}>
                  AM/PM
                </Text>
                <ScrollView
                  style={styles.scrollColumn}
                  showsVerticalScrollIndicator={false}
                  snapToInterval={44}
                  decelerationRate="fast">
                  {MERIDIEM.map(m => (
                    <TouchableOpacity
                      key={m}
                      style={styles.pickerItem}
                      onPress={() => setSelectedMeridiem(m)}>
                      <Text
                        style={[
                          styles.pickerItemText,
                          {
                            color:
                              selectedMeridiem === m
                                ? colors.primary.main
                                : colors.text.secondary,
                            fontWeight: selectedMeridiem === m ? '600' : '400',
                          },
                        ]}>
                        {m}
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

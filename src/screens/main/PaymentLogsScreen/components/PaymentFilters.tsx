import React, {useState} from 'react';
import {StyleSheet, TextInput, TouchableOpacity, View} from 'react-native';
import DatePicker from 'react-native-date-picker';
import {useTheme} from '../../../../theme';
import {Text} from '../../../../components/Text';
import {Icon} from '../../../../components/Icon';
import {Button} from '../../../../components';
import {
  displayLocalIsoDate,
  formatLocalIsoDate,
  parseLocalIsoDate,
} from '../../../../services/api/paymentLogs/paymentLogs.date';

interface PaymentFiltersProps {
  startDate: string | null;
  endDate: string | null;
  invoiceSearch: string;
  onStartDateChange: (value: string | null) => void;
  onEndDateChange: (value: string | null) => void;
  onInvoiceSearchChange: (value: string) => void;
  onReset: () => void;
}

type ActivePicker = 'start' | 'end' | null;

export const PaymentFilters: React.FC<PaymentFiltersProps> = ({
  startDate,
  endDate,
  invoiceSearch,
  onStartDateChange,
  onEndDateChange,
  onInvoiceSearchChange,
  onReset,
}) => {
  const {colors} = useTheme();
  const [activePicker, setActivePicker] = useState<ActivePicker>(null);

  const pickerDate =
    activePicker === 'end'
      ? endDate
        ? parseLocalIsoDate(endDate)
        : new Date()
      : startDate
      ? parseLocalIsoDate(startDate)
      : new Date();

  const handleConfirm = (selected: Date) => {
    const iso = formatLocalIsoDate(selected);
    if (activePicker === 'start') {
      onStartDateChange(iso);
    } else if (activePicker === 'end') {
      onEndDateChange(iso);
    }
    setActivePicker(null);
  };

  const handleCancel = () => {
    setActivePicker(null);
  };

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <TouchableOpacity
          style={[
            styles.dateBtn,
            {
              backgroundColor: colors.background.secondary,
              borderColor: colors.border.light,
            },
          ]}
          onPress={() => setActivePicker('start')}
          activeOpacity={0.7}>
          <Icon name="calendar-today" size={16} color={colors.text.secondary} />
          <View style={styles.dateTextWrap}>
            <Text variant="captionSmall" style={{color: colors.text.tertiary}}>
              Start date
            </Text>
            <Text
              variant="bodySmall"
              weight="medium"
              style={{color: colors.text.primary}}>
              {displayLocalIsoDate(startDate)}
            </Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.dateBtn,
            {
              backgroundColor: colors.background.secondary,
              borderColor: colors.border.light,
            },
          ]}
          onPress={() => setActivePicker('end')}
          activeOpacity={0.7}>
          <Icon name="calendar-today" size={16} color={colors.text.secondary} />
          <View style={styles.dateTextWrap}>
            <Text variant="captionSmall" style={{color: colors.text.tertiary}}>
              End date
            </Text>
            <Text
              variant="bodySmall"
              weight="medium"
              style={{color: colors.text.primary}}>
              {displayLocalIsoDate(endDate)}
            </Text>
          </View>
        </TouchableOpacity>
      </View>

      <View
        style={[
          styles.searchBox,
          {
            backgroundColor: colors.background.secondary,
            borderColor: colors.border.light,
          },
        ]}>
        <Icon name="receipt" size={18} color={colors.text.tertiary} />
        <TextInput
          value={invoiceSearch}
          onChangeText={onInvoiceSearchChange}
          placeholder="Search invoice number"
          placeholderTextColor={colors.text.tertiary}
          style={[styles.input, {color: colors.text.primary}]}
          autoCapitalize="characters"
          autoCorrect={false}
        />
      </View>

      <Button
        title="Clear Filters"
        variant="outline"
        size="small"
        onPress={onReset}
      />

      <DatePicker
        modal
        mode="date"
        open={activePicker != null}
        date={pickerDate}
        maximumDate={new Date()}
        title={activePicker === 'end' ? 'Select End Date' : 'Select Start Date'}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingBottom: 12,
    gap: 10,
  },
  row: {
    flexDirection: 'row',
    gap: 10,
  },
  dateBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  dateTextWrap: {
    flex: 1,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    minHeight: 44,
  },
  input: {
    flex: 1,
    fontSize: 14,
    paddingVertical: 10,
  },
});

export default PaymentFilters;

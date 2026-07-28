/**
 * CountryCodePicker Component
 * A modal with searchable list of countries with flags and codes
 */

import React, {useState, useMemo} from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import {useTheme, typography} from '../../theme';
import {Text} from '../Text';
import {Modal} from '../Modal';
import {Icon} from '../Icon';
import {COUNTRY_CODES, CountryCode} from '../../constants/app.constants';

export interface CountryCodePickerProps {
  visible: boolean;
  onClose: () => void;
  onSelect: (country: CountryCode) => void;
  selectedCountry?: CountryCode;
}

export const CountryCodePicker: React.FC<CountryCodePickerProps> = ({
  visible,
  onClose,
  onSelect,
  selectedCountry,
}) => {
  const theme = useTheme();
  const colors = theme.colors;
  const [searchQuery, setSearchQuery] = useState('');

  // Filter countries based on search query
  const filteredCountries = useMemo(() => {
    if (!searchQuery.trim()) {
      return COUNTRY_CODES;
    }
    const query = searchQuery.toLowerCase();
    return COUNTRY_CODES.filter(
      country =>
        country.name.toLowerCase().includes(query) ||
        country.phoneCode.includes(query) ||
        country.code.toLowerCase().includes(query),
    );
  }, [searchQuery]);

  const handleSelect = (country: CountryCode) => {
    onSelect(country);
    onClose();
    setSearchQuery('');
  };

  const renderCountryItem = ({item}: {item: CountryCode}) => {
    const isSelected = selectedCountry?.code === item.code;
    return (
      <TouchableOpacity
        style={[
          styles.countryItem,
          {
            backgroundColor: isSelected
              ? colors.primary.light + '20'
              : 'transparent',
          },
        ]}
        onPress={() => handleSelect(item)}
        activeOpacity={0.7}>
        <Text variant="h4" style={styles.flag}>
          {item.flag}
        </Text>
        <View style={styles.countryInfo}>
          <Text
            variant="body"
            color={colors.text.primary}
            style={styles.countryName}>
            {item.name}
          </Text>
          <Text variant="bodySmall" color={colors.text.tertiary}>
            {item.phoneCode}
          </Text>
        </View>
        {isSelected && (
          <Icon
            name="check"
            size={20}
            color={colors.primary.main}
            library="MaterialIcons"
          />
        )}
      </TouchableOpacity>
    );
  };

  return (
    <Modal
      visible={visible}
      onClose={onClose}
      showBackdrop={true}
      dismissOnBackdropPress={true}
      showCloseButton={false}
      contentStyle={styles.modalContent}>
      {/* Header */}
      <View style={styles.header}>
        <Text variant="h6" weight="bold" color={colors.text.primary}>
          Select Country
        </Text>
        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
          <Icon
            name="close"
            size={22}
            color={colors.primary.main}
            library="MaterialIcons"
          />
        </TouchableOpacity>
      </View>

      {/* Search Input */}
      <View
        style={[
          styles.searchContainer,
          {
            backgroundColor: colors.background.secondary,
            borderRadius: typography.borderRadius.sm,
          },
        ]}>
        <Icon
          name="search"
          size={20}
          color={colors.text.tertiary}
          library="MaterialIcons"
        />
        <TextInput
          style={[styles.searchInput, {color: colors.text.primary}]}
          placeholder="Search country..."
          placeholderTextColor={colors.text.tertiary}
          value={searchQuery}
          onChangeText={setSearchQuery}
          autoCapitalize="none"
          autoCorrect={false}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <Icon
              name="close"
              size={18}
              color={colors.text.tertiary}
              library="MaterialIcons"
            />
          </TouchableOpacity>
        )}
      </View>

      {/* Country List */}
      <FlatList
        data={filteredCountries}
        renderItem={renderCountryItem}
        keyExtractor={item => item.code}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text variant="body" color={colors.text.tertiary}>
              No countries found
            </Text>
          </View>
        }
      />
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContent: {
    height: '70%',
    paddingHorizontal: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  closeButton: {
    padding: 4,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginVertical: 12,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
    paddingVertical: 0,
  },
  listContent: {
    paddingBottom: 16,
  },
  countryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 8,
    marginBottom: 4,
  },
  flag: {
    marginRight: 12,
  },
  countryInfo: {
    flex: 1,
  },
  countryName: {
    fontWeight: '500',
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
});

export default CountryCodePicker;

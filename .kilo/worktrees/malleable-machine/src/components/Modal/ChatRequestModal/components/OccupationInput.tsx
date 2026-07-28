
import React, {useState, useCallback, useMemo} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  StyleSheet,
  FlatList,
  Platform,
} from 'react-native';
import {useTheme} from '../../../../theme';
import {Icon} from '../../../Icon';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';

interface OccupationInputProps {
  value: string;
  onChangeText: (text: string) => void;
}

const COMMON_OCCUPATIONS = [
  'Software Engineer',
  'Business Owner',
  'Student',
  'Doctor',
  'Engineer',
  'Teacher',
  'Accountant',
  'Lawyer',
  'Manager',
  'Consultant',
  'Designer',
  'Artist',
  'Writer',
  'Chef',
  'Nurse',
  'Pharmacist',
  'Banker',
  'Real Estate',
  'Government Employee',
  'Homemaker',
  'Retired',
  'Trader',
  'Marketing',
  'Sales',
  'HR Professional',
  'Pilot',
  'Architect',
  'Scientist',
  'Researcher',
  'Actor',
  'Musician',
];

export const OccupationInput: React.FC<OccupationInputProps> = ({
  value,
  onChangeText,
}) => {
  const theme = useTheme();
  const colors = theme.colors;

  const [showPicker, setShowPicker] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  //  Filter + Custom Option
  const filteredOccupations = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    const filtered = COMMON_OCCUPATIONS.filter(item =>
      item.toLowerCase().includes(query),
    );

    const exactMatch = COMMON_OCCUPATIONS.some(
      item => item.toLowerCase() === query,
    );

    if (query.length > 0 && !exactMatch) {
      return [`Use "${searchQuery}"`, ...filtered];
    }

    return filtered;
  }, [searchQuery]);

  const handleOpenPicker = useCallback(() => {
    setSearchQuery(value || '');
    setShowPicker(true);
  }, [value]);

  const handleSelect = useCallback(
    (item: string) => {
      if (item.startsWith('Use "')) {
        const customValue = item.replace(/^Use "/, '').replace(/"$/, '');
        onChangeText(customValue);
      } else {
        onChangeText(item);
      }

      setShowPicker(false);
      setSearchQuery('');
    },
    [onChangeText],
  );

  const handleClear = useCallback(() => {
    onChangeText('');
    setSearchQuery('');
    setShowPicker(false);
  }, [onChangeText]);

  const renderItem = useCallback(
    ({item}: {item: string}) => {
      const isCustom = item.startsWith('Use "');

      return (
        <TouchableOpacity
          style={[
            styles.occupationItem,
            {borderBottomColor: colors.border.light},
          ]}
          onPress={() => handleSelect(item)}>
          <Text
            style={[
              styles.occupationText,
              {
                color: isCustom ? colors.primary.main : colors.text.primary,
                fontWeight: isCustom ? '600' : '400',
              },
            ]}>
            {item}
          </Text>
        </TouchableOpacity>
      );
    },
    [colors, handleSelect],
  );

  return (
    <View style={styles.container}>
      <Text style={[styles.label, {color: colors.text.secondary}]}>
        Occupation <Text style={{color: colors.text.tertiary}}>(Optional)</Text>
      </Text>

      {/* SAME INPUT (no change UI) */}
      <TouchableOpacity
        style={[
          styles.input,
          {
            backgroundColor: colors.background.secondary,
            borderColor: colors.border.light,
          },
        ]}
        onPress={handleOpenPicker}>
        {value ? (
          <Text style={[styles.valueText, {color: colors.text.primary}]}>
            {value}
          </Text>
        ) : (
          <Text style={[styles.placeholder, {color: colors.text.tertiary}]}>
            Select or type occupation
          </Text>
        )}
        <FontAwesome6 name="briefcase" size={20} color={colors.text.secondary} />
      </TouchableOpacity>

      {/* ✅ MODAL SAME AS BEFORE */}
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
            {/* HEADER */}
            <View style={styles.modalHeader}>
              <TouchableOpacity onPress={handleClear}>
                <Text style={[styles.clearText, {color: colors.error.main}]}>
                  Clear
                </Text>
              </TouchableOpacity>
              <Text style={[styles.modalTitle, {color: colors.text.primary}]}>
                Select Occupation
              </Text>
              <View style={{width: 40}} />
            </View>

            {/* SEARCH */}
            <View style={styles.searchContainer}>
              <View
                style={[
                  styles.searchInput,
                  {
                    backgroundColor: colors.background.secondary,
                    borderColor: colors.border.light,
                  },
                ]}>
                <Icon name="search" size={18} color={colors.text.tertiary} />
                <TextInput
                  style={[styles.searchTextInput, {color: colors.text.primary}]}
                  placeholder="Search or type occupation..."
                  placeholderTextColor={colors.text.tertiary}
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                  autoCapitalize="words"
                />
                {searchQuery.length > 0 && (
                  <TouchableOpacity onPress={() => setSearchQuery('')}>
                    <Icon name="close" size={18} />
                  </TouchableOpacity>
                )}
              </View>
            </View>

            {/* LIST */}
            <FlatList
              data={filteredOccupations}
              keyExtractor={(item, index) => `${item}-${index}`}
              renderItem={renderItem}
              keyboardShouldPersistTaps="handled"
              contentContainerStyle={styles.listContent}
              showsVerticalScrollIndicator={false}
              ListEmptyComponent={
                <View style={styles.emptyContainer}>
                  <Text style={{color: colors.text.secondary}}>
                    No occupations found
                  </Text>
                </View>
              }
            />
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
      marginBottom: 10
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

  valueText: {fontSize: 16, flex: 1},
  placeholder: {fontSize: 16},

  modalOverlay: {flex: 1, justifyContent: 'flex-end'},
  modalBackdrop: {flex: 1, backgroundColor: 'rgba(0,0,0,0.5)'},

  modalContent: {
    height: '70%',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingBottom: Platform.OS === 'ios' ? 34 : 20,
  },

  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
    borderBottomWidth: 1,
  },

  modalTitle: {fontSize: 18, fontWeight: '600'},
  clearText: {fontSize: 16},

  searchContainer: {paddingHorizontal: 20, paddingVertical: 12},

  searchInput: {
    height: 48,
    borderRadius: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },

  searchTextInput: {flex: 1, fontSize: 16},

  listContent: {
    paddingHorizontal: 20,
  
  },

  occupationItem: {
    paddingVertical: 14,
    borderBottomWidth: 1,
  },

  occupationText: {fontSize: 15},

  emptyContainer: {
    paddingVertical: 40,
    alignItems: 'center',
  },
});

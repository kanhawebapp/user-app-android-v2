// import React, {useState, useCallback, useMemo} from 'react';
// import {
//   View,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   Modal,
//   StyleSheet,
//   FlatList,
//   Platform,
// } from 'react-native';
// import {useTheme} from '../../../../theme';
// import {Icon} from '../../../Icon';
// import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';

// interface PlaceOfBirthInputProps {
//   value: string;
//   onChangeText: (text: string) => void;
//   error?: string;
// }

// const COMMON_PLACES = [
//   'Mumbai, Maharashtra, India',
//   'Delhi, NCR, India',
//   'Bangalore, Karnataka, India',
//   'Chennai, Tamil Nadu, India',
//   'Kolkata, West Bengal, India',
//   'Hyderabad, Telangana, India',
//   'Pune, Maharashtra, India',
//   'Ahmedabad, Gujarat, India',
//   'Jaipur, Rajasthan, India',
//   'Lucknow, Uttar Pradesh, India',
//   'Chandigarh, India',
//   'Surat, Gujarat, India',
//   'Indore, Madhya Pradesh, India',
//   'Bhopal, Madhya Pradesh, India',
//   'Nagpur, Maharashtra, India',
//   'Coimbatore, Tamil Nadu, India',
//   'Kochi, Kerala, India',
//   'Visakhapatnam, Andhra Pradesh, India',
//   'Vadodara, Gujarat, India',
//   'Goa, India',
//   'Ludhiana, Punjab, India',
//   ' Agra, Uttar Pradesh, India',
//   'Varanasi, Uttar Pradesh, India',
//   'Mysore, Karnataka, India',
//   'Trivandrum, Kerala, India',
// ];

// export const PlaceOfBirthInput: React.FC<PlaceOfBirthInputProps> = ({
//   value,
//   onChangeText,
//   error,
// }) => {
//   const theme = useTheme();
//   const colors = theme.colors;

//   const [showPicker, setShowPicker] = useState(false);
//   const [searchQuery, setSearchQuery] = useState('');

//   const filteredPlaces = useMemo(() => {
//     if (!searchQuery.trim()) {
//       return COMMON_PLACES;
//     }
//     const query = searchQuery.toLowerCase();
//     return COMMON_PLACES.filter(place => place.toLowerCase().includes(query));
//   }, [searchQuery]);

//   const handleOpenPicker = useCallback(() => {
//     setSearchQuery('');
//     setShowPicker(true);
//   }, []);

//   const handleSelectPlace = useCallback(
//     (place: string) => {
//       onChangeText(place);
//       setShowPicker(false);
//       setSearchQuery('');
//     },
//     [onChangeText],
//   );

//   const handleClear = useCallback(() => {
//     onChangeText('');
//     setShowPicker(false);
//     setSearchQuery('');
//   }, [onChangeText]);

//   const renderPlaceItem = useCallback(
//     ({item}: {item: string}) => (
//       <TouchableOpacity
//         style={[styles.placeItem, {borderBottomColor: colors.border.light}]}
//         onPress={() => handleSelectPlace(item)}
//         activeOpacity={0.7}>
//         <FontAwesome6
//           name="location-dot"
//           size={18}
//           color={colors.text.secondary}
//         />
//         <Text style={[styles.placeText, {color: colors.text.primary}]}>
//           {item}
//         </Text>
//       </TouchableOpacity>
//     ),
//     [colors],
//   );

//   return (
//     <View style={styles.container}>
//       <Text style={[styles.label, {color: colors.text.primary}]}>
//         Place of Birth <Text style={{color: colors.error.main}}>*</Text>
//       </Text>
//       <TouchableOpacity
//         style={[
//           styles.input,
//           {
//             backgroundColor: colors.background.secondary,
//             borderColor: error ? colors.error.main : colors.border.light,
//           },
//         ]}
//         onPress={handleOpenPicker}
//         activeOpacity={0.7}>
//         {value ? (
//           <Text style={[styles.valueText, {color: colors.text.primary}]}>
//             {value}
//           </Text>
//         ) : (
//           <Text style={[styles.placeholder, {color: colors.text.tertiary}]}>
//             Select birth place
//           </Text>
//         )}
//         <FontAwesome6
//           name="location-dot"
//           size={18}
//           color={colors.text.secondary}
//         />
//       </TouchableOpacity>
//       {error && (
//         <Text style={[styles.errorText, {color: colors.error.main}]}>
//           {error}
//         </Text>
//       )}

//       <Modal
//         visible={showPicker}
//         transparent
//         animationType="slide"
//         onRequestClose={() => setShowPicker(false)}>
//         <View style={styles.modalOverlay}>
//           <TouchableOpacity
//             style={styles.modalBackdrop}
//             activeOpacity={1}
//             onPress={() => setShowPicker(false)}
//           />
//           <View
//             style={[
//               styles.modalContent,
//               {backgroundColor: colors.background.primary},
//             ]}>
//             <View style={styles.modalHeader}>
//               <TouchableOpacity onPress={handleClear}>
//                 <Text style={[styles.clearText, {color: colors.error.main}]}>
//                   Clear
//                 </Text>
//               </TouchableOpacity>
//               <Text style={[styles.modalTitle, {color: colors.text.primary}]}>
//                 Select Birth Place
//               </Text>
//               <View style={{width: 40}} />
//             </View>

//             <View style={styles.searchContainer}>
//               <View
//                 style={[
//                   styles.searchInput,
//                   {
//                     backgroundColor: colors.background.secondary,
//                     borderColor: colors.border.light,
//                   },
//                 ]}>
//                 <Icon name="search" size={18} color={colors.text.tertiary} />
//                 <TextInput
//                   style={[styles.searchTextInput, {color: colors.text.primary}]}
//                   placeholder="Search city..."
//                   placeholderTextColor={colors.text.tertiary}
//                   value={searchQuery}
//                   onChangeText={setSearchQuery}
//                   autoCapitalize="words"
//                 />
//                 {searchQuery.length > 0 && (
//                   <TouchableOpacity onPress={() => setSearchQuery('')}>
//                     <Icon name="close" size={18} color={colors.text.tertiary} />
//                   </TouchableOpacity>
//                 )}
//               </View>
//             </View>

//             <FlatList
//               data={filteredPlaces}
//               keyExtractor={(item, index) => `${item}-${index}`}
//               renderItem={renderPlaceItem}
//               style={styles.placesList}
//               contentContainerStyle={styles.placesListContent}
//               showsVerticalScrollIndicator={false}
//               ListEmptyComponent={
//                 <View style={styles.emptyContainer}>
//                   <Text
//                     style={[styles.emptyText, {color: colors.text.secondary}]}>
//                     No places found
//                   </Text>
//                 </View>
//               }
//             />
//           </View>
//         </View>
//       </Modal>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     marginBottom: 16,
//   },
//   label: {
//     fontSize: 14,
//     fontWeight: '500',
//     marginBottom: 10,
//   },
//   input: {
//     height: 52,
//     borderRadius: 12,
//     paddingHorizontal: 16,
//     borderWidth: 1.5,
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//   },
//   valueText: {
//     fontSize: 16,
//     flex: 1,
//   },
//   placeholder: {
//     fontSize: 16,
//   },
//   errorText: {
//     fontSize: 12,
//     marginTop: 6,
//     fontWeight: '500',
//   },
//   modalOverlay: {
//     flex: 1,
//     justifyContent: 'flex-end',
//   },
//   modalBackdrop: {
//     flex: 1,
//     backgroundColor: 'rgba(0, 0, 0, 0.5)',
//   },
//   modalContent: {
//     flex: 1,
//     maxHeight: '70%',
//     borderTopLeftRadius: 24,
//     borderTopRightRadius: 24,
//     paddingBottom: Platform.OS === 'ios' ? 34 : 20,
//   },
//   modalHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     paddingHorizontal: 20,
//     paddingVertical: 16,
//     borderBottomWidth: 1,
//     borderBottomColor: 'rgba(0, 0, 0, 0.1)',
//   },
//   modalTitle: {
//     fontSize: 18,
//     fontWeight: '600',
//   },
//   clearText: {
//     fontSize: 16,
//     fontWeight: '500',
//   },
//   searchContainer: {
//     paddingHorizontal: 20,
//     paddingVertical: 12,
//   },
//   searchInput: {
//     height: 48,
//     borderRadius: 12,
//     paddingHorizontal: 16,
//     borderWidth: 1,
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 10,
//   },
//   searchTextInput: {
//     flex: 1,
//     fontSize: 16,
//     padding: 0,
//   },
//   placesList: {
//     flex: 1,
//   },
//   placesListContent: {
//     paddingHorizontal: 20,
//   },
//   placeItem: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 12,
//     paddingVertical: 14,
//     borderBottomWidth: 1,
//   },
//   placeText: {
//     flex: 1,
//     fontSize: 15,
//   },
//   emptyContainer: {
//     paddingVertical: 40,
//     alignItems: 'center',
//   },
//   emptyText: {
//     fontSize: 15,
//   },
// });

//2nd

// import React, {useState, useCallback, useMemo, useEffect} from 'react';
// import {
//   View,
//   Text,
//   TouchableOpacity,
//   Modal,
//   StyleSheet,
//   FlatList,
//   TextInput,
//   Platform,
// } from 'react-native';
// import {useTheme} from '../../../../theme';
// import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';

// import {Country, State, City} from 'country-state-city';

// export const PlaceOfBirthInput = ({value, onChangeText, error}) => {
//   const theme = useTheme();
//   const colors = theme.colors;

//   const [showPicker, setShowPicker] = useState(false);
//   const [searchQuery, setSearchQuery] = useState('');
//   const [allPlaces, setAllPlaces] = useState<any[]>([]);

//   // ✅ LOAD DATA (STATE + CITY)
//   useEffect(() => {
//     const india = Country.getCountryByCode('IN');
//     if (!india) return;

//     const states = State.getStatesOfCountry(india.isoCode);

//     let places: any[] = [];

//     states.forEach(state => {
//       // 👉 Add STATE itself (IMPORTANT FIX)
//       places.push({
//         name: `${state.name}, ${india.name}`,
//       });

//       const cities = City.getCitiesOfState(india.isoCode, state.isoCode);

//       cities.forEach(city => {
//         places.push({
//           name: `${city.name}, ${state.name}, ${india.name}`,
//         });
//       });
//     });

//     setAllPlaces(places);
//   }, []);

//   // ✅ FILTER (IMPROVED)
//   const filteredPlaces = useMemo(() => {
//     const query = searchQuery.trim().toLowerCase();

//     if (!query) return allPlaces.slice(0, 50);

//     const results = allPlaces.filter(item =>
//       item.name.toLowerCase().includes(query),
//     );

//     return results.slice(0, 50);
//   }, [searchQuery, allPlaces]);

//   const handleSelect = useCallback(
//     (place: string) => {
//       onChangeText(place);
//       setShowPicker(false);
//       setSearchQuery('');
//     },
//     [onChangeText],
//   );

//   const handleClear = useCallback(() => {
//     onChangeText('');
//     setSearchQuery('');
//     setShowPicker(false);
//   }, [onChangeText]);

//   const renderItem = ({item}: any) => (
//     <TouchableOpacity
//       style={[styles.placeItem, {borderBottomColor: colors.border.light}]}
//       onPress={() => handleSelect(item.name)}>
//       <FontAwesome6
//         name="location-dot"
//         size={16}
//         color={colors.text.secondary}
//       />
//       <Text style={[styles.placeText, {color: colors.text.primary}]}>
//         {item.name}
//       </Text>
//     </TouchableOpacity>
//   );

//   return (
//     <View style={styles.container}>
//       <Text style={[styles.label, {color: colors.text.primary}]}>
//         Place of Birth <Text style={{color: colors.error.main}}>*</Text>
//       </Text>

//       <TouchableOpacity
//         style={[
//           styles.input,
//           {
//             backgroundColor: colors.background.secondary,
//             borderColor: error ? colors.error.main : colors.border.light,
//           },
//         ]}
//         onPress={() => setShowPicker(true)}>
//         {value ? (
//           <Text style={[styles.valueText, {color: colors.text.primary}]}>
//             {value}
//           </Text>
//         ) : (
//           <Text style={[styles.placeholder, {color: colors.text.tertiary}]}>
//             Select birth place
//           </Text>
//         )}
//         <FontAwesome6
//           name="location-dot"
//           size={18}
//           color={colors.text.secondary}
//         />
//       </TouchableOpacity>

//       {error && (
//         <Text style={[styles.errorText, {color: colors.error.main}]}>
//           {error}
//         </Text>
//       )}

//       <Modal visible={showPicker} transparent animationType="slide">
//         <View style={styles.modalOverlay}>
//           <TouchableOpacity
//             style={styles.modalBackdrop}
//             onPress={() => setShowPicker(false)}
//           />

//           <View
//             style={[
//               styles.modalContent,
//               {backgroundColor: colors.background.primary},
//             ]}>
//             {/* HEADER */}
//             <View style={styles.modalHeader}>
//               <TouchableOpacity onPress={handleClear}>
//                 <Text style={{color: colors.error.main}}>Clear</Text>
//               </TouchableOpacity>
//               <Text style={[styles.modalTitle, {color: colors.text.primary}]}>
//                 Select Birth Place
//               </Text>
//               <View style={{width: 40}} />
//             </View>

//             {/* SEARCH */}
//             <TextInput
//               placeholder="Search city or state..."
//               placeholderTextColor={colors.text.tertiary}
//               value={searchQuery}
//               onChangeText={setSearchQuery}
//               style={[
//                 styles.searchInput,
//                 {
//                   color: colors.text.primary,
//                   borderColor: colors.border.light,
//                 },
//               ]}
//             />

//             {/* LIST */}
//             <FlatList
//               data={filteredPlaces}
//               keyExtractor={(item, index) => index.toString()}
//               renderItem={renderItem}
//               keyboardShouldPersistTaps="handled"
//               ListEmptyComponent={
//                 <Text style={{textAlign: 'center', marginTop: 20}}>
//                   No results found
//                 </Text>
//               }
//             />
//           </View>
//         </View>
//       </Modal>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {marginBottom: 16},
//   label: {fontSize: 14, marginBottom: 10},

//   input: {
//     height: 52,
//     borderRadius: 12,
//     paddingHorizontal: 16,
//     borderWidth: 1.5,
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//   },

//   valueText: {fontSize: 16},
//   placeholder: {fontSize: 16},

//   errorText: {fontSize: 12, marginTop: 6},

//   modalOverlay: {flex: 1, justifyContent: 'flex-end'},
//   modalBackdrop: {flex: 1, backgroundColor: 'rgba(0,0,0,0.5)'},

//   modalContent: {
//     height: '70%',
//     borderTopLeftRadius: 24,
//     borderTopRightRadius: 24,
//     padding: 16,
//   },

//   modalHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     marginBottom: 10,
//   },

//   modalTitle: {fontSize: 18, fontWeight: '600'},

//   searchInput: {
//     height: 48,
//     borderRadius: 10,
//     borderWidth: 1,
//     paddingHorizontal: 12,
//     marginBottom: 10,
//   },

//   placeItem: {
//     flexDirection: 'row',
//     gap: 10,
//     paddingVertical: 12,
//     borderBottomWidth: 1,
//   },

//   placeText: {fontSize: 14},
// });

import React, {useState, useCallback, useMemo, useEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
  FlatList,
  TextInput,
} from 'react-native';
import {useTheme} from '../../../../theme';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';

import {Country, State, City} from 'country-state-city';

export const PlaceOfBirthInput: React.FC<any> = ({
  value,
  onChangeText,
  error,
}) => {
  const theme = useTheme();
  const colors = theme.colors;

  const [showPicker, setShowPicker] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [allPlaces, setAllPlaces] = useState<any[]>([]);

  // ✅ LOAD DATA
  useEffect(() => {
    const india = Country.getCountryByCode('IN');
    if (!india) return;

    const states = State.getStatesOfCountry(india.isoCode);

    let places: any[] = [];

    states.forEach(state => {
      const cities = City.getCitiesOfState(india.isoCode, state.isoCode);

      cities.forEach(city => {
        places.push({
          name: `${city.name}, ${state.name}, ${india.name}`,
        });
      });
    });

    setAllPlaces(places);
  }, []);

  // ✅ FILTER + CUSTOM OPTION
  const filteredPlaces = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    if (!query) return allPlaces.slice(0, 50);

    const results = allPlaces.filter(item =>
      item.name.toLowerCase().includes(query),
    );

    // 👉 exact match check
    const exactMatch = allPlaces.some(
      item => item.name.toLowerCase() === query,
    );

    // 👉 add custom option if no exact match
    if (query.length > 0 && !exactMatch) {
      return [{name: `Use "${searchQuery}"`, isCustom: true}, ...results].slice(
        0,
        50,
      );
    }

    return results.slice(0, 50);
  }, [searchQuery, allPlaces]);

  const handleSelect = useCallback(
    (item: any) => {
      if (item.isCustom) {
        onChangeText(searchQuery); // 👉 user input select
      } else {
        onChangeText(item.name);
      }

      setShowPicker(false);
      setSearchQuery('');
    },
    [onChangeText, searchQuery],
  );

  const handleClear = useCallback(() => {
    onChangeText('');
    setSearchQuery('');
    setShowPicker(false);
  }, [onChangeText]);

  const renderItem = ({item}: any) => {
    const isCustom = item.isCustom;

    return (
      <TouchableOpacity
        style={[styles.placeItem, {borderBottomColor: colors.border.light}]}
        onPress={() => handleSelect(item)}>
        <FontAwesome6
          name="location-dot"
          size={16}
          color={colors.text.secondary}
        />
        <Text
          style={[
            styles.placeText,
            {
              color: isCustom ? colors.primary.main : colors.text.primary,
              fontWeight: isCustom ? '600' : '400',
            },
          ]}>
          {item.name}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={[styles.label, {color: colors.text.primary}]}>
        Place of Birth <Text style={{color: colors.error.main}}>*</Text>
      </Text>

      <TouchableOpacity
        style={[
          styles.input,
          {
            backgroundColor: colors.background.secondary,
            borderColor: error ? colors.error.main : colors.border.light,
          },
        ]}
        onPress={() => setShowPicker(true)}>
        {value ? (
          <Text style={[styles.valueText, {color: colors.text.primary}]}>
            {value}
          </Text>
        ) : (
          <Text style={[styles.placeholder, {color: colors.text.tertiary}]}>
            Select birth place
          </Text>
        )}
        <FontAwesome6
          name="location-dot"
          size={18}
          color={colors.text.secondary}
        />
      </TouchableOpacity>

      {error && (
        <Text style={[styles.errorText, {color: colors.error.main}]}>
          {error}
        </Text>
      )}

      <Modal visible={showPicker} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <TouchableOpacity
            style={styles.modalBackdrop}
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
                <Text style={{color: colors.error.main}}>Clear</Text>
              </TouchableOpacity>
              <Text style={[styles.modalTitle, {color: colors.text.primary}]}>
                Select Birth Place
              </Text>
              <View style={{width: 40}} />
            </View>

            {/* SEARCH */}
            <TextInput
              placeholder="Search city..."
              placeholderTextColor={colors.text.tertiary}
              value={searchQuery}
              onChangeText={setSearchQuery}
              style={[
                styles.searchInput,
                {
                  color: colors.text.primary,
                  borderColor: colors.border.light,
                },
              ]}
            />

            {/* LIST */}
            <FlatList
              data={filteredPlaces}
              keyExtractor={(item, index) => index.toString()}
              renderItem={renderItem}
              keyboardShouldPersistTaps="handled"
            />
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {marginBottom: 16},
  label: {fontSize: 14, marginBottom: 10},

  input: {
    height: 52,
    borderRadius: 12,
    paddingHorizontal: 16,
    borderWidth: 1.5,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  valueText: {fontSize: 16},
  placeholder: {fontSize: 16},

  errorText: {fontSize: 12, marginTop: 6},

  modalOverlay: {flex: 1, justifyContent: 'flex-end'},
  modalBackdrop: {flex: 1, backgroundColor: 'rgba(0,0,0,0.5)'},

  modalContent: {
    height: '70%',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 16,
  },

  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },

  modalTitle: {fontSize: 18, fontWeight: '600'},

  searchInput: {
    height: 48,
    borderRadius: 10,
    borderWidth: 1,
    paddingHorizontal: 12,
    marginBottom: 10,
  },

  placeItem: {
    flexDirection: 'row',
    gap: 10,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },

  placeText: {fontSize: 14},
});

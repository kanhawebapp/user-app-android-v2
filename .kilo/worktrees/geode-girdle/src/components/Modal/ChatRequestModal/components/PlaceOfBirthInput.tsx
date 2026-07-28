// import React, {useState, useCallback, useMemo, useEffect} from 'react';
// import {
//   View,
//   Text,
//   TouchableOpacity,
//   Modal,
//   StyleSheet,
//   FlatList,
//   TextInput,
// } from 'react-native';
// import {useTheme} from '../../../../theme';
// import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';

// import {Country, State, City} from 'country-state-city';

// const MAX_PLACES = 50;

// const loadPlacesData = () => {
//   const india = Country.getCountryByCode('IN');
//   if (!india) {
//     return [];
//   }

//   const states = State.getStatesOfCountry(india.isoCode);
//   const places: {name: string}[] = [];
//   const seen = new Set<string>();

//   for (const state of states) {
//     const cities = City.getCitiesOfState(india.isoCode, state.isoCode);
//     for (const city of cities) {
//       const name = `${city.name}, ${state.name}, ${india.name}`;
//       if (!seen.has(name)) {
//         seen.add(name);
//         places.push({name});
//       }
//       if (places.length >= MAX_PLACES * 3) {
//         break;
//       }
//     }
//     if (places.length >= MAX_PLACES * 3) {
//       break;
//     }
//   }

//   return places;
// };

// // let cachedPlaces: any[] | null = null;

// // const loadPlacesData = () => {
// //   if (cachedPlaces) {
// //     return cachedPlaces;
// //   }

// //   const india = Country.getCountryByCode('IN');

// //   if (!india) {
// //     return [];
// //   }

// //   const states = State.getStatesOfCountry(india.isoCode);

// //   const places: { name: string }[] = [];
// //   const seen = new Set<string>();

// //   for (const state of states) {
// //     const cities = City.getCitiesOfState(india.isoCode, state.isoCode);

// //     for (const city of cities) {
// //       const name = `${city.name}, ${state.name}, ${india.name}`;

// //       if (!seen.has(name)) {
// //         seen.add(name);
// //         places.push({ name });
// //       }
// //     }
// //   }

// //   cachedPlaces = places;

// //   return places;
// // };

// export const PlaceOfBirthInput: React.FC<any> = ({
//   value,
//   onChangeText,
//   error,
// }) => {
//   const theme = useTheme();
//   const colors = theme.colors;

//   const [showPicker, setShowPicker] = useState(false);
//   const [searchQuery, setSearchQuery] = useState('');
//   // const [allPlaces, setAllPlaces] = useState<any[] | null>(null);
//   // const [allPlaces, setAllPlaces] = useState<any[]>([]);
//   const [allPlaces, setAllPlaces] = useState<any[] | null>(null);

//   //  LOAD DATA LAZILY - only when picker is opened

//   useEffect(() => {
//     if (showPicker && allPlaces === null) {
//       const data = loadPlacesData();
//       console.log('Loaded Places:', data.length);
//       setAllPlaces(data);
//     }
//   }, [showPicker, allPlaces]);
//   // useEffect(() => {
//   //   if (showPicker && allPlaces === null) {
//   //     requestAnimationFrame(() => {
//   //       const data = loadPlacesData();
//   //       setAllPlaces(data);
//   //     });
//   //   }
//   // }, [showPicker, allPlaces]);

//   // useEffect(() => {
//   //   if (showPicker && allPlaces === null) {
//   //     setAllPlaces(loadPlacesData());
//   //   }
//   // }, [showPicker]);

//   //  FILTER + CUSTOM OPTION
//   // const filteredPlaces = useMemo(() => {
//   //   const query = searchQuery.trim().toLowerCase();

//   //   if (!query) return allPlaces.slice(0, 50);

//   //   const results = allPlaces.filter(item =>
//   //     item.name.toLowerCase().includes(query),
//   //   );

//   //   // 👉 exact match check
//   //   const exactMatch = allPlaces.some(
//   //     item => item.name.toLowerCase() === query,
//   //   );

//   //   // 👉 add custom option if no exact match
//   //   if (query.length > 0 && !exactMatch) {
//   //     return [{name: `Use "${searchQuery}"`, isCustom: true}, ...results].slice(
//   //       0,
//   //       50,
//   //     );
//   //   }

//   //   return results.slice(0, 50);
//   // }, [searchQuery, allPlaces]);

//   const filteredPlaces = useMemo(() => {
//     if (!allPlaces || allPlaces.length === 0) {
//       return [];
//     }

//     const query = searchQuery.trim().toLowerCase();

//     if (!query) {
//       return allPlaces.slice(0, 50);
//     }

//     const results = allPlaces.filter(item =>
//       item.name.toLowerCase().includes(query),
//     );

//     const exactMatch = allPlaces.some(
//       item => item.name.toLowerCase() === query,
//     );

//     if (query.length > 0 && !exactMatch) {
//       return [{name: `Use "${searchQuery}"`, isCustom: true}, ...results].slice(
//         0,
//         50,
//       );
//     }

//     return results.slice(0, 50);
//   }, [searchQuery, allPlaces]);

//   const handleSelect = useCallback(
//     (item: any) => {
//       if (item.isCustom) {
//         onChangeText(searchQuery); //  user input select
//       } else {
//         onChangeText(item.name);
//       }

//       setShowPicker(false);
//       setSearchQuery('');
//     },
//     [onChangeText, searchQuery],
//   );

//   const handleClear = useCallback(() => {
//     onChangeText('');
//     setSearchQuery('');
//     setShowPicker(false);
//   }, [onChangeText]);

//   const renderItem = ({item}: any) => {
//     const isCustom = item.isCustom;

//     return (
//       <TouchableOpacity
//         style={[styles.placeItem, {borderBottomColor: colors.border.light}]}
//         onPress={() => handleSelect(item)}>
//         <FontAwesome6
//           name="location-dot"
//           size={16}
//           color={colors.text.secondary}
//         />
//         <Text
//           style={[
//             styles.placeText,
//             {
//               color: isCustom ? colors.primary.main : colors.text.primary,
//               fontWeight: isCustom ? '600' : '400',
//             },
//           ]}>
//           {item.name}
//         </Text>
//       </TouchableOpacity>
//     );
//   };

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
//               placeholder="Search city..."
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
//             {/* <FlatList
//               data={filteredPlaces}
//               keyExtractor={(item, index) => index.toString()}
//               renderItem={renderItem}
//               keyboardShouldPersistTaps="handled"
//             /> */}
//             <FlatList
//               data={filteredPlaces || []}
//               keyExtractor={(item, index) => index.toString()}
//               renderItem={renderItem}
//               keyboardShouldPersistTaps="handled"
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
  ActivityIndicator,
} from 'react-native';
import {useTheme} from '../../../../theme';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';

import {Country, State, City} from 'country-state-city';

const MAX_RESULTS = 50;

const searchPlaces = (query: string) => {
  const india = Country.getCountryByCode('IN');

  if (!india) {
    return [];
  }

  const normalizedQuery = query.trim().toLowerCase();

  if (!normalizedQuery) {
    return [];
  }

  const states = State.getStatesOfCountry(india.isoCode);

  const results: {name: string}[] = [];
  const seen = new Set<string>();

  for (const state of states) {
    const cities = City.getCitiesOfState(india.isoCode, state.isoCode);

    for (const city of cities) {
      const placeName = `${city.name}, ${state.name}, ${india.name}`;

      if (
        placeName.toLowerCase().includes(normalizedQuery) &&
        !seen.has(placeName)
      ) {
        seen.add(placeName);

        results.push({
          name: placeName,
        });
      }

      if (results.length >= MAX_RESULTS) {
        return results;
      }
    }
  }

  return results;
};

export const PlaceOfBirthInput: React.FC<any> = ({
  value,
  onChangeText,
  error,
}) => {
  const theme = useTheme();
  const colors = theme.colors;

  const [showPicker, setShowPicker] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);

  // const filteredPlaces = useMemo(() => {
  //   const query = searchQuery.trim();

  //   if (!query) {
  //     return [];
  //   }

  //   const results = searchPlaces(query);

  //   const exactMatch = results.some(
  //     item => item.name.toLowerCase() === query.toLowerCase(),
  //   );

  //   if (!exactMatch) {
  //     return [
  //       {
  //         name: `Use "${searchQuery}"`,
  //         isCustom: true,
  //       },
  //       ...results,
  //     ];
  //   }

  //   return results;
  // }, [searchQuery]);

  const [filteredPlaces, setFilteredPlaces] = useState<any[]>([]);

  const handleSelect = useCallback(
    (item: any) => {
      if (item.isCustom) {
        onChangeText(searchQuery); //  user input select
      } else {
        onChangeText(item.name);
      }

      setShowPicker(false);
      setSearchQuery('');
    },
    [onChangeText, searchQuery],
  );

  useEffect(() => {
    const query = searchQuery.trim();

    if (!query) {
      setFilteredPlaces([]);
      setLoading(false);
      return;
    }

    setLoading(true);

    const timer = setTimeout(() => {
      const results = searchPlaces(query);

      const exactMatch = results.some(
        item => item.name.toLowerCase() === query.toLowerCase(),
      );

      let finalResults = results;

      if (!exactMatch) {
        finalResults = [
          {
            name: `Use "${searchQuery}"`,
            isCustom: true,
          },
          ...results,
        ];
      }

      setFilteredPlaces(finalResults);
      setLoading(false);
    }, 400); // debounce

    return () => clearTimeout(timer);
  }, [searchQuery]);

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
              placeholder="Search Address..."
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
            {searchQuery.trim().length === 0 && (
              <View style={styles.emptyContainer}>
                <Text
                  style={[styles.emptyText, {color: colors.text.secondary}]}>
                  Search your birth place
                </Text>
              </View>
            )}

            {/* LIST */}
            {/* <FlatList
              data={filteredPlaces}
              keyExtractor={(item, index) => index.toString()}
              renderItem={renderItem}
              keyboardShouldPersistTaps="handled"
            /> */}
            {loading && (
              <View style={styles.loaderContainer}>
                <ActivityIndicator size="small" color={colors.primary.main} />
                <Text
                  style={{
                    color: colors.text.secondary,
                    marginTop: 8,
                  }}>
                  Searching places...
                </Text>
              </View>
            )}
            {/* <FlatList
              data={filteredPlaces || []}
              keyExtractor={(item, index) => index.toString()}
              renderItem={renderItem}
              keyboardShouldPersistTaps="handled"
            /> */}
            {!loading && (
              <FlatList
                data={filteredPlaces || []}
                keyExtractor={(item, index) => index.toString()}
                renderItem={renderItem}
                keyboardShouldPersistTaps="handled"
              />
            )}
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
  emptyContainer: {
    paddingTop: 40,
    alignItems: 'center',
  },

  emptyText: {
    fontSize: 14,
  },
  loaderContainer: {
    paddingVertical: 20,
    alignItems: 'center',
  },
});

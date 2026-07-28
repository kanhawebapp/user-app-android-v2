// import React, { useState, useCallback, useEffect, useRef } from 'react';
// import { View, Text, ScrollView, StyleSheet } from 'react-native';
// import { useTheme } from '../../theme';
// import { Modal } from '../Modal';
// import { Button } from '../Button';
// import type { Astrologer } from '../../services/api/recomandedAstrologer/astrologer.types';
// import { GenderSelector } from './ChatRequestModal/components/GenderSelector';
// import { NameInput } from './ChatRequestModal/components/NameInput';
// import { HeaderSection } from './ChatRequestModal/components/HeaderSection';
// import { DatePickerInput } from './ChatRequestModal/components/DatePickerInput';
// import { TimePickerInput } from './ChatRequestModal/components/TimePickerInput';
// import { PlaceOfBirthInput } from './ChatRequestModal/components/PlaceOfBirthInput';
// import { useAuthStore } from '../../stores/auth.store';
// import { sendChatRequest } from '../../services/chat/chat.service';
// import { useChatStore } from '../../services/chat/chat.store';
// import { useRecentIntakes } from '../../services/api/recentIntake/recentIntakes.hook';

// export interface ChatRequestData {
//   name: string;
//   gender: 'male' | 'female' | 'other';
//   dateOfBirth: string;
//   placeOfBirth: string;
//   birthTime: string;
// }

// export interface ChatRequestModalProps {
//   visible: boolean;
//   onClose: () => void;
//   onSubmit: (data: ChatRequestData) => void;
//   astrologer?: any;
//   loading?: boolean;
//   type?: 'chat' | 'call';
// }

// type Gender = 'male' | 'female' | 'other';

// export const ChatRequestModal: React.FC<ChatRequestModalProps> = ({
//   // visible,
//   // onClose,
//   // onSubmit,
//   // astrologer,
//   // loading = false,
//   visible,
//   onClose,
//   onSubmit,
//   astrologer,
//   loading = false,
//   type = 'chat',
// }) => {
//   const theme = useTheme();
//   const colors = theme.colors;

//   const [name, setName] = useState('');
//   const [gender, setGender] = useState<Gender | null>(null);
//   const [dateOfBirth, setDateOfBirth] = useState('');
//   const [placeOfBirth, setPlaceOfBirth] = useState('');
//   const [birthTime, setBirthTime] = useState('');
//   const [errors, setErrors] = useState<Record<string, string>>({});
//   const [isLocalLoading, setIsLocalLoading] = useState(false);
//   const requestInProgressRef = useRef(false);
//   const isMounted = useRef(true);
//   const user = useAuthStore(state => state.user);
//   const queueData = useChatStore(state => state.queueData);

//   const isLoading = loading || isLocalLoading;

//   // const {
//   //   intakes,
//   //   // loading,
//   //   refresh,
//   // } = useRecentIntakes();
//   // console.log("intake data",intakes)

//   useEffect(() => {
//     return () => {
//       isMounted.current = false;
//     };
//   }, []);
//   useEffect(() => {
//     // Preload CallScreen bundle as soon as the call-type modal opens.
//     // This warms the React.lazy cache so navigate('Call') hits the JS heap
//     // instantly instead of waiting for a network fetch.
//     if (type === 'call' && visible) {
//       import('../../screens/main/call')
//         .then(() => {
//           // Module loaded; chunk is resident in module cache.
//         })
//         .catch(() => {
//           // Preload is best-effort; if it fails, React.lazy() fallback still works.
//         });
//     }
//   }, [type, visible]);

//   // useEffect(() => {
//   //   if (queueData) {
//   //     queueData.position >= 0 && setIsLocalLoading(false);
//   //   }
//   // });

//   useEffect(() => {
//     if (queueData?.position >= 0) {
//       setIsLocalLoading(false);
//     }
//   }, [queueData]);

//   const resetForm = useCallback(() => {
//     setName('');
//     setGender(null);
//     setDateOfBirth('');
//     setPlaceOfBirth('');
//     setBirthTime('');
//     setErrors({});
//   }, []);

//   const handleClose = useCallback(() => {
//     resetForm();
//     onClose();
//   }, [onClose, resetForm]);

//   const validate = useCallback((): boolean => {
//     const newErrors: Record<string, string> = {};

//     if (!name.trim()) {
//       newErrors.name = 'Name is required';
//     }
//     if (!gender) {
//       newErrors.gender = 'Please select gender';
//     }
//     if (!dateOfBirth.trim()) {
//       newErrors.dateOfBirth = 'Date of birth is required';
//     }
//     if (!placeOfBirth.trim()) {
//       newErrors.placeOfBirth = 'Place of birth is required';
//     }

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   }, [name, gender, dateOfBirth, placeOfBirth]);

//   useEffect(() => {
//     if (queueData?.position >= 1) {
//       handleClose();
//     }
//   }, [queueData, handleClose]);

//   useEffect(() => {
//     if (!visible || !user) {
//       return;
//     }

//     setName(prev => prev || user.name || '');
//     setGender(
//       prev =>
//         prev ||
//         (user.gender && ['male', 'female', 'other'].includes(user.gender)
//           ? (user.gender as Gender)
//           : null),
//     );
//     setDateOfBirth(prev => prev || user.dateOfBirth || '');
//     setPlaceOfBirth(prev => prev || user.birthPlace || user.placeOfBirth || '');
//     setBirthTime(prev => prev || user.birthTime || '');
//   }, [visible, user]);

//   // const handleSubmit = useCallback(async () => {
//   //   if (!validate()) {
//   //     return;
//   //   }
//   //   if (!user || !astrologer?.id) {
//   //     return;
//   //   }
//   //   if (requestInProgressRef.current) {
//   //     return;
//   //   }
//   //   requestInProgressRef.current = true;
//   //   setIsLocalLoading(true);
//   //   try {
//   //     const result = await sendChatRequest({
//   //       astrologerId: astrologer.id,
//   //       consultationType: type,
//   //       userProfile: {
//   //         id: user.id,
//   //         name: user.name,
//   //         mobile: user.mobile || '',
//   //         countryCode: user.countryCode || '',
//   //         profilePic: user.profilePic || '',
//   //         gender: user.gender,
//   //         birthDate: user.dateOfBirth || '',
//   //         birthTime: user.birthTime || '',
//   //         occupation: '',
//   //       },
//   //       name: name.trim(),
//   //       gender: gender as 'male' | 'female' | 'other',
//   //       dateOfBirth,
//   //       placeOfBirth: placeOfBirth.trim(),
//   //       birthTime,
//   //       occupation: '',
//   //     });

//   //     console.log('[ChatRequestModal] Chat request result:', result);

//   //     if (result.success) {
//   //       onSubmit({
//   //         name,
//   //         gender: gender!,
//   //         dateOfBirth,
//   //         placeOfBirth,
//   //         birthTime,
//   //       });
//   //       handleClose();
//   //     } else {
//   //       console.log('[ChatRequestModal] Chat request failed:', result.error);
//   //     }
//   //   } catch (err) {
//   //     console.log('❌ CHAT REQUEST FAILED:', err);
//   //   } finally {
//   //     if (isMounted.current) {
//   //       setIsLocalLoading(false);
//   //     }
//   //     requestInProgressRef.current = false;
//   //   }
//   // }, [
//   //   validate,
//   //   user,
//   //   astrologer,
//   //   name,
//   //   gender,
//   //   dateOfBirth,
//   //   placeOfBirth,
//   //   birthTime,
//   //   onSubmit,
//   //   handleClose,
//   //   type,
//   // ]);


//   const handleSubmit = useCallback(async () => {
//     if (!validate()) {
//       return;
//     }

//     if (requestInProgressRef.current) {
//       return;
//     }

//     requestInProgressRef.current = true;

//     try {
//       onSubmit({
//         name,
//         gender: gender!,
//         dateOfBirth,
//         placeOfBirth,
//         birthTime,
//       });
//     } finally {
//       requestInProgressRef.current = false;
//     }
//   }, [
//     validate,
//     name,
//     gender,
//     dateOfBirth,
//     placeOfBirth,
//     birthTime,
//     onSubmit,
//   ]);


//   return (
//     <Modal
//       visible={visible}
//       onClose={handleClose}
//       showBackdrop={true}
//       dismissOnBackdropPress={false}
//       showCloseButton={false}
//       contentStyle={styles.modalContent}>
//       <HeaderSection
//         astrologer={astrologer}
//         onClose={handleClose}
//         type={type}
//       />

//       <ScrollView
//         style={styles.scrollView}
//         showsVerticalScrollIndicator={false}
//         keyboardShouldPersistTaps="handled">
//         {/* <Text style={[styles.subtitle, {color: colors.text.secondary}]}>
//           Please provide your birth details for accurate readings
//         </Text> */}
//         <Text style={[styles.subtitle, { color: colors.text.secondary }]}>
//           {type === 'call'
//             ? 'Please provide your birth details to start the call consultation'
//             : 'Please provide your birth details for accurate chat readings'}
//         </Text>

//         <NameInput value={name} onChangeText={setName} error={errors.name} />

//         <GenderSelector
//           value={gender}
//           onSelect={setGender}
//           error={errors.gender}
//         />

//         {/* <OccupationInput value={occupation} onChangeText={setOccupation} /> */}

//         <DatePickerInput
//           value={dateOfBirth}
//           onChangeText={setDateOfBirth}
//           error={errors.dateOfBirth}
//         />

//         <PlaceOfBirthInput
//           value={placeOfBirth}
//           onChangeText={setPlaceOfBirth}
//           error={errors.placeOfBirth}
//         />

//         <TimePickerInput value={birthTime} onChangeText={setBirthTime} />
//       </ScrollView>

//       <View style={styles.buttonContainer}>
//         <Button
//           title="Cancel"
//           variant="outline"
//           size="large"
//           onPress={handleClose}
//           style={[styles.cancelButton, { borderColor: colors.border.light }]}
//         />
//         <Button
//           title={
//             isLoading
//               ? 'Sending...'
//               : type === 'call'
//                 ? 'Request Call'
//                 : 'Request Chat'
//           }
//           variant="primary"
//           size="large"
//           onPress={handleSubmit}
//           loading={isLoading}
//           style={styles.submitButton}
//         />
//       </View>
//     </Modal>
//   );
// };

// const styles = StyleSheet.create({
//   modalContent: {
//     maxHeight: '95%',
//     paddingBottom: 16,
//   },
//   scrollView: {
//     maxHeight: 400,
//   },
//   subtitle: {
//     marginBottom: 16,
//     lineHeight: 20,
//   },
//   buttonContainer: {
//     flexDirection: 'row',
//     gap: 12,
//     marginTop: 8,
//   },
//   cancelButton: {
//     flex: 1,
//   },
//   submitButton: {
//     flex: 1.5,
//   },
// });

// export default ChatRequestModal;



import React, { useState, useCallback, useEffect, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  FlatList,
} from 'react-native';

import { useTheme } from '../../theme';
import { Modal } from '../Modal';
import { Button } from '../Button';

import { GenderSelector } from './ChatRequestModal/components/GenderSelector';
import { NameInput } from './ChatRequestModal/components/NameInput';
import { HeaderSection } from './ChatRequestModal/components/HeaderSection';
import { DatePickerInput } from './ChatRequestModal/components/DatePickerInput';
import { TimePickerInput } from './ChatRequestModal/components/TimePickerInput';
import { PlaceOfBirthInput } from './ChatRequestModal/components/PlaceOfBirthInput';

import { useAuthStore } from '../../stores/auth.store';
import { useChatStore } from '../../services/chat/chat.store';
import { useRecentIntakes } from '../../services/api/recentIntake/recentIntakes.hook';

export interface ChatRequestData {
  name: string;
  gender: 'male' | 'female' | 'other';
  dateOfBirth: string;
  placeOfBirth: string;
  birthTime: string;
}

export interface ChatRequestModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (data: ChatRequestData) => void;
  astrologer?: any;
  loading?: boolean;
  type?: 'chat' | 'call';
}

type Gender = 'male' | 'female' | 'other';

export const ChatRequestModal: React.FC<ChatRequestModalProps> = ({
  visible,
  onClose,
  onSubmit,
  astrologer,
  loading = false,
  type = 'chat',
}) => {
  const theme = useTheme();
  const colors = theme.colors;

  const [name, setName] = useState('');
  const [gender, setGender] = useState<Gender | null>(null);
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [placeOfBirth, setPlaceOfBirth] = useState('');
  const [birthTime, setBirthTime] = useState('');

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLocalLoading, setIsLocalLoading] = useState(false);

  // 🔥 NEW
  const [showNewForm, setShowNewForm] = useState(false);

  const requestInProgressRef = useRef(false);
  const isMounted = useRef(true);

  const user = useAuthStore(state => state.user);
  const queueData = useChatStore(state => state.queueData);

  const isLoading = loading || isLocalLoading;

  const { intakes } = useRecentIntakes();

  // console.log('intake data', intakes);

  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  useEffect(() => {
    if (type === 'call' && visible) {
      import('../../screens/main/call')
        .then(() => { })
        .catch(() => { });
    }
  }, [type, visible]);

  useEffect(() => {
    if (queueData?.position >= 0) {
      setIsLocalLoading(false);
    }
  }, [queueData]);

  const resetForm = useCallback(() => {
    setName('');
    setGender(null);
    setDateOfBirth('');
    setPlaceOfBirth('');
    setBirthTime('');
    setErrors({});
    setShowNewForm(false);
  }, []);

  const handleClose = useCallback(() => {
    resetForm();
    onClose();
  }, [onClose, resetForm]);

  const validate = useCallback((): boolean => {
    const newErrors: Record<string, string> = {};

    if (!name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!gender) {
      newErrors.gender = 'Please select gender';
    }

    if (!dateOfBirth.trim()) {
      newErrors.dateOfBirth = 'Date of birth is required';
    }

    if (!placeOfBirth.trim()) {
      newErrors.placeOfBirth = 'Place of birth is required';
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  }, [name, gender, dateOfBirth, placeOfBirth]);

  // useEffect(() => {
  //   if (queueData?.position >= 1) {
  //     handleClose();
  //   }
  // }, [queueData, handleClose]);

  useEffect(() => {
    if (!visible || !user) {
      return;
    }

    setName(prev => prev || user.name || '');

    setGender(
      prev =>
        prev ||
        (user.gender && ['male', 'female', 'other'].includes(user.gender)
          ? (user.gender as Gender)
          : null),
    );

    setDateOfBirth(prev => prev || user.dateOfBirth || '');

    setPlaceOfBirth(
      prev => prev || user.birthPlace || user.placeOfBirth || '',
    );

    setBirthTime(prev => prev || user.birthTime || '');
  }, [visible, user]);

  // ==========================================
  // FORMAT DATE
  // ==========================================

  const formatDate = (timestamp: string) => {
    if (!timestamp) {
      return '';
    }

    try {
      return new Date(Number(timestamp)).toLocaleDateString('en-IN');
    } catch {
      return '';
    }
  };

  // ==========================================
  // RECENT INTAKE SELECT
  // ==========================================

  // const handleRecentIntakeSelect = useCallback(
  //   (item: any) => {
  //     if (requestInProgressRef.current) {
  //       return;
  //     }

  //     requestInProgressRef.current = true;

  //     try {
  //       onSubmit({
  //         name: item.name || '',
  //         gender:
  //           item.gender?.toLowerCase() === 'female'
  //             ? 'female'
  //             : item.gender?.toLowerCase() === 'other'
  //               ? 'other'
  //               : 'male',
  //         dateOfBirth: item.birthDate || '',
  //         placeOfBirth: item.birthPlace || '',
  //         birthTime: item.birthTime || '',
  //       });

  //       handleClose();
  //     } finally {
  //       requestInProgressRef.current = false;
  //     }
  //   },
  //   [onSubmit, handleClose],
  // );

  const handleRecentIntakeSelect = useCallback(
    (item: any) => {
      if (requestInProgressRef.current) {
        return;
      }

      requestInProgressRef.current = true;

      try {
        const formattedDate = item.birthDate
          ? new Date(Number(item.birthDate)).toLocaleDateString('en-GB')
          : '';

        console.log('RECENT INTAKE DATE:', formattedDate);

        onSubmit({
          name: item.name || '',
          gender:
            item.gender?.toLowerCase() === 'female'
              ? 'female'
              : item.gender?.toLowerCase() === 'other'
                ? 'other'
                : 'male',

          // ✅ SAME FORMAT AS WORKING FLOW
          dateOfBirth: formattedDate,

          placeOfBirth: item.birthPlace || '',
          birthTime: item.birthTime || '',
        });

        handleClose();
      } finally {
        requestInProgressRef.current = false;
      }
    },
    [onSubmit, handleClose],
  );

  // ==========================================
  // FORM SUBMIT
  // ==========================================

  const handleSubmit = useCallback(async () => {
    if (!validate()) {
      return;
    }

    if (requestInProgressRef.current) {
      return;
    }

    requestInProgressRef.current = true;

    try {
      onSubmit({
        name,
        gender: gender!,
        dateOfBirth,
        placeOfBirth,
        birthTime,
      });
    } finally {
      onClose()
      requestInProgressRef.current = false;
    }
  }, [
    validate,
    name,
    gender,
    dateOfBirth,
    placeOfBirth,
    birthTime,
    onSubmit,
  ]);

  return (
    <Modal
      visible={visible}
      onClose={handleClose}
      showBackdrop={true}
      dismissOnBackdropPress={false}
      showCloseButton={false}
      contentStyle={styles.modalContent}>
      <HeaderSection
        astrologer={astrologer}
        onClose={handleClose}
        type={type}
      />

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled">
        <Text style={[styles.subtitle, { color: colors.text.secondary }]}>
          {type === 'call'
            ? 'Please provide your birth details to start the call consultation'
            : 'Please provide your birth details for accurate chat readings'}
        </Text>

        {/* ========================================== */}
        {/* RECENT INTAKES */}
        {/* ========================================== */}

        {!showNewForm && intakes.length > 0 && (
          <View style={styles.recentContainer}>
            <View style={styles.recentHeader}>
              <Text
                style={[
                  styles.recentTitle,
                  { color: colors.text.primary },
                ]}>
                Recent Consultations
              </Text>

              <TouchableOpacity onPress={() => setShowNewForm(true)}>
                <Text
                  style={[
                    styles.newButtonText,
                    { color: colors.primary.dark },
                  ]}>
                  + New Details
                </Text>
              </TouchableOpacity>
            </View>

            <FlatList
              data={intakes}
              keyExtractor={item => item.id}
              scrollEnabled={false}
              contentContainerStyle={{ gap: 12 }}
              renderItem={({ item }) => (
                <TouchableOpacity
                  activeOpacity={0.85}
                  onPress={() => handleRecentIntakeSelect(item)}
                  style={[
                    styles.intakeCard,
                    {
                      backgroundColor: colors.background.secondary,
                      borderColor: colors.border.light,
                    },
                  ]}>
                  <View style={styles.intakeTopRow}>
                    <Text
                      numberOfLines={1}
                      style={[
                        styles.intakeName,
                        { color: colors.text.primary },
                      ]}>
                      {item.name}
                    </Text>

                    <View
                      style={[
                        styles.genderBadge,
                        {
                          backgroundColor:
                            item.gender === 'FEMALE'
                              ? '#FFEEF3'
                              : '#EEF4FF',
                        },
                      ]}>
                      <Text style={styles.genderText}>
                        {item.gender}
                      </Text>
                    </View>
                  </View>

                  <Text
                    numberOfLines={1}
                    style={[
                      styles.intakePlace,
                      { color: colors.text.secondary },
                    ]}>
                    {item.birthPlace}
                  </Text>

                  <View style={styles.intakeBottomRow}>
                    <Text
                      style={[
                        styles.intakeMeta,
                        { color: colors.text.secondary },
                      ]}>
                      DOB: {formatDate(item.birthDate)}
                    </Text>

                    <Text
                      style={[
                        styles.intakeMeta,
                        { color: colors.text.secondary },
                      ]}>
                      Time: {item.birthTime}
                    </Text>
                  </View>
                </TouchableOpacity>
              )}
            />
          </View>
        )}

        {/* ========================================== */}
        {/* NEW FORM */}
        {/* ========================================== */}

        {(showNewForm || intakes.length === 0) && (
          <>
            <NameInput
              value={name}
              onChangeText={setName}
              error={errors.name}
            />

            <GenderSelector
              value={gender}
              onSelect={setGender}
              error={errors.gender}
            />

            <DatePickerInput
              value={dateOfBirth}
              onChangeText={setDateOfBirth}
              error={errors.dateOfBirth}
            />

            <PlaceOfBirthInput
              value={placeOfBirth}
              onChangeText={setPlaceOfBirth}
              error={errors.placeOfBirth}
            />

            <TimePickerInput
              value={birthTime}
              onChangeText={setBirthTime}
            />
          </>
        )}
      </ScrollView>

      {(showNewForm || intakes.length === 0) && (
        <View style={styles.buttonContainer}>
          <Button
            title="Cancel"
            variant="outline"
            size="large"
            onPress={handleClose}
            style={[
              styles.cancelButton,
              {
                borderColor: colors.border.light,
              },
            ]}
          />

          <Button
            title={
              isLoading
                ? 'Sending...'
                : type === 'call'
                  ? 'Request Call'
                  : 'Request Chat'
            }
            variant="primary"
            size="large"
            onPress={handleSubmit}
            loading={isLoading}
            style={styles.submitButton}
          />
        </View>
      )}
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContent: {
    maxHeight: '95%',
    paddingBottom: 16,
  },

  scrollView: {
    maxHeight: 400,
  },

  subtitle: {
    marginBottom: 16,
    lineHeight: 20,
  },

  // ==========================================
  // RECENT INTAKES
  // ==========================================

  recentContainer: {
    marginBottom: 20,
  },

  recentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },

  recentTitle: {
    fontSize: 16,
    fontWeight: '700',
  },

  newButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },

  intakeCard: {
    borderWidth: 1,
    borderRadius: 18,
    padding: 14,
  },

  intakeTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },

  intakeName: {
    flex: 1,
    fontSize: 15,
    fontWeight: '700',
    marginRight: 10,
  },

  genderBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },

  genderText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#333',
  },

  intakePlace: {
    fontSize: 13,
    marginBottom: 10,
  },

  intakeBottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  intakeMeta: {
    fontSize: 12,
    fontWeight: '500',
  },

  // ==========================================
  // BUTTONS
  // ==========================================

  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  cancelButton: {
    flex: 1,
  },
  submitButton: {
    flex: 1.5,
  },
});

export default ChatRequestModal;
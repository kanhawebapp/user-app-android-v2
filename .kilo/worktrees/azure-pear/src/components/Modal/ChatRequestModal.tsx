
import React, { useState, useCallback, useEffect, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Animated,
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
import { SkeletonLoader } from '../SkeletonLoader/ShimmerLoader';

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

  const [showNewForm, setShowNewForm] = useState(false);

  const [loadingIntakeId, setLoadingIntakeId] = useState<string | null>(null);
  const cardScaleAnim = useRef(new Animated.Value(1)).current;
  const opacityAnim = useRef(new Animated.Value(1)).current;

  const requestInProgressRef = useRef(false);
  const isMounted = useRef(true);

  const user = useAuthStore(state => state.user);
  const queueData = useChatStore(state => state.queueData);

  const { intakes } = useRecentIntakes();

  const isLoading = loading || isLocalLoading;
  const isIntakeLoading = !!loadingIntakeId;

  const animateCardPress = useCallback(() => {
    Animated.sequence([
      Animated.timing(cardScaleAnim, {
        toValue: 0.96,
        duration: 80,
        useNativeDriver: true,
      }),
      Animated.timing(cardScaleAnim, {
        toValue: 1,
        duration: 120,
        useNativeDriver: true,
      }),
    ]).start();
  }, [cardScaleAnim]);

  const animateCardLoading = useCallback(
    (show: boolean) => {
      Animated.timing(opacityAnim, {
        toValue: show ? 0.7 : 1,
        duration: 150,
        useNativeDriver: true,
      }).start();
    },
    [opacityAnim],
  );

  useEffect(() => {
    if (isIntakeLoading) {
      animateCardLoading(true);
    }
  }, [isIntakeLoading, animateCardLoading]);

  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  useEffect(() => {
    if (!visible && loadingIntakeId) {
      requestInProgressRef.current = false;
      setLoadingIntakeId(null);
      animateCardLoading(false);
    }
  }, [visible, loadingIntakeId, animateCardLoading]);

  useEffect(() => {
    if (type === 'call' && visible) {
      import('../../screens/main/call').then(() => { }).catch(() => { });
    }
  }, [type, visible]);

  const resetForm = useCallback(() => {
    setName('');
    setGender(null);
    setDateOfBirth('');
    setPlaceOfBirth('');
    setBirthTime('');
    setErrors({});
    setShowNewForm(false);
    setLoadingIntakeId(null);
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

  useEffect(() => {
    if (queueData?.position >= 0) {
      setIsLocalLoading(false);
      if (isIntakeLoading && loadingIntakeId) {
        requestInProgressRef.current = false;
        setLoadingIntakeId(null);
        animateCardLoading(false);
        handleClose();
      }
    }
  }, [
    queueData,
    isIntakeLoading,
    loadingIntakeId,
    animateCardLoading,
    handleClose,
  ]);

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

    setPlaceOfBirth(prev => prev || user.birthPlace || user.placeOfBirth || '');

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
      setLoadingIntakeId(item.id);
      animateCardPress();

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

        dateOfBirth: formattedDate,

        placeOfBirth: item.birthPlace || '',
        birthTime: item.birthTime || '',
      });
    },
    [onSubmit, animateCardPress],
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
      // onClose removed from here so the modal body, loader and
      // submit button unmount animation don't race with each other.
      // Modal closes via the queueData useEffect below once the
      // API / socket / navigation pipeline has fully finished.
      requestInProgressRef.current = false;
    }
  }, [validate, name, gender, dateOfBirth, placeOfBirth, birthTime, onSubmit]);

  return (
    <Modal
      visible={visible}
      onClose={isIntakeLoading ? () => { } : handleClose}
      showBackdrop={true}
      dismissOnBackdropPress={!isIntakeLoading}
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
              <Text style={[styles.recentTitle, { color: colors.text.primary }]}>
                Recent Consultations
              </Text>

              <TouchableOpacity onPress={() => setShowNewForm(true)}>
                <Text
                  style={[styles.newButtonText, { color: colors.primary.dark }]}>
                  + New Details
                </Text>
              </TouchableOpacity>
            </View>

            <FlatList
              data={intakes}
              keyExtractor={item => item.id}
              scrollEnabled={false}
              contentContainerStyle={{ gap: 12 }}
              renderItem={({ item }) => {
                const isSelected = loadingIntakeId === item.id;
                const cardScaleStyle = isSelected
                  ? { transform: [{ scale: cardScaleAnim }] }
                  : {};

                return (
                  <Animated.View style={cardScaleStyle}>
                    <TouchableOpacity
                      activeOpacity={0.85}
                      onPress={() => handleRecentIntakeSelect(item)}
                      style={[
                        styles.intakeCard,
                        {
                          backgroundColor: colors.background.secondary,
                          borderColor: isSelected
                            ? colors.primary.main
                            : colors.border.light,
                          opacity: isSelected ? opacityAnim : 1,
                        },
                      ]}>
                      {isSelected ? (
                        <View style={styles.shimmerOverlay}>
                          <View style={styles.shimmerContent}>
                            <SkeletonLoader
                              width="60%"
                              height={18}
                              borderRadius={9}
                              visible={false}
                              style={{ marginBottom: 10 }}
                            />
                            <SkeletonLoader
                              width="40%"
                              height={14}
                              borderRadius={7}
                              visible={false}
                              style={{ marginBottom: 12 }}
                            />
                            <SkeletonLoader
                              width="80%"
                              height={12}
                              borderRadius={6}
                              visible={false}
                              style={{ marginBottom: 8 }}
                            />
                            <SkeletonLoader
                              width="50%"
                              height={12}
                              borderRadius={6}
                              visible={false}
                            />
                          </View>
                          <View style={styles.loadingTextContainer}>
                            <Text
                              style={[
                                styles.loadingText,
                                { color: colors.primary.main },
                              ]}>
                              {type === 'call'
                                ? 'Connecting your call...'
                                : 'Preparing consultation...'}
                            </Text>
                          </View>
                        </View>
                      ) : (
                        <>
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
                        </>
                      )}
                    </TouchableOpacity>
                  </Animated.View>
                );
              }}
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

            <TimePickerInput value={birthTime} onChangeText={setBirthTime} />
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
  // SHIMMER LOADING
  // ==========================================

  shimmerOverlay: {
    borderRadius: 18,
    overflow: 'hidden',
  },

  shimmerContent: {
    padding: 14,
  },

  loadingTextContainer: {
    paddingHorizontal: 14,
    paddingBottom: 14,
    alignItems: 'center',
  },

  loadingText: {
    fontSize: 13,
    fontWeight: '600',
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

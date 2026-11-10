import React, { useEffect, useCallback, useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Image,
} from 'react-native';
import DatePicker from 'react-native-date-picker';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../../theme';
import { Text } from '../../components/Text';
import { Icon } from '../../components/Icon';
import { Button } from '../../components/Button';
import { InputBox } from '../../components/InputBox';
import { Card } from '../../components/Card';
import { useProfile } from '../../services/api/profile/profile.hooks';
import {useUploadProfileImage} from '../../services/api/upload/upload.hook';
import { useToast } from '../../context/ToastContext';
import { GoBack } from '../../components';
import {launchImageLibrary} from 'react-native-image-picker';

// const genderOptions = ['Male', 'Female'];
const genderOptions = [
  { label: 'Male', value: 'MALE' },
  { label: 'Female', value: 'FEMALE' },
];

const formatDate = (d: Date): string => {
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  return `${day}-${month}-${year}`;
};

const formatTime = (d: Date): string => {
  return d.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
};

const PROFILE_IMAGE_MAX_SIZE = 2 * 1024 * 1024; // 2 MB
const PROFILE_IMAGE_ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const PROFILE_IMAGE_ALLOWED_EXTENSION = /\.(jpe?g|png|webp)$/i;

const validateProfileImage = (asset: {
  type?: string;
  fileSize?: number;
  fileName?: string;
}): string | null => {
  const type = (asset.type || '').toLowerCase();
  const fileName = (asset.fileName || '').toLowerCase();

  if (
    !PROFILE_IMAGE_ALLOWED_TYPES.includes(type) &&
    !PROFILE_IMAGE_ALLOWED_EXTENSION.test(fileName)
  ) {
    return 'Please select a JPG, JPEG, PNG, or WEBP image.';
  }

  if (asset.fileSize && asset.fileSize > PROFILE_IMAGE_MAX_SIZE) {
    return 'Image size must be 2 MB or less.';
  }

  return null;
};

const getImageUriWithCacheRefresh = (
  uri: string,
  currentUri?: string | null,
): string => {
  if (currentUri && uri === currentUri) {
    const separator = uri.includes('?') ? '&' : '?';
    return `${uri}${separator}t=${Date.now()}`;
  }
  return uri;
};

const UpdateProfileScreen = ({onNavigateBack, onNavigateToProfile}: any) => {
  const { colors, isDark } = useTheme();
  const insets = useSafeAreaInsets();
  const {profile, loading, updating, refresh, updateProfile} = useProfile();
  const {upload: uploadProfileImage, loading: uploadingProfileImage} =
    useUploadProfileImage();
  const { showSuccess, showError } = useToast();

  const [formData, setFormData] = useState({
    name: '',
    gender: '',
    occupation: '',
  });
  console.log("profile data, yeees", profile);

  const [birthDate, setBirthDate] = useState(new Date());
  const [birthTime, setBirthTime] = useState(new Date());

  const [profileImageUri, setProfileImageUri] = useState<string | null>(null);


  const [openDate, setOpenDate] = useState(false);
  const [openTime, setOpenTime] = useState(false);

  // useEffect(() => {
  //   if (profile) {
  //     setFormData({
  //       name: profile.name || '',
  //       gender: profile.gender || '',
  //       occupation: profile.occupation || '',
  //     });

  //     if (profile.birthDate) {
  //       const d = new Date(profile.birthDate);
  //       if (!isNaN(d.getTime())) {
  //         setBirthDate(d);
  //       }
  //     }
  //   }
  // }, [profile]);

  useEffect(() => {
    if (!profile) {
      return;
    }

    setFormData({
      name: profile.name || '',
      gender: profile.gender || '',
      occupation: profile.occupation || '',
    });

    // Birth Date
    if (profile.birthDate) {
      const date = new Date(Number(profile.birthDate));

      if (!isNaN(date.getTime())) {
        setBirthDate(date);
      }
    }

    // Birth Time
    if (profile.birthTime) {
      const timeString = profile.birthTime.trim();

      // Handles "4:17 AM", "04:17 AM", "4:17 PM", etc.
      const match = timeString.match(/(\d+):(\d+)\s*(AM|PM)/i);

      if (match) {
        let hours = parseInt(match[1], 10);
        const minutes = parseInt(match[2], 10);
        const period = match[3].toUpperCase();

        if (period === 'PM' && hours < 12) {
          hours += 12;
        }

        if (period === 'AM' && hours === 12) {
          hours = 0;
        }

        const time = new Date();
        time.setHours(hours);
        time.setMinutes(minutes);
        time.setSeconds(0);
        time.setMilliseconds(0);

        setBirthTime(time);
      }
    }

    const serverImage = profile.profileImage || profile.profilePic;
    if (serverImage) {
      setProfileImageUri(prev =>
        getImageUriWithCacheRefresh(serverImage, prev),
      );
    }
  }, [profile]);

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleUploadProfileImage = useCallback(async () => {
    if (uploadingProfileImage) {
      return;
    }

    try {
      const res = await launchImageLibrary({
        mediaType: 'photo',
        selectionLimit: 1,
        quality: 0.7,
      });

      if (res.didCancel || !res.assets || res.assets.length === 0) {
        return;
      }

      const asset = res.assets[0];

      const validationError = validateProfileImage(asset);
      if (validationError) {
        showError(validationError);
        return;
      }

      const file = {
        uri: asset.uri!,
        name: asset.fileName || `profile_${Date.now()}.jpg`,
        type: asset.type || 'image/jpeg',
      };

      const result = await uploadProfileImage(file);
      const uploadedUrl = result?.url || result?.user?.profileImage;
      if (uploadedUrl) {
        setProfileImageUri(prev =>
          getImageUriWithCacheRefresh(uploadedUrl, prev),
        );
      }
      showSuccess(result?.message || 'Profile image updated successfully');

      if (uploadedUrl) {
        await refresh();
      }
    } catch (error) {
      const errMessage =
        error instanceof Error
          ? error.message
          : 'Failed to update profile image';
      console.log('PROFILE IMAGE UPLOAD ERROR:', error);
      showError(errMessage);
    }
  }, [
    uploadingProfileImage,
    uploadProfileImage,
    refresh,
    showSuccess,
    showError,
  ]);

  const handleSave = async () => {
    if (!formData.name.trim()) {
      Alert.alert('Error', 'Please enter your name');
      return;
    }

    try {
      await updateProfile({
        name: formData.name,
        gender: formData.gender.toUpperCase(),
        birthDate: birthDate.toISOString(),
        birthTime: formatTime(birthTime),
        occupation: formData.occupation,
      });
      showSuccess('Profile updated successfully');
      onNavigateToProfile?.();
    } catch {
      showError('Failed to update profile');
    }
  };

  console.log("formDataformData", formData)

  if (loading && !profile) {
    return (
      <View
        style={[
          styles.loadingContainer,
          { backgroundColor: colors.background.primary },
        ]}>
        <ActivityIndicator size="large" color={colors.primary.main} />
      </View>
    );
  }

  return (
    <View style={[styles.screen, {backgroundColor: colors.background.secondary}]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />

      <GoBack onBack={onNavigateBack} title="Edit Profile" />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.flex}>
        <ScrollView
          style={styles.flex}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag">
          {/* Profile Avatar Section */}
          <View style={styles.avatarSection}>
            <View style={styles.avatarWrapper}>
              <View
                style={[styles.avatar, {backgroundColor: colors.primary.main}]}>
                {profileImageUri ? (
                  <Image
                    source={{uri: profileImageUri}}
                    style={styles.avatarImage}
                    resizeMode="cover"
                  />
                ) : (
                  <Text
                    style={[
                      styles.avatarText,
                      {color: colors.primary.contrastText},
                    ]}>
                    {formData.name
                      ? formData.name.charAt(0).toUpperCase()
                      : '?'}
                  </Text>
                )}
              </View>
              <TouchableOpacity
                style={[
                  styles.avatarEditIcon,
                  {backgroundColor: colors.primary.main},
                ]}
                onPress={handleUploadProfileImage}
                disabled={uploadingProfileImage}
                hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}>
                {uploadingProfileImage ? (
                  <ActivityIndicator
                    size="small"
                    color={colors.primary.contrastText}
                  />
                ) : (
                  <Icon
                    name="camera-alt"
                    size={14}
                    color={colors.primary.contrastText}
                    library="MaterialIcons"
                  />
                )}
              </TouchableOpacity>
            </View>
            <Text style={[styles.avatarHint, {color: colors.text.tertiary}]}>
              {profile?.countryCode} {profile?.mobile}
            </Text>
          </View>

          {/* Personal Details Card */}
          <Card style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>Personal Details</Text>
            </View>
            <View style={styles.cardDivider} />

            <View style={styles.formContent}>
              {/* Full Name */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Full Name</Text>
                <InputBox
                  value={formData.name}
                  onChangeText={v => handleChange('name', v)}
                  placeholder="Enter your name"
                  containerStyle={styles.inputBoxContainer}
                />
              </View>

              {/* Date of Birth | Time of Birth */}
              <View style={styles.row}>
                <View style={styles.halfField}>
                  <Text style={styles.label}>Date of Birth</Text>
                  <TouchableOpacity
                    style={styles.selectInput}
                    onPress={() => setOpenDate(true)}
                    activeOpacity={0.7}>
                    <Text style={styles.selectText} numberOfLines={1}>
                      {formatDate(birthDate)}
                    </Text>
                  </TouchableOpacity>
                </View>

                <View style={styles.halfField}>
                  <Text style={styles.label}>Time of Birth</Text>
                  <TouchableOpacity
                    style={styles.selectInput}
                    onPress={() => setOpenTime(true)}
                    activeOpacity={0.7}>
                    <Text style={styles.selectText} numberOfLines={1}>
                      {formatTime(birthTime)}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* Gender Selection */}
              <View style={styles.inputGroup}>
                <Text style={[styles.label, {color: colors.text.secondary}]}>
                  Gender
                </Text>
                <View style={styles.genderRow}>
                  {genderOptions.map(item => {
                    const active = formData.gender === item.value;

                    return (
                      <TouchableOpacity
                        key={item.value}
                        style={[
                          styles.genderOption,
                          {
                            borderColor: active
                              ? colors.primary.main
                              : colors.border.light,
                            backgroundColor: active
                              ? colors.primary.main + '15'
                              : 'transparent',
                          },
                        ]}
                        onPress={() => handleChange('gender', item.value)}>
                        <Icon
                          name={item.value === 'MALE' ? 'male' : 'female'}
                          size={18}
                          color={
                            active
                              ? colors.primary.main
                              : colors.text.tertiary
                          }
                          library="Ionicons"
                        />

                        <Text
                          style={[
                            styles.genderText,
                            {
                              color: active
                                ? colors.primary.main
                                : colors.text.primary,
                            },
                          ]}>
                          {item.label}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>

              {/* Occupation */}
              <View style={[styles.inputGroup, styles.inputGroupLast]}>
                <Text style={styles.label}>Occupation</Text>
                <InputBox
                  value={formData.occupation}
                  onChangeText={v => handleChange('occupation', v)}
                  placeholder="Enter your occupation"
                  containerStyle={styles.inputBoxContainer}
                />
              </View>
            </View>
          </Card>
        </ScrollView>

        {/* Save Button */}
        <View
          style={[
            styles.footer,
            {
              paddingBottom: Math.max(insets.bottom, 16),
              backgroundColor: colors.background.secondary,
              borderTopColor: colors.border.light,
            },
          ]}>
          <Button
            title={updating ? 'Saving...' : 'Save Changes'}
            onPress={handleSave}
            loading={updating}
            style={styles.saveButton}
          />
        </View>
      </KeyboardAvoidingView>

      {/* Date Picker */}
      <DatePicker
        modal
        open={openDate}
        date={birthDate}
        mode="date"
        maximumDate={new Date()}
        onConfirm={d => {
          setOpenDate(false);
          setBirthDate(d);
        }}
        onCancel={() => setOpenDate(false)}
        title="Select Date of Birth"
      />

      {/* Time Picker */}
      <DatePicker
        modal
        open={openTime}
        date={birthTime}
        mode="time"
        onConfirm={t => {
          setOpenTime(false);
          setBirthTime(t);
        }}
        onCancel={() => setOpenTime(false)}
        title="Select Time of Birth"
      />
    </View>
  );
};

export default UpdateProfileScreen;

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },

  screen: {
    flex: 1,
  },

  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 24,
    flexGrow: 1,
  },

  avatarSection: {
    alignItems: 'center',
    marginBottom: 20,
  },

  avatarWrapper: {
    position: 'relative',
    alignSelf: 'center',
    marginBottom: 8,
  },

  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: '#FFFFFF',
    overflow: 'hidden',
  },

  avatarImage: {
    width: '100%',
    height: '100%',
    borderRadius: 40,
  },

  avatarEditIcon: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
    zIndex: 10,
    elevation: 4,
  },

  avatarText: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
  },

  avatarHint: {
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 16,
  },

  card: {
    borderRadius: 24,
    overflow: 'hidden',
    padding: 0,
    width: '100%',
    backgroundColor: '#FFFFFF',
  },

  cardHeader: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 20,
    paddingBottom: 14,
    paddingHorizontal: 16,
  },

  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111111',
    textAlign: 'center',
  },

  cardDivider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: '#E6E6E6',
    marginHorizontal: 16,
  },

  formContent: {
    paddingHorizontal: 16,
    paddingTop: 18,
    paddingBottom: 20,
  },

  inputGroup: {
    marginBottom: 16,
    width: '100%',
  },

  inputGroupLast: {
    marginBottom: 0,
  },

  label: {
    fontSize: 13,
    fontWeight: '500',
    color: '#8A8A8A',
    marginBottom: 8,
  },

  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 14,
    width: '100%',
    marginBottom: 16,
  },

  halfField: {
    flex: 1,
    minWidth: 0,
  },

  inputBoxContainer: {
    width: '100%',
    minWidth: 0,
    maxWidth: '100%',
  },

  selectInput: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 44,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    backgroundColor: '#FFFFFF',
    width: '100%',
  },

  selectText: {
    flex: 1,
    fontSize: 14,
    color: '#111111',
    minWidth: 0,
  },

  genderRow: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },

  genderOption: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    gap: 6,
  },

  genderText: {
    fontSize: 14,
    fontWeight: '500',
  },

  footer: {
    paddingHorizontal: 16,
    paddingTop: 12,
    borderTopWidth: StyleSheet.hairlineWidth,
  },

  saveButton: {
    borderRadius: 12,
  },
});

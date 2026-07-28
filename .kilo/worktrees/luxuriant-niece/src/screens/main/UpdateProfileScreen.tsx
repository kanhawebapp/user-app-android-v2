import React, {useEffect, useState} from 'react';
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
} from 'react-native';
import DatePicker from 'react-native-date-picker';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {colors, useTheme} from '../../theme';
import {Text} from '../../components/Text';
import {Icon} from '../../components/Icon';
import {Button} from '../../components/Button';
import {InputBox} from '../../components/InputBox';
import {Card} from '../../components/Card';
import {useProfile} from '../../services/api/profile/profile.hooks';

const genderOptions = ['Male', 'Female'];

const formatDate = (d: Date): string => {
  return d.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
};

const formatTime = (d: Date): string => {
  return d.toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'});
};

const UpdateProfileScreen = ({onNavigateBack}: any) => {
  const {colors, isDark} = useTheme();
  const insets = useSafeAreaInsets();
  const {profile, loading, updating, updateProfile} = useProfile();

  const [formData, setFormData] = useState({
    name: '',
    gender: '',
    occupation: '',
  });

  const [birthDate, setBirthDate] = useState(new Date());
  const [birthTime, setBirthTime] = useState(new Date());

  const [openDate, setOpenDate] = useState(false);
  const [openTime, setOpenTime] = useState(false);

  useEffect(() => {
    if (profile) {
      setFormData({
        name: profile.name || '',
        gender: profile.gender || '',
        occupation: profile.occupation || '',
      });

      if (profile.birthDate) {
        const d = new Date(profile.birthDate);
        if (!isNaN(d.getTime())) {
          setBirthDate(d);
        }
      }
    }
  }, [profile]);

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({...prev, [field]: value}));
  };

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

      Alert.alert('Success', 'Profile updated successfully', [
        {text: 'OK', onPress: onNavigateBack},
      ]);
    } catch {
      Alert.alert('Error', 'Failed to update profile');
    }
  };

  if (loading && !profile) {
    return (
      <View
        style={[
          styles.loadingContainer,
          {backgroundColor: colors.background.primary},
        ]}>
        <ActivityIndicator size="large" color={colors.primary.main} />
      </View>
    );
  }

  return (
    <View style={{flex: 1, backgroundColor: colors.background.primary}}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />

      {/* Premium Header */}
      <View
        style={[
          styles.header,
          {
            paddingTop: insets.top + 8,
            // backgroundColor: colors.primary.main,
          },
        ]}>
        <TouchableOpacity onPress={onNavigateBack} style={styles.headerBack}>
          <Icon name="arrow-back" size={24} color={colors.common.black} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Edit Profile</Text>
        <View style={{width: 40}} />
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{flex: 1}}>
        <ScrollView
          contentContainerStyle={{
            padding: 20,
            paddingBottom: 100,
          }}
          showsVerticalScrollIndicator={false}>
          {/* Profile Avatar Section */}
          <View style={styles.avatarSection}>
            <View
              style={[styles.avatar, {backgroundColor: colors.primary.main}]}>
              <Text
                style={[
                  styles.avatarText,
                  {color: colors.primary.contrastText},
                ]}>
                {formData.name ? formData.name.charAt(0).toUpperCase() : '?'}
              </Text>
            </View>
            <Text style={[styles.avatarHint, {color: colors.text.secondary}]}>
              {profile?.countryCode} {profile?.mobile}
            </Text>
          </View>

          {/* Personal Information Card */}
          <Card style={styles.card}>
            <View style={styles.formContent}>
              {/* Name Input */}
              <View style={styles.inputGroup}>
                <Text style={[styles.label, {color: colors.text.secondary}]}>
                  Full Name
                </Text>
                <InputBox
                  value={formData.name}
                  onChangeText={v => handleChange('name', v)}
                  placeholder="Enter your name"
                />
              </View>

              {/* Gender Selection */}
              <View style={styles.inputGroup}>
                <Text style={[styles.label, {color: colors.text.secondary}]}>
                  Gender
                </Text>
                <View style={styles.genderRow}>
                  {genderOptions.map(g => {
                    const active = formData.gender === g;
                    return (
                      <TouchableOpacity
                        key={g}
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
                        onPress={() => handleChange('gender', g)}>
                        <Icon
                          name={
                            g === 'Male'
                              ? 'male'
                              : g === 'Female'
                              ? 'female'
                              : 'person-outline'
                          }
                          size={18}
                          color={
                            active ? colors.primary.main : colors.text.tertiary
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
                          {g}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>
              <View style={styles.datetimeCont}>
                {/* Birth Date */}
                <View style={styles.inputGroupw}>
                  <Text style={[styles.label, {color: colors.text.secondary}]}>
                    Birth Date
                  </Text>
                  <TouchableOpacity
                    style={[
                      styles.dateInput,
                      {backgroundColor: colors.background.secondary},
                    ]}
                    onPress={() => setOpenDate(true)}>
                    <Icon
                      name="calendar-today"
                      size={18}
                      color={colors.primary.main}
                      library="MaterialIcons"
                    />
                    <Text
                      style={[styles.dateText, {color: colors.text.primary}]}>
                      {formatDate(birthDate)}
                    </Text>
                    <Icon
                      name="expand-more"
                      size={20}
                      color={colors.icon.tertiary}
                      library="MaterialIcons"
                    />
                  </TouchableOpacity>
                </View>

                {/* Birth Time */}
                <View style={styles.inputGroupw}>
                  <Text style={[styles.label, {color: colors.text.secondary}]}>
                    Birth Time
                  </Text>
                  <TouchableOpacity
                    style={[
                      styles.dateInput,
                      {backgroundColor: colors.background.secondary},
                    ]}
                    onPress={() => setOpenTime(true)}>
                    <Icon
                      name="schedule"
                      size={18}
                      color={colors.secondary.main}
                      library="MaterialIcons"
                    />
                    <Text
                      style={[styles.dateText, {color: colors.text.primary}]}>
                      {formatTime(birthTime)}
                    </Text>
                    <Icon
                      name="expand-more"
                      size={20}
                      color={colors.icon.tertiary}
                      library="MaterialIcons"
                    />
                  </TouchableOpacity>
                </View>
              </View>

              {/* Occupation */}
              <View style={styles.inputGroup}>
                <Text style={[styles.label, {color: colors.text.secondary}]}>
                  Occupation
                </Text>
                <InputBox
                  value={formData.occupation}
                  onChangeText={v => handleChange('occupation', v)}
                  placeholder="Enter your occupation"
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
              paddingBottom: insets.bottom + 16,
              backgroundColor: colors.background.primary,
            },
          ]}>
          <View style={styles.footerShadow}>
            <Button
              title={updating ? 'Saving...' : 'Save Changes'}
              onPress={handleSave}
              loading={updating}
              style={styles.saveButton}
            />
          </View>
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 16,
  },

  headerBack: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
  },

  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.common.black,
  },

  avatarSection: {
    alignItems: 'center',
    marginBottom: 24,
  },

  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: '#fff',
    marginBottom: 8,
  },

  avatarText: {
    fontSize: 22,
    fontWeight: 'bold',
  },

  avatarHint: {
    fontSize: 12,
  },

  card: {
    borderRadius: 16,
    overflow: 'hidden',
  },

  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },

  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 10,
  },

  formContent: {
    padding: 16,
  },

  inputGroup: {
    marginBottom: 20,
    width: '100%',
  },

  label: {
    fontSize: 13,
    fontWeight: '500',
    marginBottom: 8,
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

  dateInput: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 12,
    gap: 10,
    // width: '50%',
  },

  dateText: {
    flex: 1,
    fontSize: 15,
  },

  footer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: 20,
    paddingTop: 16,
  },

  footerShadow: {
    backgroundColor: '#fff',
    paddingTop: 16,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: 'rgba(0,0,0,0.1)',
  },

  saveButton: {
    borderRadius: 12,
  },
  datetimeCont: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  inputGroupw: {
    width: '45%',
  },
});

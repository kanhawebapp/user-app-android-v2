import React, {useState} from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Switch,
  Alert,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useTheme} from '../../theme';
import {Text} from '../../components/Text';
import {Icon} from '../../components/Icon';
import {Card} from '../../components/Card';
import {useAppStore, useAuthStore} from '../../stores';
import {GoBack} from '../../components';
import PrivacyPolicyScreen from '../../screens/legal/PrivacyPolicyScreen';
import {softDeleteUser} from '../../services/api/deleteAccount/delete-account.api';
import {useToast} from '../../context/ToastContext';

interface SettingsScreenProps {
  onNavigateBack?: () => void;
}

const SettingsScreen: React.FC<SettingsScreenProps> = ({onNavigateBack}) => {
  const theme = useTheme();
  const colors = theme.colors;
  const insets = useSafeAreaInsets();

  const {isDarkMode, toggleTheme, language, setLanguage} = useAppStore();
  const authState = useAuthStore();
  const {showSuccess, showError} = useToast();

  const [notifications, setNotifications] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [vibration, setVibration] = useState(true);
  const [showPrivacyPolicy, setShowPrivacyPolicy] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete Account',
      'Are you sure you want to delete your account? This action cannot be undone.',
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            setIsDeleting(true);
            try {
              const result = await softDeleteUser();

              if (result.success) {
                showSuccess(result.message || 'Account deleted successfully');
                authState.logout();
                useAppStore.getState().setIsLoggedIn(false);
              } else {
                showError(
                  result.message ||
                    'Failed to delete account. Please try again.',
                );
              }
            } catch (error: any) {
              const message =
                error?.response?.data?.errors?.[0]?.message ||
                error?.message ||
                'Something went wrong. Please try again.';
              showError(message);
            } finally {
              setIsDeleting(false);
            }
          },
        },
      ],
    );
  };

  const openPrivacyPolicy = () => {
    setShowPrivacyPolicy(true);
  };

  const closePrivacyPolicy = () => {
    setShowPrivacyPolicy(false);
  };

  const settingSections = [
    {
      // title: 'Account',
      items: [
        // {
        //   key: 'profile',
        //   label: 'Edit Profile',
        //   icon: 'person',
        //   iconLibrary: 'MaterialIcons' as const,
        //   type: 'navigation',
        // },
        // {
        //   key: 'privacy',
        //   label: 'Privacy Settings',
        //   icon: 'lock',
        //   iconLibrary: 'MaterialIcons' as const,
        //   type: 'navigation',
        // },
        // {
        //   key: 'security',
        //   label: 'Security',
        //   icon: 'security',
        //   iconLibrary: 'MaterialIcons' as const,
        //   type: 'navigation',
        // },
      ],
    },
    {
      title: 'Preferences',
      items: [
        // {
        //   key: 'language',
        //   label: 'Language',
        //   icon: 'language',
        //   iconLibrary: 'MaterialIcons' as const,
        //   type: 'navigation',
        //   value: 'English',
        // },
        {
          key: 'notifications',
          label: 'Notifications',
          icon: 'notifications',
          iconLibrary: 'MaterialIcons' as const,
          type: 'switch' as const,
          value: notifications,
          onToggle: () => setNotifications(!notifications),
        },
        // {
        //   key: 'dark_mode',
        //   label: 'Dark Mode',
        //   icon: 'dark-mode',
        //   iconLibrary: 'MaterialIcons' as const,
        //   type: 'switch' as const,
        //   value: isDarkMode,
        //   onToggle: toggleTheme,
        // },
      ],
    },
    // {
    //   title: 'Sound & Haptics',
    //   items: [
    //     {
    //       key: 'sound',
    //       label: 'Sound Effects',
    //       icon: 'volume-up',
    //       iconLibrary: 'MaterialIcons' as const,
    //       type: 'switch' as const,
    //       value: soundEnabled,
    //       onToggle: () => setSoundEnabled(!soundEnabled),
    //     },
    //     {
    //       key: 'vibration',
    //       label: 'Vibration',
    //       icon: 'vibration',
    //       iconLibrary: 'MaterialIcons' as const,
    //       type: 'switch' as const,
    //       value: vibration,
    //       onToggle: () => setVibration(!vibration),
    //     },
    //   ],
    // },
    {
      title: 'App',
      items: [
        // {
        //   key: 'clear_cache',
        //   label: 'Clear Cache',
        //   icon: 'delete-sweep',
        //   iconLibrary: 'MaterialIcons' as const,
        //   type: 'navigation',
        // },
        {
          key: 'version',
          label: 'App Version',
          icon: 'info',
          iconLibrary: 'MaterialIcons' as const,
          type: 'navigation',
          value: '1.0.0',
        },
      ],
    },
  ];

  if (showPrivacyPolicy) {
    return (
      <View
        style={[
          styles.container,
          {backgroundColor: colors.background.primary},
        ]}>
        <PrivacyPolicyScreen onBack={closePrivacyPolicy} />
      </View>
    );
  }

  return (
    <View
      style={[styles.container, {backgroundColor: colors.background.primary}]}>
      <StatusBar
        barStyle={theme.isDark ? 'light-content' : 'dark-content'}
        backgroundColor={colors.background.primary}
      />

      {/* Header */}
      {/* <View
        style={[
          styles.header,
          {backgroundColor: colors.background.primary, paddingTop: insets.top},
        ]}>
        <TouchableOpacity onPress={onNavigateBack} style={styles.backButton}>
          <Icon
            name="arrow-back"
            size={24}
            color={colors.icon.primary}
            library="MaterialIcons"
          />
        </TouchableOpacity>
        <Text
          variant="h6"
          weight="semibold"
          style={{color: colors.text.primary}}>
          Settings
        </Text>
        <View style={styles.placeholder} />
      </View> */}

      <GoBack onBack={onNavigateBack} title="Settings" />

      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          {paddingBottom: insets.bottom + 100},
        ]}
        showsVerticalScrollIndicator={false}>
        {settingSections.map((section, sectionIndex) => (
          <View key={section.title} style={styles.section}>
            <Text
              variant="caption"
              weight="semibold"
              style={[styles.sectionTitle, {color: colors.text.secondary}]}>
              {section.title}
            </Text>
            <Card style={styles.sectionCard}>
              {section.items.map((item, itemIndex) => (
                <TouchableOpacity
                  key={item.key}
                  style={[
                    styles.settingItem,
                    itemIndex < section.items.length - 1 && {
                      borderBottomWidth: StyleSheet.hairlineWidth,
                      borderBottomColor: colors.border.light,
                    },
                  ]}
                  onPress={() => {}}
                  activeOpacity={0.7}
                  disabled={item.type === 'switch'}>
                  <Icon
                    name={item.icon}
                    size={22}
                    color={colors.icon.primary}
                    library={item.iconLibrary}
                  />
                  <Text
                    variant="body"
                    style={[styles.settingLabel, {color: colors.text.primary}]}>
                    {item.label}
                  </Text>
                  {item.type === 'switch' ? (
                    <Switch
                      value={item.value as boolean}
                      // onValueChange={item.onToggle}
                      trackColor={{
                        false: colors.border.light,
                        true: colors.primary.light,
                      }}
                      thumbColor={
                        item.value
                          ? colors.primary.main
                          : colors.background.secondary
                      }
                    />
                  ) : (
                    <View style={styles.settingValue}>
                      {item.value && (
                        <Text
                          variant="body"
                          style={{color: colors.text.secondary}}>
                          {item.value}
                        </Text>
                      )}
                      <Icon
                        name="chevron-right"
                        size={22}
                        color={colors.icon.tertiary}
                        library="MaterialIcons"
                      />
                    </View>
                  )}
                </TouchableOpacity>
              ))}
            </Card>
          </View>
        ))}

        {/* Legal Links */}
        <View style={styles.section}>
          <Text
            variant="caption"
            weight="semibold"
            style={[styles.sectionTitle, {color: colors.text.secondary}]}>
            Legal
          </Text>
          <Card style={styles.sectionCard}>
            {/* <TouchableOpacity style={styles.settingItem} onPress={() => {}}>
              <Icon
                name="description"
                size={22}
                color={colors.icon.primary}
                library="MaterialIcons"
              />
              <Text
                variant="body"
                style={[styles.settingLabel, {color: colors.text.primary}]}>
                Terms of Service
              </Text>
              <Icon
                name="chevron-right"
                size={22}
                color={colors.icon.tertiary}
                library="MaterialIcons"
              />
            </TouchableOpacity> */}
            <TouchableOpacity
              style={[
                styles.settingItem,
                {
                  borderTopWidth: StyleSheet.hairlineWidth,
                  borderTopColor: colors.border.light,
                },
              ]}
              onPress={openPrivacyPolicy}>
              <Icon
                name="privacy-tip"
                size={22}
                color={colors.icon.primary}
                library="MaterialIcons"
              />
              <Text
                variant="body"
                style={[styles.settingLabel, {color: colors.text.primary}]}>
                Privacy Policy
              </Text>
              <Icon
                name="chevron-right"
                size={22}
                color={colors.icon.tertiary}
                library="MaterialIcons"
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.settingItem,
                {
                  borderTopWidth: StyleSheet.hairlineWidth,
                  borderTopColor: colors.border.light,
                },
              ]}
              onPress={handleDeleteAccount}
              disabled={isDeleting}>
              <Icon
                name="gavel"
                size={22}
                color={colors.icon.primary}
                library="MaterialIcons"
              />
              <Text
                variant="body"
                style={[styles.settingLabel, {color: colors.text.primary}]}>
                Delete Account
              </Text>
              <Icon
                name="chevron-right"
                size={22}
                color={colors.icon.tertiary}
                library="MaterialIcons"
              />
            </TouchableOpacity>
          </Card>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    marginBottom: 8,
    marginLeft: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  sectionCard: {
    padding: 0,
    overflow: 'hidden',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  settingLabel: {
    flex: 1,
    marginLeft: 16,
  },
  settingValue: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    marginTop: 8,
  },
});

export default SettingsScreen;

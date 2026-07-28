// import React from 'react';
// import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
// import {useTheme} from '../../../../theme';
// import {Icon} from '../../../../components/Icon';
// import {ChatRequestData} from '../../../../components/Modal/ChatRequestModal';

// interface UserInfoBarProps {
//   userData: ChatRequestData;
//   isExpanded: boolean;
//   onToggle: () => void;
// }

// export const UserInfoBar: React.FC<UserInfoBarProps> = ({
//   userData,
//   isExpanded,
//   onToggle,
// }) => {
//   const theme = useTheme();
//   const colors = theme.colors;

//   const formatGender = (g?: string) =>
//     g ? g.charAt(0).toUpperCase() + g.slice(1).toLowerCase() : '-';

//   return (
//     <>
//       <TouchableOpacity
//         style={[
//           styles.userInfoToggle,
//           {backgroundColor: colors.background.secondary},
//         ]}
//         onPress={onToggle}
//         activeOpacity={0.8}>
//         <View style={styles.userInfoToggleContent}>
//           <Icon name="person" size={16} color={colors.text.secondary} />
//           <Text style={[styles.userInfoLabel, {color: colors.text.secondary}]}>
//             User Details
//           </Text>
//           <Icon
//             name={isExpanded ? 'expand-less' : 'expand-more'}
//             size={20}
//             color={colors.text.tertiary}
//           />
//         </View>
//       </TouchableOpacity>

//       {isExpanded && (
//         <View
//           style={[
//             styles.userInfoBar,
//             {backgroundColor: colors.background.secondary},
//           ]}>
//           <View style={styles.userInfoRow}>
//             <Icon
//               name="person-outline"
//               size={14}
//               color={colors.text.tertiary}
//             />
//             <Text style={[styles.userInfoText, {color: colors.text.primary}]}>
//               {userData.name}
//             </Text>
//           </View>
//           <View style={styles.userInfoRow}>
//             <Icon name="cake" size={14} color={colors.text.tertiary} />
//             <Text style={[styles.userInfoText, {color: colors.text.primary}]}>
//               {userData.dateOfBirth}
//             </Text>
//           </View>
//           <View style={styles.userInfoRow}>
//             <Icon name="place" size={14} color={colors.text.tertiary} />
//             <Text style={[styles.userInfoText, {color: colors.text.primary}]}>
//               {userData.placeOfBirth}
//             </Text>
//           </View>
//         </View>
//       )}
//     </>
//   );
// };

// const styles = StyleSheet.create({
//   userInfoToggle: {
//     paddingHorizontal: 16,
//     paddingVertical: 8,
//   },
//   userInfoToggleContent: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   userInfoLabel: {
//     fontSize: 13,
//     fontWeight: '500',
//     marginLeft: 8,
//     flex: 1,
//   },
//   userInfoBar: {
//     paddingHorizontal: 16,
//     paddingBottom: 8,
//   },
//   userInfoRow: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     paddingVertical: 3,
//   },
//   userInfoText: {
//     fontSize: 13,
//     marginLeft: 8,
//   },
// });

import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import {useTheme} from '../../../../theme';
import {Icon} from '../../../../components/Icon';
import {ChatRequestData} from '../../../../components/Modal/ChatRequestModal';

interface UserInfoBarProps {
  userData: ChatRequestData;
  isExpanded: boolean;
  onToggle: () => void;
}

export const UserInfoBar: React.FC<UserInfoBarProps> = ({
  userData,
  isExpanded,
  onToggle,
}) => {
  const theme = useTheme();
  const colors = theme.colors;

  const formatGender = (g?: string) =>
    g ? g.charAt(0).toUpperCase() + g.slice(1).toLowerCase() : '-';

  const InfoItem = ({
    icon,
    label,
    value,
  }: {
    icon: string;
    label: string;
    value?: string;
  }) => (
    <View style={styles.infoItem}>
      <View
        style={[styles.iconWrapper, {backgroundColor: colors.primary + '15'}]}>
        <Icon name={icon} size={14} color={colors.primary} />
      </View>

      <View style={styles.infoTextWrapper}>
        <Text style={[styles.label, {color: colors.text.tertiary}]}>
          {label}
        </Text>
        <Text style={[styles.value, {color: colors.text.primary}]}>
          {value || '-'}
        </Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* 🔹 Header Toggle */}
      <TouchableOpacity
        style={[
          styles.toggle,
          {
            backgroundColor: colors.background.secondary,
            borderColor: isExpanded ? colors.primary : 'transparent',
          },
        ]}
        onPress={onToggle}
        activeOpacity={0.85}>
        <View style={styles.toggleContent}>
          <View
            style={[
              styles.headerIcon,
              {backgroundColor: colors.primary + '20'},
            ]}>
            <Icon name="person" size={16} color={colors.primary} />
          </View>

          <Text style={[styles.title, {color: colors.text.primary}]}>
            User Details
          </Text>

          <Icon
            name={isExpanded ? 'keyboard-arrow-up' : 'keyboard-arrow-down'}
            size={22}
            color={colors.text.secondary}
          />
        </View>
      </TouchableOpacity>

      {/* 🔹 Expanded Card */}
      {isExpanded && (
        <View
          style={[
            styles.card,
            {
              backgroundColor: colors.background.secondary,
              borderColor: colors.border,
            },
          ]}>
          <InfoItem icon="person-outline" label="Name" value={userData.name} />
          <InfoItem
            icon="cake"
            label="Date of Birth"
            value={userData.dateOfBirth}
          />
          <InfoItem
            icon="schedule"
            label="Birth Time"
            value={userData.birthTime}
          />
          <InfoItem
            icon="wc"
            label="Gender"
            value={formatGender(userData.gender)}
          />
          <InfoItem
            icon="place"
            label="Place of Birth"
            value={userData.placeOfBirth}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 12,
    marginTop: 6,
    marginBottom: 12,
  },

  toggle: {
    borderRadius: 14,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderWidth: 1,
  },

  toggleContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  headerIcon: {
    height: 28,
    width: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },

  title: {
    fontSize: 14,
    fontWeight: '600',
    flex: 1,
  },

  card: {
    marginTop: 8,
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,

    // Shadow (premium feel)
    elevation: 3,
  },

  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },

  iconWrapper: {
    height: 32,
    width: 32,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },

  infoTextWrapper: {
    flex: 1,
  },

  label: {
    fontSize: 11,
    marginBottom: 2,
  },

  value: {
    fontSize: 14,
    fontWeight: '600',
  },
});

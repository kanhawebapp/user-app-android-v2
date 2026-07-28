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

  return (
    <>
      <TouchableOpacity
        style={[
          styles.userInfoToggle,
          {backgroundColor: colors.background.secondary},
        ]}
        onPress={onToggle}
        activeOpacity={0.8}>
        <View style={styles.userInfoToggleContent}>
          <Icon name="person" size={16} color={colors.text.secondary} />
          <Text style={[styles.userInfoLabel, {color: colors.text.secondary}]}>
            User Details
          </Text>
          <Icon
            name={isExpanded ? 'expand-less' : 'expand-more'}
            size={20}
            color={colors.text.tertiary}
          />
        </View>
      </TouchableOpacity>

      {isExpanded && (
        <View
          style={[
            styles.userInfoBar,
            {backgroundColor: colors.background.secondary},
          ]}>
          <View style={styles.userInfoRow}>
            <Icon
              name="person-outline"
              size={14}
              color={colors.text.tertiary}
            />
            <Text style={[styles.userInfoText, {color: colors.text.primary}]}>
              {userData.name}
            </Text>
          </View>
          <View style={styles.userInfoRow}>
            <Icon name="cake" size={14} color={colors.text.tertiary} />
            <Text style={[styles.userInfoText, {color: colors.text.primary}]}>
              {userData.dateOfBirth}
            </Text>
          </View>
          <View style={styles.userInfoRow}>
            <Icon name="place" size={14} color={colors.text.tertiary} />
            <Text style={[styles.userInfoText, {color: colors.text.primary}]}>
              {userData.placeOfBirth}
            </Text>
          </View>
        </View>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  userInfoToggle: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  userInfoToggleContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userInfoLabel: {
    fontSize: 13,
    fontWeight: '500',
    marginLeft: 8,
    flex: 1,
  },
  userInfoBar: {
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  userInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 3,
  },
  userInfoText: {
    fontSize: 13,
    marginLeft: 8,
  },
});

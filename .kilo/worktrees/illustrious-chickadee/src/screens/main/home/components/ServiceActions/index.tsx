
import React from 'react';
import { View, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { useTheme } from '../../../../../theme';
import { Text } from '../../../../../components/Text';
import { Icon } from '../../../../../components/Icon';
import { Card } from '../../../../../components/Card';

const { width } = Dimensions.get('window');

interface ServiceActionsProps {
  onChatPress?: () => void;
  onCallPress?: () => void;
  onLiveHealingsPress?: () => void;
  style?: any;
}

export const ServiceActions: React.FC<any> = ({
  onChatPress,
  onCallPress,
  onLiveHealingsPress,
  style,
}) => {
  const theme = useTheme();
  const colors = theme.colors;

  const services = [
    {
      label: 'Call',
      icon: 'call',
      color: colors.secondary.main,
      bgColor: colors.secondary.light + '20',
      onPress: onCallPress,
    },
    {
      label: 'Chat',
      icon: 'chat',
      color: colors.primary.main,
      bgColor: colors.primary.light + '20',
      onPress: onChatPress,
    },
    {
      label: 'Live Healings',
      icon: 'self-improvement',
      color: '#F44336',
      bgColor: '#F4433620',
      onPress: onLiveHealingsPress,
    },
  ];

  return (
    <View style={[styles.container, style]}>
      {services.map((service, index) => (
        <Card
          key={index}
          style={styles.card}
          onPress={service.onPress}
        >
          <View style={[styles.iconContainer, { backgroundColor: service.bgColor }]}>
            <Icon
              name={service.icon}
              library="MaterialIcons"
              size={28}
              color={service.color}
            />
          </View>
          <Text variant="label" weight="semibold" style={styles.label}>
            {service.label}
          </Text>
        </Card>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  card: {
    width: (width - 50) / 3.5,
    alignItems: 'center',
    padding: 12,
    borderRadius: 16,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  label: {
    textAlign: 'center',
  },
});

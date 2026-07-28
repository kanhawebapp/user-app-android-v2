import React from 'react';
import {View, StyleSheet} from 'react-native';
import {useTheme} from '../../../../theme';
import {Text} from '../../../../components/Text';
import {Icon} from '../../../../components/Icon';

export const EmptyState: React.FC = () => {
  const {colors} = useTheme();

  return (
    <View style={styles.emptyContainer}>
      <View
        style={[
          styles.emptyIconBox,
          {backgroundColor: colors.primary.light + '15'},
        ]}>
        <Icon name="forum" size={56} color={colors.primary.light} />
      </View>
      <Text
        variant="h6"
        weight="bold"
        style={{color: colors.text.primary, marginTop: 20}}>
        No Chat History Yet
      </Text>
      <Text
        variant="bodySmall"
        style={{
          color: colors.text.secondary,
          marginTop: 8,
          textAlign: 'center',
          lineHeight: 22,
        }}>
        Your chat sessions with astrologers will appear here
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 80,
    paddingHorizontal: 32,
  },
  emptyIconBox: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default EmptyState;

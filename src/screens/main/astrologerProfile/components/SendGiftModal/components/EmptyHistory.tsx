import React from 'react';
import {View, StyleSheet, ViewStyle, TextStyle} from 'react-native';
import { Icon, Text, useTheme } from '../../../../../../components';


interface EmptyHistoryProps {
  message?: string;
  subMessage?: string;
}

export const EmptyHistory: React.FC<EmptyHistoryProps> = ({
  message = 'No gifts sent yet',
  subMessage = 'Your gift history will appear here',
}) => {
  const theme = useTheme();
  const colors = theme.colors;

  return (
    <View style={styles.emptyHistory}>
      <Icon
        name="history"
        size={48}
        color={colors.text.tertiary}
        library="MaterialIcons"
      />
      <Text
        variant="body"
        weight="medium"
        color={colors.text.secondary}
        style={styles.emptyHistoryText}>
        {message}
      </Text>
      <Text
        variant="captionSmall"
        color={colors.text.tertiary}
        style={styles.emptyHistorySubtext}>
        {subMessage}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  emptyHistory: {
    alignItems: 'center',
    paddingVertical: 40,
    paddingHorizontal: 16,
  } as ViewStyle,
  emptyHistoryText: {
    marginTop: 12,
    marginBottom: 4,
    textAlign: 'center',
  } as TextStyle,
  emptyHistorySubtext: {
    textAlign: 'center',
    opacity: 0.7,
  } as TextStyle,
});
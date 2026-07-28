import React from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  TextStyle,
  ViewStyle,
} from 'react-native';
import { Text, useTheme } from '../../../../../../components';

interface MessageSectionProps {
  message: string;
  onChangeMessage: (text: string) => void;
  maxLength?: number;
}

export const MessageSection: React.FC<MessageSectionProps> = ({
  message,
  onChangeMessage,
  maxLength = 200,
}) => {
  const theme = useTheme();
  const colors = theme.colors;

  const remainingChars = maxLength - message.length;

  return (
    <View style={styles.messageSection}>
      <Text
        variant="bodySmall"
        weight="medium"
        color={colors.text.secondary}
        style={styles.sectionTitle}>
        Add a message (optional)
      </Text>
      <TextInput
        style={[
          styles.messageInput,
          {
            backgroundColor: colors.card.background,
            borderColor: colors.border.light,
            color: colors.text.primary,
          },
        ]}
        placeholder="Write your message here..."
        placeholderTextColor={colors.text.tertiary}
        value={message}
        onChangeText={onChangeMessage}
        multiline
        numberOfLines={3}
        maxLength={maxLength}
        textAlignVertical="top"
      />
      <Text
        variant="captionSmall"
        color={colors.text.tertiary}
        style={styles.characterCount}>
        {remainingChars} characters remaining
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  messageSection: {
    marginHorizontal: 16,
    marginBottom: 20,
  } as ViewStyle,
  sectionTitle: {
    marginBottom: 12,
  } as TextStyle,
  messageInput: {
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    fontSize: 14,
    minHeight: 80,
  } as TextStyle,
  characterCount: {
    textAlign: 'right',
    marginTop: 4,
  } as TextStyle,
});
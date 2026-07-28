import React from 'react';
import {View, TextInput, TouchableOpacity, StyleSheet} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useTheme} from '../../../../theme';
import {Icon} from '../../../../components/Icon';

interface ChatInputProps {
  inputText: string;
  onInputChange: (text: string) => void;
  onSend: () => void;
  onAddMedia?: () => void;
}

export const ChatInput: React.FC<ChatInputProps> = ({
  inputText,
  onInputChange,
  onSend,
  onAddMedia,
}) => {
  const theme = useTheme();
  const colors = theme.colors;
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.inputContainer, {paddingBottom: insets.bottom + 8}]}>
      <View
        style={[
          styles.inputWrapper,
          {
            backgroundColor: colors.card.background,
            borderColor: colors.border.light,
          },
        ]}>
        <TouchableOpacity style={styles.inputActionButton} onPress={onAddMedia}>
          <Icon
            name="add-circle-outline"
            size={24}
            color={colors.primary.main}
          />
        </TouchableOpacity>
        <TextInput
          style={[styles.input, {color: colors.text.primary}]}
          placeholder="Ask your question..."
          placeholderTextColor={colors.text.tertiary}
          value={inputText}
          onChangeText={onInputChange}
          multiline
          maxLength={500}
        />
        <TouchableOpacity style={styles.inputActionButton}>
          <Icon name="mic" size={24} color={colors.text.tertiary} />
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.sendButton,
            {
              backgroundColor: inputText.trim()
                ? colors.primary.main
                : colors.common.gray[200],
            },
          ]}
          onPress={onSend}
          disabled={!inputText.trim()}>
          <Icon
            name="send"
            size={20}
            color={
              inputText.trim()
                ? colors.primary.contrastText
                : colors.common.gray[500]
            }
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    borderRadius: 24,
    borderWidth: 1,
    paddingHorizontal: 8,
    paddingVertical: 6,
  },
  inputActionButton: {
    padding: 6,
  },
  input: {
    flex: 1,
    fontSize: 15,
    maxHeight: 100,
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 4,
  },
});

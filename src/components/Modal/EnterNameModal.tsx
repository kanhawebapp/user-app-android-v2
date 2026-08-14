import React, {useEffect, useState} from 'react';
import {View, TextInput, StyleSheet} from 'react-native';
import {useTheme} from '../../theme';
import {Modal} from './Modal';
import {Button} from '../Button';
import {Text} from '../Text';
import {EnterNameModalProps} from './modalType';

export const EnterNameModal: React.FC<EnterNameModalProps> = ({
  visible,
  submitting = false,
  error,
  onSubmit,
}) => {
  const theme = useTheme();
  const colors = theme.colors;

  const [name, setName] = useState('');
  const [localError, setLocalError] = useState<string | null>(null);

  useEffect(() => {
    if (visible) {
      setName('');
      setLocalError(null);
    }
  }, [visible]);

  const trimmedName = name.trim();

  const handleSubmit = () => {
    if (!trimmedName) {
      setLocalError('Please enter your name');
      return;
    }
    setLocalError(null);
    onSubmit(trimmedName);
  };

  const displayError = localError || error || null;

  return (
    <Modal
      visible={visible}
      onClose={() => {}}
      showBackdrop={true}
      dismissOnBackdropPress={false}
      showCloseButton={false}
      style={styles.centeredModal}
      contentStyle={styles.modalContent}>
      <View style={styles.container}>
        <Text variant="h6" weight="bold" align="center">
          Enter Name
        </Text>

        <Text
          variant="body"
          align="center"
          color={colors.text.secondary}
          style={styles.subtitle}>
          Please enter your name
        </Text>

        <TextInput
          style={[
            styles.input,
            {
              backgroundColor: colors.background.secondary,
              color: colors.text.primary,
              borderColor: displayError
                ? colors.error.main
                : colors.border.light,
            },
          ]}
          placeholder="Enter your name"
          placeholderTextColor={colors.text.tertiary}
          value={name}
          onChangeText={text => {
            setName(text);
            if (localError) {
              setLocalError(null);
            }
          }}
          editable={!submitting}
          autoFocus
          returnKeyType="done"
          onSubmitEditing={handleSubmit}
        />

        {displayError ? (
          <Text
            variant="bodySmall"
            color={colors.error.main}
            align="center"
            style={styles.errorText}>
            {displayError}
          </Text>
        ) : null}

        <Button
          title={submitting ? 'Submitting...' : 'Submit'}
          variant="primary"
          size="large"
          onPress={handleSubmit}
          loading={submitting}
          disabled={!trimmedName}
          style={styles.submitButton}
        />
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredModal: {
    justifyContent: 'center',
  },
  modalContent: {
    width: '85%',
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },
  container: {
    alignItems: 'stretch',
    paddingVertical: 8,
  },
  subtitle: {
    marginTop: 8,
    marginBottom: 16,
    lineHeight: 20,
  },
  input: {
    height: 52,
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    borderWidth: 1.5,
  },
  errorText: {
    marginTop: 8,
  },
  submitButton: {
    marginTop: 20,
  },
});

export default EnterNameModal;

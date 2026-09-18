import React from 'react';
import {StyleSheet, View} from 'react-native';
import {useTheme} from '../../theme';
import {Button} from '../Button';
import {Icon} from '../Icon';
import {Text} from '../Text';
import {Modal} from './Modal';

interface UpdateReadyModalProps {
  visible: boolean;
  onRestart: () => void;
}

export const UpdateReadyModal: React.FC<UpdateReadyModalProps> = ({
  visible,
  onRestart,
}) => {
  const {colors} = useTheme();

  return (
    <Modal
      visible={visible}
      onClose={() => {}}
      onRequestClose={() => {}}
      animationType="fade"
      dismissOnBackdropPress={false}
      showCloseButton={false}
      contentStyle={styles.modalContent}>
      <View style={styles.container}>
        <View
          style={[
            styles.iconContainer,
            {backgroundColor: colors.primary.light},
          ]}>
          <Icon
            name="system-update"
            size={40}
            color={colors.primary.main}
            library="MaterialIcons"
          />
        </View>

        <Text variant="h6" weight="bold" align="center" style={styles.title}>
          Update Ready
        </Text>

        <Text
          variant="body"
          align="center"
          color={colors.text.secondary}
          style={styles.message}>
          A new version of DhwaniAstro is ready. Restart the app to complete the
          update.
        </Text>

        <Button
          title="Restart"
          variant="primary"
          size="large"
          onPress={onRestart}
          style={styles.actionButton}
        />
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContent: {
    width: '88%',
    paddingHorizontal: 20,
    paddingVertical: 24,
  },
  container: {
    alignItems: 'center',
  },
  iconContainer: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  title: {
    marginBottom: 8,
  },
  message: {
    marginBottom: 20,
  },
  actionButton: {
    width: '100%',
  },
});

import React from 'react';
import {StyleSheet, View} from 'react-native';
import {useTheme} from '../../../../theme';
import {Text} from '../../../../components/Text';
import {Icon} from '../../../../components/Icon';
import {Button} from '../../../../components';

interface ErrorStateProps {
  message: string;
  onRetry: () => void;
}

export const ErrorState: React.FC<ErrorStateProps> = ({message, onRetry}) => {
  const {colors} = useTheme();

  return (
    <View style={styles.container}>
      <View
        style={[styles.iconBox, {backgroundColor: colors.error.light + '20'}]}>
        <Icon name="error-outline" size={48} color={colors.error.main} />
      </View>
      <Text
        variant="h6"
        weight="bold"
        style={{
          color: colors.text.primary,
          marginTop: 16,
          textAlign: 'center',
        }}>
        Something went wrong
      </Text>
      <Text
        variant="bodySmall"
        style={{
          color: colors.text.secondary,
          marginTop: 8,
          textAlign: 'center',
          lineHeight: 22,
        }}>
        {message}
      </Text>
      <View style={styles.btnWrap}>
        <Button title="Retry" size="small" onPress={onRetry} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 60,
    paddingHorizontal: 32,
  },
  iconBox: {
    width: 88,
    height: 88,
    borderRadius: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnWrap: {
    marginTop: 20,
  },
});

export default ErrorState;

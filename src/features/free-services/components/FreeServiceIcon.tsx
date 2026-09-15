import React from 'react';
import {Image, StyleSheet, View} from 'react-native';

import {Icon} from '../../../components/Icon';
import {useTheme} from '../../../theme';
import {
  FREE_SERVICE_ICON_BOX,
  getFreeServiceIconConfig,
} from '../utils/freeServiceImages';

interface FreeServiceIconProps {
  service: {
    title?: string;
    slug?: string;
  };
}

const getImageStyle = (
  config: NonNullable<ReturnType<typeof getFreeServiceIconConfig>>,
) => ({
  width: config.renderSize,
  height: config.renderSize,
  transform: [{translateX: config.translateX}, {translateY: config.translateY}],
});

const FreeServiceIcon: React.FC<FreeServiceIconProps> = ({service}) => {
  const colors = useTheme().colors;
  const config = getFreeServiceIconConfig(service);

  return (
    <View
      style={[
        styles.box,
        {
          backgroundColor: colors.primary.light + '20',
        },
      ]}>
      {config ? (
        <Image
          source={config.source}
          resizeMode="contain"
          style={getImageStyle(config)}
        />
      ) : (
        <Icon
          name="auto-awesome"
          size={28}
          color={colors.primary.main}
          library="MaterialIcons"
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  box: {
    width: FREE_SERVICE_ICON_BOX,
    height: FREE_SERVICE_ICON_BOX,
    borderRadius: FREE_SERVICE_ICON_BOX / 2,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
});

export default FreeServiceIcon;

import React, {useRef, useEffect} from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Animated,
  ImageBackground,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

interface TopHeaderProps {
  title?: string;
  showBack?: boolean;
  onBack?: () => void;
  headerImage?: any;
  onSettingsPress?: () => void;
  setDoorOpen: any;
  completePuja: any;
}

const TopHeader = ({
  showBack = true,
  onBack,
  headerImage,
  onSettingsPress,
  setDoorOpen,
  completePuja,
}: TopHeaderProps) => {
  const glowAnim = useRef(new Animated.Value(0)).current;

  const handleBack = () => {
    // Close the door first
    setDoorOpen(false);
    completePuja();
    // Wait for door animation to complete (3500ms)
    setTimeout(() => {
      onBack?.();
    }, 3500); // match TempleDoor animation duration
  };

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(glowAnim, {
          toValue: 0,
          duration: 1500,
          useNativeDriver: true,
        }),
      ]),
    ).start();
  }, []);

  const renderBackground = () => {
    if (headerImage) {
      return (
        <ImageBackground
          source={headerImage}
          style={styles.container}
          imageStyle={styles.backgroundImage}>
          <View style={styles.gradientOverlay}>
            {/* Back Button */}
            {showBack && (
              <TouchableOpacity style={styles.backButton} onPress={handleBack}>
                <Icon name="chevron-left" size={30} color="#FFFFFF" />
              </TouchableOpacity>
            )}

            {/* Settings Button */}
            {onSettingsPress && (
              <TouchableOpacity
                style={styles.settingsButton}
                onPress={onSettingsPress}>
                <Icon name="cog" size={24} color="#FFFFFF" />
              </TouchableOpacity>
            )}
          </View>
        </ImageBackground>
      );
    }

    // Default gradient background
    return (
      <LinearGradient
        colors={['#b9935a', '#f7e6b5', '#b9935a']}
        start={{x: 0, y: 0}}
        end={{x: 1, y: 1}}
        style={styles.container}>
        {/* Back Button */}
        {showBack && (
          <TouchableOpacity style={styles.backButton} onPress={onBack}>
            <Icon name="chevron-left" size={30} color="#4b2e05" />
          </TouchableOpacity>
        )}

        {/* Settings Button */}
        {onSettingsPress && (
          <TouchableOpacity
            style={styles.settingsButton}
            onPress={onSettingsPress}>
            <Icon name="cog" size={24} color="#4b2e05" />
          </TouchableOpacity>
        )}
      </LinearGradient>
    );
  };

  return <View style={styles.wrapper}>{renderBackground()}</View>;
};

const styles = StyleSheet.create({
  wrapper: {
    zIndex: 999,
    width: '100%',
  },

  container: {
    height: 80,
    justifyContent: 'flex-end',
    width: '100%',
    alignItems: 'center',
    paddingBottom: 30,
    zIndex: 999,
  },

  backgroundImage: {
    resizeMode: 'cover',
    // height:'100%',
    // width:'100%'
  },

  gradientOverlay: {
    // flex: 1,
    // flexDirection: 'row',
    // justifyContent: 'space-between',
    // alignItems: 'flex-end',
    // // paddingBottom: 30,
    // paddingHorizontal: 15,
    // zIndex:999
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10,
    marginBottom: -10,
  },

  crownContainer: {
    position: 'absolute',
    top: 40,
  },

  leftIcon: {
    position: 'absolute',
    left: 25,
    top: 80,
  },

  rightIcon: {
    position: 'absolute',
    right: 25,
    top: 80,
  },

  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4b2e05',
    letterSpacing: 2,
  },

  divider: {
    position: 'absolute',
    bottom: 0,
    width: '80%',
    height: 4,
    backgroundColor: '#8c6b3c',
    borderRadius: 4,
  },

  backButton: {
    padding: 5,
  },

  settingsButton: {
    padding: 5,
  },
});

export default TopHeader;

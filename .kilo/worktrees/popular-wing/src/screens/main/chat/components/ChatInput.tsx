import React, {useRef, useEffect, useCallback} from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
  Animated,
  Platform,
  PermissionsAndroid,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useTheme} from '../../../../theme';
import {Icon} from '../../../../components/Icon';
import {launchImageLibrary} from 'react-native-image-picker';
import {useUploadImage} from '../../../../services/api/upload/upload.hook';

interface ReplyToData {
  sender: string;
  message: string;
  image?: string | null;
}

interface ChatInputProps {
  inputText: string;
  onInputChange: (text: string) => void;
  onSend: (imageUrl?: any) => void; //  UPDATED
  replyTo?: ReplyToData | null;
  onCancelReply?: () => void;
}

export const ChatInput: React.FC<ChatInputProps> = ({
  inputText,
  onInputChange,
  onSend,
  replyTo,
  onCancelReply,
}) => {
  const theme = useTheme();
  const colors = theme.colors;
  const insets = useSafeAreaInsets();

  const {upload, loading: uploading} = useUploadImage();

  const isDisabled = !inputText.trim();

  const sendScaleAnim = useRef(new Animated.Value(1)).current;
  const sendOpacityAnim = useRef(new Animated.Value(0.5)).current;
  const inputFocusAnim = useRef(new Animated.Value(0)).current;

  // ================= PERMISSION =================
  const requestPermission = async () => {
    if (Platform.OS !== 'android') {
      return true;
    }

    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES,
    );

    return granted === PermissionsAndroid.RESULTS.GRANTED;
  };

  // ================= IMAGE PICK =================
  const handlePickImage = useCallback(async () => {
    try {
      const ok = await requestPermission();
      if (!ok) {
        return;
      }

      const res = await launchImageLibrary({
        mediaType: 'photo',
        quality: 0.7,
      });

      if (!res.assets || !res.assets.length) {
        return;
      }

      const asset = res.assets[0];

      const file = {
        uri: asset.uri!,
        name: asset.fileName || 'image.jpg',
        type: asset.type || 'image/jpeg',
      };

      const imageUrl = await upload(file);

      onSend({
        text: '',
        image: imageUrl,
      });
    } catch (e) {
      console.log('❌ Image error:', e);
    }
  }, [upload, onSend]);

  // ================= SEND TEXT =================
  const handleSend = () => {
    if (isDisabled) {
      return;
    }

    Animated.sequence([
      Animated.timing(sendScaleAnim, {
        toValue: 0.85,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.spring(sendScaleAnim, {
        toValue: 1,
        friction: 4,
        tension: 200,
        useNativeDriver: true,
      }),
    ]).start();

    onSend({
      text: inputText,
      image: null,
    });
  };

  // ================= FOCUS ANIMATION =================
  useEffect(() => {
    Animated.timing(inputFocusAnim, {
      toValue: isDisabled ? 0 : 1,
      duration: 200,
      useNativeDriver: false,
    }).start();
  }, [isDisabled]);

  // ================= ANIMATION =================
  useEffect(() => {
    Animated.parallel([
      Animated.timing(sendOpacityAnim, {
        toValue: isDisabled ? 0.4 : 1,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.spring(sendScaleAnim, {
        toValue: isDisabled ? 0.9 : 1,
        friction: 6,
        tension: 100,
        useNativeDriver: true,
      }),
    ]).start();
  }, [isDisabled]);

  // ================= UI =================
  const isDark = theme.isDark || false;

  return (
    <View
      style={[
        styles.container,
        {
          paddingBottom: insets.bottom + 12,
          backgroundColor: colors.background.primary,
        },
      ]}>
      {/* REPLY PREVIEW */}
      {replyTo && (
        <Animated.View
          style={[
            styles.replyPreview,
            {
              backgroundColor: isDark
                ? colors.surface.elevated
                : colors.common.gray[50],
              borderLeftColor: colors.primary.main,
              transform: [
                {
                  translateY: inputFocusAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, -5],
                  }),
                },
              ],
              opacity: inputFocusAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [1, 0],
              }),
            },
          ]}>
          <View style={styles.replyContent}>
            <Text style={[styles.replyLabel, {color: colors.text.tertiary}]}>
              Replying to
            </Text>
            <Text
              style={[styles.replySender, {color: colors.primary.main}]}
              numberOfLines={1}>
              {replyTo.sender}
            </Text>
            {replyTo.message ? (
              <Text
                style={[styles.replyMessage, {color: colors.text.secondary}]}
                numberOfLines={1}>
                {replyTo.message}
              </Text>
            ) : null}
            {replyTo.image && (
              <View style={styles.replyImagePreview}>
                <Icon name="image" size={14} color={colors.primary.main} />
                <Text
                  style={[
                    styles.replyImageText,
                    {color: colors.text.tertiary},
                  ]}>
                  Photo
                </Text>
              </View>
            )}
          </View>
          <TouchableOpacity
            onPress={onCancelReply}
            style={[
              styles.cancelReply,
              {backgroundColor: colors.common.gray[200]},
            ]}
            hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}>
            <Icon name="close" size={16} color={colors.text.tertiary} />
          </TouchableOpacity>
        </Animated.View>
      )}

      <Animated.View
        style={[
          styles.inputWrapper,
          {
            backgroundColor: colors.card.background,
            borderColor: inputFocusAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [
                isDark ? colors.border.main : colors.common.gray[300],
                colors.primary.main,
              ],
            }),
            shadowColor: isDark ? '#000' : colors.primary.main,
            shadowOpacity: inputFocusAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [0.12, 0.2],
            }),
            shadowRadius: inputFocusAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [8, 16],
            }),
            transform: [
              {
                scale: inputFocusAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [1, 1.01],
                }),
              },
            ],
          },
          isDark && styles.inputWrapperDark,
        ]}>
        {/* ATTACHMENT BUTTON */}
        <TouchableOpacity
          onPress={handlePickImage}
          style={[
            styles.actionButton,
            {
              backgroundColor: uploading
                ? colors.common.gray[100]
                : isDark
                ? colors.surface.elevated
                : colors.primary.light,
            },
          ]}
          hitSlop={{top: 12, bottom: 12, left: 12, right: 12}}
          activeOpacity={0.7}>
          {uploading ? (
            <Animated.View
              style={[
                styles.loadingDot,
                {backgroundColor: colors.primary.main},
              ]}>
              <Icon name="image" size={20} color={colors.primary.main} />
            </Animated.View>
          ) : (
            <Icon name="image" size={22} color={colors.primary.main} />
          )}
        </TouchableOpacity>

        {/* TEXT INPUT */}
        <TextInput
          style={[
            styles.input,
            {
              color: colors.text.primary,
              fontSize: 15,
            },
          ]}
          placeholder="Type a message..."
          placeholderTextColor={colors.text.tertiary}
          value={inputText}
          onChangeText={onInputChange}
          multiline
          maxLength={1000}
          textAlignVertical="center"
          editable={!uploading}
        />

        {/* SEND BUTTON */}
        <Animated.View
          style={[
            styles.sendButton,
            {
              backgroundColor: isDisabled
                ? isDark
                  ? colors.common.gray[700]
                  : colors.common.gray[200]
                : colors.primary.main,
              transform: [
                {scale: sendScaleAnim},
                {
                  translateY: sendScaleAnim.interpolate({
                    inputRange: [0.8, 1],
                    outputRange: [2, 0],
                  }),
                },
              ],
              opacity: sendOpacityAnim,
              shadowColor: isDark ? '#000' : colors.primary.main,
              shadowOpacity: isDisabled ? 0 : 0.3,
              shadowRadius: isDisabled ? 0 : 8,
              shadowOffset: {width: 0, height: isDisabled ? 0 : 3},
              elevation: isDisabled ? 0 : 6,
            },
          ]}>
          <TouchableOpacity
            onPress={handleSend}
            disabled={isDisabled || uploading}
            hitSlop={{top: 12, bottom: 12, left: 12, right: 12}}
            activeOpacity={0.8}>
            <Icon
              name="send"
              size={18}
              color={
                isDisabled ? colors.text.disabled : colors.primary.contrastText
              }
            />
          </TouchableOpacity>
        </Animated.View>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingTop: 12,
    marginBottom: 40,
  },
  replyPreview: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 10,
    borderRadius: 16,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  replyContent: {
    flex: 1,
    marginRight: 8,
  },
  replyLabel: {
    fontSize: 11,
    fontWeight: '500',
    marginBottom: 2,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  replySender: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 2,
  },
  replyMessage: {
    fontSize: 13,
    opacity: 0.8,
  },
  replyImagePreview: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    gap: 4,
  },
  replyImageText: {
    fontSize: 12,
    fontWeight: '500',
  },
  cancelReply: {
    padding: 6,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    borderRadius: 24,
    borderWidth: 1.5,
    paddingHorizontal: 6,
    paddingVertical: 6,
    shadowOffset: {width: 0, height: 4},
    shadowRadius: 12,
    elevation: 5,
    minHeight: 56,
  },
  inputWrapperDark: {
    borderWidth: 1,
  },
  actionButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 4,
    marginBottom: 2,
  },
  loadingDot: {
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    flex: 1,
    fontSize: 15,
    maxHeight: 120,
    paddingVertical: 12,
    paddingHorizontal: 8,
    minHeight: 40,
    letterSpacing: 0.1,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 4,
    marginBottom: 2,
  },
});

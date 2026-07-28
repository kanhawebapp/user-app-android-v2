// import React, {useRef, useEffect} from 'react';
// import {
//   View,
//   TextInput,
//   TouchableOpacity,
//   Text,
//   StyleSheet,
//   Animated,
//   Platform,
// } from 'react-native';
// import {useSafeAreaInsets} from 'react-native-safe-area-context';
// import {useTheme} from '../../../../theme';
// import {Icon} from '../../../../components/Icon';

// interface ReplyToData {
//   sender: string;
//   message: string;
//   image?: string | null;
// }

// interface ChatInputProps {
//   inputText: string;
//   onInputChange: (text: string) => void;
//   onSend: () => void;
//   onAddMedia?: () => void;
//   replyTo?: ReplyToData | null;
//   onCancelReply?: () => void;
//   astrologerName?: string;
// }

// export const ChatInput: React.FC<ChatInputProps> = ({
//   inputText,
//   onInputChange,
//   onSend,
//   onAddMedia,
//   replyTo,
//   onCancelReply,
//   astrologerName = 'Astrologer',
// }) => {
//   const theme = useTheme();
//   const colors = theme.colors;
//   const insets = useSafeAreaInsets();

//   const isDisabled = !inputText.trim();
//   const sendScaleAnim = useRef(new Animated.Value(1)).current;
//   const sendOpacityAnim = useRef(new Animated.Value(0.5)).current;

//   useEffect(() => {
//     Animated.parallel([
//       Animated.timing(sendOpacityAnim, {
//         toValue: isDisabled ? 0.5 : 1,
//         duration: 150,
//         useNativeDriver: true,
//       }),
//       Animated.spring(sendScaleAnim, {
//         toValue: isDisabled ? 0.9 : 1,
//         friction: 5,
//         tension: 40,
//         useNativeDriver: true,
//       }),
//     ]).start();
//   }, [isDisabled]);

//   const handleSend = () => {
//     if (isDisabled) return;

//     Animated.sequence([
//       Animated.timing(sendScaleAnim, {
//         toValue: 0.8,
//         duration: 50,
//         useNativeDriver: true,
//       }),
//       Animated.spring(sendScaleAnim, {
//         toValue: 1,
//         friction: 3,
//         tension: 40,
//         useNativeDriver: true,
//       }),
//     ]).start();

//     onSend();
//   };

//   const renderReplyPreview = () => {
//     if (!replyTo) return null;

//     const isDark = theme.isDark || false;

//     return (
//       <View
//         style={[
//           styles.replyPreview,
//           {
//             borderLeftColor: colors.primary.main,
//             backgroundColor: isDark ? colors.card.background : '#F5F5F5',
//           },
//         ]}>
//         <View style={styles.replyContent}>
//           <Text
//             style={[styles.replySender, {color: colors.primary.main}]}
//             numberOfLines={1}>
//             Reply to {replyTo.sender === 'You' ? 'yourself' : replyTo.sender}
//           </Text>
//           <Text
//             style={[styles.replyMessage, {color: colors.text.secondary}]}
//             numberOfLines={1}>
//             {replyTo.message}
//           </Text>
//         </View>
//         <TouchableOpacity
//           onPress={onCancelReply}
//           style={styles.cancelReply}
//           hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}>
//           <Icon name="close" size={18} color={colors.text.tertiary} />
//         </TouchableOpacity>
//       </View>
//     );
//   };

//   const isDark = theme.isDark || false;

//   return (
//     <View
//       style={[
//         styles.container,
//         {
//           paddingBottom: insets.bottom + 8,
//           backgroundColor: colors.background.primary,
//         },
//       ]}>
//       {renderReplyPreview()}

//       <View
//         style={[
//           styles.inputWrapper,
//           {
//             backgroundColor: colors.card.background,
//             borderColor: colors.border.light,
//             shadowColor: isDark ? '#000' : '#8B5CF6',
//           },
//         ]}>
//         <TouchableOpacity
//           style={styles.actionButton}
//           onPress={onAddMedia}
//           hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}>
//           <Icon
//             name="add-circle-outline"
//             size={26}
//             color={colors.primary.main}
//           />
//         </TouchableOpacity>

//         <TextInput
//           style={[
//             styles.input,
//             {color: colors.text.primary},
//             isDisabled && {opacity: 0.7},
//           ]}
//           placeholder="Ask your question..."
//           placeholderTextColor={colors.text.tertiary}
//           value={inputText}
//           onChangeText={onInputChange}
//           multiline
//           maxLength={500}
//           textAlignVertical="center"
//         />

//         <View style={styles.actions}>
//           <Animated.View
//             style={[
//               styles.sendButton,
//               {
//                 backgroundColor: isDisabled
//                   ? colors.common.gray[200]
//                   : colors.primary.main,
//                 transform: [{scale: sendScaleAnim}],
//                 opacity: sendOpacityAnim,
//               },
//             ]}>
//             <TouchableOpacity
//               onPress={handleSend}
//               disabled={isDisabled}
//               hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}>
//               <Icon
//                 name="send"
//                 size={18}
//                 color={
//                   isDisabled
//                     ? colors.common.gray[500]
//                     : colors.primary.contrastText
//                 }
//               />
//             </TouchableOpacity>
//           </Animated.View>
//         </View>
//       </View>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     paddingHorizontal: 12,
//     paddingTop: 8,
//   },
//   replyPreview: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     paddingHorizontal: 14,
//     paddingVertical: 10,
//     marginBottom: 8,
//     borderRadius: 12,
//     borderLeftWidth: 4,
//   },
//   replyContent: {
//     flex: 1,
//     marginRight: 8,
//   },
//   replySender: {
//     fontSize: 13,
//     fontWeight: '600',
//     marginBottom: 2,
//   },
//   replyMessage: {
//     fontSize: 14,
//     opacity: 0.8,
//   },
//   cancelReply: {
//     padding: 4,
//   },
//   inputWrapper: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     borderRadius: 28,
//     borderWidth: 1,
//     paddingHorizontal: 6,
//     paddingVertical: 6,
//     shadowOpacity: 0.08,
//     shadowRadius: 8,
//     shadowOffset: {width: 0, height: 4},
//     elevation: 4,
//   },
//   actionButton: {
//     padding: 6,
//     marginRight: 2,
//   },
//   input: {
//     flex: 1,
//     fontSize: 15,
//     maxHeight: 100,
//     paddingVertical: 8,
//     paddingHorizontal: 8,
//     minHeight: 36,
//   },
//   actions: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginLeft: 4,
//   },
//   sendButton: {
//     width: 38,
//     height: 38,
//     borderRadius: 19,
//     alignItems: 'center',
//     justifyContent: 'center',
//     ...Platform.select({
//       ios: {
//         shadowColor: '#000',
//         shadowOpacity: 0.15,
//         shadowRadius: 4,
//         shadowOffset: {width: 0, height: 2},
//       },
//     }),
//   },
// });

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
  onSend: (imageUrl?: string) => void; // 🔥 UPDATED
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

  // ================= PERMISSION =================
  const requestPermission = async () => {
    if (Platform.OS !== 'android') return true;

    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES,
    );

    return granted === PermissionsAndroid.RESULTS.GRANTED;
  };

  // ================= IMAGE PICK =================
  // const handlePickImage = useCallback(async () => {
  //   try {
  //     const ok = await requestPermission();
  //     if (!ok) return;

  //     const res = await launchImageLibrary({
  //       mediaType: 'photo',
  //       quality: 0.7,
  //     });

  //     if (!res.assets || !res.assets.length) return;

  //     const asset = res.assets[0];

  //     const file = {
  //       uri: asset.uri!,
  //       name: asset.fileName || 'image.jpg',
  //       type: asset.type || 'image/jpeg',
  //     };

  //     console.log('📸 Selected:', file);

  //     // 🔥 upload
  //     const imageUrl = await upload(file);

  //     console.log(' Uploaded:', imageUrl);

  //     // 🔥 send image
  //     onSend(imageUrl);

  //   } catch (e) {
  //     console.log('❌ Image error:', e);
  //   }
  // }, [upload, onSend]);

  const handlePickImage = useCallback(async () => {
    try {
      const ok = await requestPermission();
      if (!ok) return;

      const res = await launchImageLibrary({
        mediaType: 'photo',
        quality: 0.7,
      });

      if (!res.assets || !res.assets.length) return;

      const asset = res.assets[0];

      const file = {
        uri: asset.uri!,
        name: asset.fileName || 'image.jpg',
        type: asset.type || 'image/jpeg',
      };

      const imageUrl = await upload(file);

      console.log(' Uploaded:', imageUrl);

      // ✅ FIXED
      onSend({
        text: '',
        image: imageUrl,
      });
    } catch (e) {
      console.log('❌ Image error:', e);
    }
  }, [upload, onSend]);

  // ================= SEND TEXT =================
  // const handleSend = () => {
  //   if (isDisabled) return;
  //   onSend(); // text only
  // };
  const handleSend = () => {
    if (isDisabled) return;

    onSend({
      text: inputText,
      image: null,
    });
  };

  // ================= ANIMATION =================
  useEffect(() => {
    Animated.parallel([
      Animated.timing(sendOpacityAnim, {
        toValue: isDisabled ? 0.5 : 1,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.spring(sendScaleAnim, {
        toValue: isDisabled ? 0.9 : 1,
        useNativeDriver: true,
      }),
    ]).start();
  }, [isDisabled]);

  // ================= UI =================
  return (
    <View
      style={[
        styles.container,
        {
          paddingBottom: insets.bottom + 8,
          backgroundColor: colors.background.primary,
        },
      ]}>
      {/* REPLY */}
      {replyTo && (
        <View style={styles.replyPreview}>
          <Text>Replying to {replyTo.sender}</Text>
        </View>
      )}

      <View style={styles.inputWrapper}>
        {/* IMAGE BUTTON */}
        <TouchableOpacity onPress={handlePickImage}>
          <Icon
            name="image"
            size={24}
            color={uploading ? 'gray' : colors.primary.main}
          />
        </TouchableOpacity>

        {/* INPUT */}
        <TextInput
          style={styles.input}
          value={inputText}
          onChangeText={onInputChange}
          placeholder="Type message..."
        />

        {/* SEND */}
        <Animated.View
          style={{
            transform: [{scale: sendScaleAnim}],
            opacity: sendOpacityAnim,
          }}>
          <TouchableOpacity onPress={handleSend} disabled={isDisabled}>
            <Icon name="send" size={20} />
          </TouchableOpacity>
        </Animated.View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {padding: 10},
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {flex: 1, marginHorizontal: 10},
  replyPreview: {padding: 5},
});

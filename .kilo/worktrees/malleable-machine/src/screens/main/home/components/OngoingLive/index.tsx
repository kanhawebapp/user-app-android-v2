// import React from 'react';
// import {View, ScrollView, TouchableOpacity, Image, ImageBackground} from 'react-native';
// import {useTheme} from '../../../../../theme';
// import {Text} from '../../../../../components/Text';
// import {Icon} from '../../../../../components/Icon';
// import {Button} from '../../../../../components/Button';
// import {OngoingLiveProps, LiveSession} from './type';
// import {styles} from './styles';
// import {useOngoingLive} from './hooks/useOngoingLive';
// import images from '../../../../../assets/images';

// export const OngoingLive: React.FC<OngoingLiveProps> = ({
//   sessions = [],
//   onSessionPress,
//   onViewAllPress,
//   style,
// }) => {
//   const theme = useTheme();
//   const colors = theme.colors;

//   const {
//     sessions: sessionsData,
//     handleSessionPress,
//     handleViewAllPress,
//     isLiveSession,
//   } = useOngoingLive(sessions, onSessionPress, onViewAllPress);

//   if (!sessionsData.length) return null;

//   const renderCard = ({item}: {item: LiveSession}) => (
//     <TouchableOpacity
//       style={[styles.card, {backgroundColor: colors.card.background}]}
//       onPress={() => handleSessionPress(item)}
//       activeOpacity={0.9}>
//       <ImageBackground
//         source={{uri: images.Logo}}
//         style={[
//           styles.thumbnail,
//           {backgroundColor: colors.background.secondary},
//         ]}>
//         {/* Placeholder for actual image */}
//         <Image
//           source={require('../../../../../assets/images/Logo.png')}
//           style={{ width: 40, height: 40, borderRadius: 20 }}
//         />

//         {/* LIVE Badge on card */}
//         {isLiveSession(item) && (
//           <View style={styles.liveBadgeCard}>
//             <View style={styles.liveDot} />
//             <Text variant="captionSmall" style={styles.liveBadgeText}>
//               LIVE
//             </Text>
//           </View>
//         )}

//         {/* Viewer count badge */}
//         <View style={styles.viewerBadge}>
//           <Icon
//             name="visibility"
//             size={12}
//             color="#FFF"
//             library="MaterialIcons"
//           />
//           <Text variant="captionSmall" style={styles.viewerCount}>
//             {item.viewerCount || 0}
//           </Text>
//         </View>
//       </ImageBackground>

//       <View style={styles.cardContent}>
//         <Text
//           variant="label"
//           weight="semibold"
//           style={styles.astrologerName}
//           numberOfLines={1}>
//           {item.astrologerName}
//         </Text>
//         <Text
//           variant="caption"
//           style={[styles.sessionTitle, {color: colors.text.secondary}]}
//           numberOfLines={1}>
//           {item.title}
//         </Text>
//         <View style={[styles.statusIndicator, {borderColor: '#4CAF50'}]}>
//           <Text variant="captionSmall" style={styles.joinNowText}>
//             Join Now
//           </Text>
//         </View>
//       </View>
//     </TouchableOpacity>
//   );

//   return (
//     <View style={[styles.container, style]}>
//       <View style={styles.header}>
//         <View style={styles.titleContainer}>
//           <Text variant="h6" weight="semibold">
//             Ongoing Live
//           </Text>
//           <View style={styles.liveBadge}>
//             <View style={styles.dot} />
//             <Text variant="captionSmall" weight="bold" style={styles.liveText}>
//               LIVE
//             </Text>
//           </View>
//         </View>
//         <Button
//           title="View All"
//           variant="ghost"
//           size="small"
//           onPress={handleViewAllPress}
//         />
//       </View>

//       <ScrollView
//         horizontal
//         showsHorizontalScrollIndicator={false}
//         contentContainerStyle={styles.scrollContent}>
//         {sessionsData.map(session => (
//           <View key={session.id}>{renderCard({item: session})}</View>
//         ))}
//       </ScrollView>
//     </View>
//   );
// };

// export default OngoingLive;

import React from 'react';
import {
  View,
  ScrollView,
  TouchableOpacity,
  ImageBackground,
} from 'react-native';
import {useTheme} from '../../../../../theme';
import {Text} from '../../../../../components/Text';
import {Icon} from '../../../../../components/Icon';
import {Button} from '../../../../../components/Button';
import {OngoingLiveProps, LiveSession} from './type';
import {styles} from './styles';
import {useOngoingLive} from './hooks/useOngoingLive';
import images from '../../../../../assets/images';

export const OngoingLive: React.FC<OngoingLiveProps> = ({
  sessions = [],
  onSessionPress,
  onViewAllPress,
  style,
}) => {
  const theme = useTheme();
  const colors = theme.colors;

  const {
    sessions: sessionsData,
    handleSessionPress,
    handleViewAllPress,
    isLiveSession,
  } = useOngoingLive(sessions, onSessionPress, onViewAllPress);

  if (!sessionsData?.length) return null;

  const renderCard = (item: LiveSession) => (
    <TouchableOpacity
      key={item.id}
      style={[styles.card, {backgroundColor: colors.card.background}]}
      onPress={() => handleSessionPress(item)}
      activeOpacity={0.9}>
      <ImageBackground
        source={images.AstrologerCard1}
        style={[
          styles.thumbnail,
          {backgroundColor: colors.background.secondary},
        ]}
        imageStyle={{borderTopLeftRadius: 12, borderTopRightRadius: 12}}>
        {/* LIVE Badge */}
        {isLiveSession(item) && (
          <View style={styles.liveBadgeCard}>
            {/* <View style={styles.liveDot} /> */}
            <Text variant="captionSmall" style={styles.liveBadgeText}>
              LIVE
            </Text>
          </View>
        )}

        {/* Viewer Count */}
        <View style={styles.viewerBadge}>
          <Icon name="users" size={12} color="#FFF" library="Feather" />
          <Text variant="captionSmall" style={styles.viewerCount}>
            {item.viewerCount ?? 0}
          </Text>
        </View>
      </ImageBackground>

      <View style={styles.cardContent}>
        <Text
          variant="h6"
          style={[
            styles.sessionTitle,
            {color: colors.text.primary, fontWeight: '600'},
          ]}
          numberOfLines={1}>
          {item.title}
        </Text>
        <View style={styles.joinCont}>
          <Text
            variant="label"
            // weight="semibold"
            style={styles.astrologerName}
            numberOfLines={1}>
            {item.astrologerName}
          </Text>

          <View
            style={[
              styles.statusIndicator,
              {borderColor: colors.primary.main},
            ]}>
            <Text variant="captionSmall" style={styles.joinNowText}>
              Join Now
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, style]}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Text variant="h6" weight="semibold" style={{fontWeight: '600'}}>
            Ongoing Live Sessions
          </Text>
        </View>

        <Button
          title="View All"
          variant="ghost"
          size="small"
          onPress={handleViewAllPress}
        />
      </View>

      {/* Live Sessions */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}>
        {sessionsData.map(renderCard)}
      </ScrollView>
    </View>
  );
};

export default OngoingLive;

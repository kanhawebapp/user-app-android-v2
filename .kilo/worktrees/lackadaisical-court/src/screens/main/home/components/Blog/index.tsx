// /**
//  * Blog Component
//  * Blog section in Home Screen
//  */

// import React from 'react';
// import {View, ScrollView, TouchableOpacity, Image} from 'react-native';
// import {useTheme} from '../../../../../theme';
// import {Text} from '../../../../../components/Text';
// import {Icon} from '../../../../../components/Icon';
// import {Button} from '../../../../../components/Button';
// import {BlogProps} from './types';
// import {blogStyles} from './styles';
// import {Card} from '../../../../../components';
// import images from '../../../../../assets/images';

// export const Blog: React.FC<BlogProps> = ({
//   posts = [],
//   onPostPress,
//   onViewAllPress,
//   style,
// }) => {
//   const theme = useTheme();
//   const colors = theme.colors;

//   console.log('postspostsposts', posts);

//   return (
//     <View style={[blogStyles.container, style]}>
//       <View style={blogStyles.header}>
//         <Text variant="h6" weight="semibold">
//           Blog
//         </Text>
//         <Button
//           title="View All"
//           variant="ghost"
//           size="small"
//           onPress={onViewAllPress}
//         />
//       </View>

//       <ScrollView
//         horizontal
//         showsHorizontalScrollIndicator={false}
//         contentContainerStyle={blogStyles.scrollContent}>
//         {posts.map(post => (
//           // <Card
//           //   key={post.id}
//           //   style={blogStyles.card}
//           //   onPress={() => onPostPress?.(post)}>

//           <Card
//             key={post.id}
//             style={[
//               blogStyles.card,
//               {
//                 overflow: 'hidden', // 🔥 IMPORTANT FIX
//               },
//             ]}
//             onPress={() => onPostPress?.(post)}>
//             {/* IMAGE */}
//             <View style={blogStyles.imageWrapper}>
//               <Image
//                 source={{uri: post.image}}
//                 style={blogStyles.image}
//                 resizeMode="cover"
//               />

//               {/* DARK OVERLAY */}
//               <View style={blogStyles.overlay} />

//               {/* READ TIME BADGE */}
//               <View style={blogStyles.badge}>
//                 {/* <Icon name="schedule" size={12} color="#fff" /> */}
//                 <Icon name="visibility" size={12} color="#ffffff" />
//                 <Text style={blogStyles.metaText}>
//                   {Math.floor(Math.random() * 900 + 100)} {/* dummy views */}
//                 </Text>
//                 {/* <Text style={blogStyles.badgeText}>{post.readTime}</Text> */}
//               </View>

//               {/* TITLE ON IMAGE */}
//               <View style={blogStyles.imageContent}>
//                 <Text
//                   variant="label"
//                   weight="semibold"
//                   numberOfLines={2}
//                   style={{color: '#fff'}}>
//                   {post.title}
//                 </Text>
//               </View>
//             </View>

//             {/* CONTENT */}
//             <View style={blogStyles.content}>
//               <Text
//                 variant="captionSmall"
//                 numberOfLines={2}
//                 style={{color: '#666'}}>
//                 {post.excerpt}
//               </Text>

//               {/* META ROW */}
//               <View style={blogStyles.metaRow}>
//                 {/* AUTHOR */}
//                 <View style={blogStyles.metaItem}>
//                   <Icon name="person" size={12} color="#888" />
//                   <Text
//                     style={[blogStyles.metaText, {color: colors.primary.dark}]}>
//                     {post.author || 'Default name'}
//                   </Text>
//                 </View>
//               </View>
//               <View style={blogStyles.dateContainer}>
//                 <Text>Dec 23, 2025</Text>
//                 <Icon name="arrow-forward" size={32} color="#888" />
//               </View>
//             </View>
//           </Card>
//         ))}
//       </ScrollView>
//     </View>
//   );
// };

// export default Blog;

import React from 'react';
import {View, ScrollView, Image} from 'react-native';
import {useTheme} from '../../../../../theme';
import {Text} from '../../../../../components/Text';
import {Icon} from '../../../../../components/Icon';
import {Button} from '../../../../../components/Button';
import {BlogProps} from './types';
import {blogStyles} from './styles';
import {Card} from '../../../../../components';
import Ionicons from 'react-native-vector-icons/Ionicons';

export const Blog: React.FC<BlogProps> = ({
  posts = [],
  onPostPress,
  onViewAllPress,
  style,
}) => {
  const theme = useTheme();
  const colors = theme.colors;

  return (
    <View style={[blogStyles.container, style]}>
      <View style={blogStyles.header}>
        <Text variant="h6" weight="semibold">
          Blog
        </Text>
        <Button
          title="View All"
          variant="ghost"
          size="small"
          onPress={onViewAllPress}
        />
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={blogStyles.scrollContent}>
        {posts.map(post => (
          <Card
            key={post.id}
            style={[
              blogStyles.card,
              {
                overflow: 'hidden',
                padding: 0,
              },
            ]}
            onPress={() => onPostPress?.(post)}>
            {/* IMAGE */}
            <View style={blogStyles.imageWrapper}>
              <Image
                source={{uri: post.image}}
                style={blogStyles.image}
                resizeMode="cover"
                onError={e => console.log('Image error:', e.nativeEvent)} // debug
              />

              <View style={blogStyles.overlay} />

              {/* BADGE */}
              <View style={blogStyles.badge}>
                <Icon
                  library="Ionicons"
                  name="eye-outline"
                  size={12}
                  color="#fff"
                />
                <Text style={blogStyles.metaText}>
                  {Math.floor(Math.random() * 900 + 100)}
                </Text>
              </View>

              {/* TITLE */}
              <View style={blogStyles.imageContent}>
                <Text
                  variant="label"
                  weight="semibold"
                  numberOfLines={2}
                  style={{color: '#fff'}}>
                  {post.title}
                </Text>
              </View>
            </View>

            {/* CONTENT */}
            <View style={blogStyles.content}>
              <Text
                // variant="captionSmall"
                fontSize={14}
                numberOfLines={2}
                style={{color: '#666'}}>
                {post.excerpt}
              </Text>

              <View style={blogStyles.metaRow}>
                <View style={blogStyles.metaItem}>
                  <Text
                    style={[blogStyles.metaText, {color: colors.text.primary}]}>
                    {post.author}
                  </Text>
                </View>
              </View>

              <View style={blogStyles.dateContainer}>
                <Text>Dec 23, 2025</Text>
                <Icon
                  name="arrow-forward"
                  size={26}
                  color={colors.primary.main}
                />
              </View>
            </View>
          </Card>
        ))}
      </ScrollView>
    </View>
  );
};

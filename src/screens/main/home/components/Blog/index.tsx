
// import React from 'react';
// import {View, ScrollView, Image} from 'react-native';
// import {useTheme} from '../../../../../theme';
// import {Text} from '../../../../../components/Text';
// import {Icon} from '../../../../../components/Icon';
// import {Button} from '../../../../../components/Button';
// import {BlogProps} from './types';
// import {blogStyles} from './styles';
// import {Card} from '../../../../../components';
// import Ionicons from 'react-native-vector-icons/Ionicons';

// export const Blog: React.FC<BlogProps> = ({
//   posts = [],
//   onPostPress,
//   onViewAllPress,
//   style,
// }) => {
//   const theme = useTheme();
//   const colors = theme.colors;
//   console.log("all blogs dataata",posts)


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
//           <Card
//             key={post.id}
//             style={[
//               blogStyles.card,
//               {
//                 overflow: 'hidden',
//                 padding: 0,
//               },
//             ]}
//             onPress={() => onPostPress?.(post)}>
//             {/* IMAGE */}
//             <View style={blogStyles.imageWrapper}>
//               <Image
//                 source={{uri: post.image}}
//                 style={blogStyles.image}
//                 resizeMode="cover"
//                 onError={e => console.log('Image error:', e.nativeEvent)} // debug
//               />

//               <View style={blogStyles.overlay} />

//               {/* BADGE */}
//               <View style={blogStyles.badge}>
//                 <Icon
//                   library="Ionicons"
//                   name="eye-outline"
//                   size={12}
//                   color="#fff"
//                 />
//                 <Text style={blogStyles.metaText}>
//                   {Math.floor(Math.random() * 900 + 100)}
//                 </Text>
//               </View>

//               {/* TITLE */}
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
//                 // variant="captionSmall"
//                 fontSize={14}
//                 numberOfLines={2}
//                 style={{color: '#666'}}>
//                 {post.excerpt}
//               </Text>

//               <View style={blogStyles.metaRow}>
//                 <View style={blogStyles.metaItem}>
//                   <Text
//                     style={[blogStyles.metaText, {color: colors.text.primary}]}>
//                     {post.author}
//                   </Text>
//                 </View>
//               </View>

//               <View style={blogStyles.dateContainer}>
//                 <Text>Dec 23, 2025</Text>
//                 <Icon
//                   name="arrow-forward"
//                   size={26}
//                   color={colors.primary.main}
//                 />
//               </View>
//             </View>
//           </Card>
//         ))}
//       </ScrollView>
//     </View>
//   );
// };



import React, { useState } from 'react';
import { View, ScrollView, Image } from 'react-native';
import { useTheme } from '../../../../../theme';
import { Text } from '../../../../../components/Text';
import { Icon } from '../../../../../components/Icon';
import { Button } from '../../../../../components/Button';
import { BlogProps } from './types';
import { blogStyles } from './styles';
import { Card } from '../../../../../components';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { BlogDetailsModal } from './BlogDetailsModal';

export const Blog: React.FC<BlogProps> = ({
  posts = [],
  onPostPress,
  onViewAllPress,
  style,
}) => {
  const theme = useTheme();
  const colors = theme.colors;
  // console.log("all blogs dataata", posts)

  const getImageUrl = (url?: string) => {
    if (!url) return '';

    if (url.startsWith('http')) {
      return url;
    }

    return `https://dhwaniastro.com${url}`;
  };
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const formatDate = (timestamp: string) => {
    return new Date(Number(timestamp)).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };


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
            // onPress={() => onPostPress?.(post)}
            onPress={() => {
              setSelectedBlog(post);
              setShowModal(true);
            }}

          >
            {/* IMAGE */}
            <View style={blogStyles.imageWrapper}>
              <Image
                source={{ uri: getImageUrl(post.featuredImage) }}
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
                  style={{ color: '#fff' }}>
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
                style={{ color: '#666' }}>
                {post.excerpt}
              </Text>

              <View style={blogStyles.metaRow}>
                <View style={blogStyles.metaItem}>
                  <Text
                    style={[blogStyles.metaText, { color: colors.text.primary }]}>
                    {post.author}
                  </Text>
                </View>
              </View>

              <View style={blogStyles.dateContainer}>
                <Text>{formatDate(post.createdAt)}</Text>
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
      <BlogDetailsModal
        visible={showModal}
        blog={selectedBlog}
        onClose={() => {
          setShowModal(false);
          setSelectedBlog(null);
        }}
      />
    </View>
  );
};



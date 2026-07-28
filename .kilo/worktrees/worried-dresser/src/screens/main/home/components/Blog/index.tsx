/**
 * Blog Component
 * Blog section in Home Screen
 */

import React from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useTheme } from '../../../../../theme';
import { Text } from '../../../../../components/Text';
import { Icon } from '../../../../../components/Icon';
import { Button } from '../../../../../components/Button';
import { BlogProps } from './types';
import { blogStyles } from './styles';

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
        contentContainerStyle={blogStyles.scrollContent}
      >
        {posts.map((post) => (
          <TouchableOpacity
            key={post.id}
            style={[blogStyles.card, { backgroundColor: String(colors.card) }]}
            onPress={() => onPostPress?.(post)}
            activeOpacity={0.9}
          >
            <View style={[blogStyles.imagePlaceholder, { backgroundColor: colors.background.secondary }]}>
              {post.imageUrl ? (
                <Icon name="image" size={40} color={colors.icon.secondary} library="MaterialIcons" />
              ) : (
                <Icon name="article" size={40} color={colors.primary.main} library="MaterialIcons" />
              )}
            </View>
            
            <View style={blogStyles.content}>
              <Text variant="label" weight="semibold" numberOfLines={2}>
                {post.title}
              </Text>
              <Text 
                variant="captionSmall" 
                style={{ color: colors.text.secondary, marginTop: 4 }} 
                numberOfLines={2}
              >
                {post.excerpt}
              </Text>
                
              <View style={blogStyles.metaRow}>
                {post.author && (
                  <View style={blogStyles.metaItem}>
                    <Icon name="person" size={12} color={colors.text.secondary} library="MaterialIcons" />
                    <Text variant="captionSmall" style={{ color: colors.text.secondary, marginLeft: 4 }}>
                      {post.author}
                    </Text>
                  </View>
                )}
                {post.readTime && (
                  <View style={blogStyles.metaItem}>
                    <Icon name="schedule" size={12} color={colors.text.secondary} library="MaterialIcons" />
                    <Text variant="captionSmall" style={{ color: colors.text.secondary, marginLeft: 4 }}>
                      {post.readTime}
                    </Text>
                  </View>
                )}
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

export default Blog;


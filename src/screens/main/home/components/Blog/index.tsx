import React, {useMemo, useCallback} from 'react';
import {View, ScrollView, Image, Text as RNText} from 'react-native';
import {useTheme} from '../../../../../theme';
import {Text} from '../../../../../components/Text';
import {Icon} from '../../../../../components/Icon';
import {Button} from '../../../../../components/Button';
import {BlogProps, BlogPost} from './types';
import {blogStyles} from './styles';
import {Card} from '../../../../../components';
import {BlogDetailsModal} from './BlogDetailsModal';

const getImageUrl = (url?: string) => {
  if (!url) {
    return '';
  }

  if (url.startsWith('http')) {
    return url;
  }

  return `https://dhwaniastro.com${url}`;
};

const formatDate = (timestamp: string) => {
  return new Date(Number(timestamp)).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
};

const BlogCard = React.memo(
  ({post, onPress}: {post: BlogPost; onPress: () => void}) => {
    const theme = useTheme();
    const colors = theme.colors;
    const imageUrl = useMemo(
      () => getImageUrl(post.featuredImage),
      [post.featuredImage],
    );
    const dateText = useMemo(
      () => formatDate(post.createdAt),
      [post.createdAt],
    );

    return (
      <Card
        style={[
          blogStyles.card,
          {
            overflow: 'hidden',
            padding: 0,
          },
        ]}
        onPress={onPress}>
        <View style={blogStyles.imageWrapper}>
          <Image
            source={{uri: imageUrl}}
            style={blogStyles.image}
            resizeMode="cover"
            onError={e => console.log('Image error:', e.nativeEvent)}
          />

          <View style={blogStyles.overlay} />

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

        <View style={blogStyles.content}>
          {post.categories?.length > 0 && (
            <View style={blogStyles.categoryContainer}>
              {post.categories.slice(0, 2).map(cat => (
                <View key={cat.id} style={blogStyles.categoryChip}>
                  <Text style={blogStyles.categoryText}>{cat.name}</Text>
                </View>
              ))}
            </View>
          )}

          <View style={blogStyles.dateContainer}>
            <RNText style={{fontSize: 12, color: colors.text.secondary}}>
              {dateText}
            </RNText>
            <Icon name="arrow-forward" size={26} color={colors.primary.main} />
          </View>
        </View>
      </Card>
    );
  },
);

BlogCard.displayName = 'BlogCard';

export const Blog: React.FC<BlogProps> = ({
  posts = [],
  loading = false,
  error,
  onViewAllPress,
  style,
}) => {
  const [selectedBlog, setSelectedBlog] = React.useState<BlogPost | null>(null);
  const [showModal, setShowModal] = React.useState(false);

  const handleCardPress = useCallback((post: BlogPost) => {
    setSelectedBlog(post);
    setShowModal(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setShowModal(false);
    setSelectedBlog(null);
  }, []);

  const renderLoading = useMemo(() => {
    return (
      <View style={blogStyles.loadingContainer}>
        {[1, 2, 3].map(index => (
          <View key={`blog-skeleton-${index}`} style={blogStyles.loadingCard} />
        ))}
      </View>
    );
  }, []);

  const renderError = useMemo(() => {
    if (!error) {
      return null;
    }

    return (
      <View style={blogStyles.errorContainer}>
        <Text style={blogStyles.errorText}>
          {error?.response?.data?.message ||
            error?.message ||
            'Failed to load blogs'}
        </Text>
        <Button
          title="Retry"
          variant="outline"
          size="small"
          onPress={() => {
            console.log('Retry blogs');
          }}
        />
      </View>
    );
  }, [error]);

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

      {loading ? (
        renderLoading
      ) : error ? (
        renderError
      ) : (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={blogStyles.scrollContent}>
          {posts.map(post => (
            <BlogCard
              key={post.id}
              post={post}
              onPress={() => handleCardPress(post)}
            />
          ))}
        </ScrollView>
      )}

      <BlogDetailsModal
        visible={showModal}
        blog={selectedBlog}
        onClose={handleCloseModal}
      />
    </View>
  );
};

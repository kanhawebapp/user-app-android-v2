import React from 'react';
import {
  Modal,
  View,
  ScrollView,
  Image,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  ActivityIndicator,
} from 'react-native';

import Ionicons from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';
import {Text} from '../../../../../components/Text';
import {useBlogBySlug} from '../../../../../services/api/blogs/useBlogBySlug';
import type {BlogDetail} from '../../../../../services/api/blogs/blog.types';

interface Props {
  visible: boolean;
  blog: any;
  onClose: () => void;
}

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
    month: 'long',
    year: 'numeric',
  });
};

export const BlogDetailsModal = ({visible, blog, onClose}: Props) => {
  const {data, loading, error} = useBlogBySlug(blog?.slug);
  const displayBlog: BlogDetail | null = data || (blog as BlogDetail | null);

  const formattedDate = displayBlog ? formatDate(displayBlog.createdAt) : '';

  const imageUrl = displayBlog ? getImageUrl(displayBlog.featuredImage) : '';

  if (!visible) {
    return null;
  }

  if (loading) {
    return (
      <Modal visible={visible} animationType="slide" statusBarTranslucent>
        <StatusBar
          translucent
          backgroundColor="transparent"
          barStyle="light-content"
        />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#7C3AED" />
        </View>
      </Modal>
    );
  }

  if (error || !displayBlog) {
    return (
      <Modal visible={visible} animationType="slide" statusBarTranslucent>
        <StatusBar
          translucent
          backgroundColor="transparent"
          barStyle="light-content"
        />
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>
            {error?.response?.data?.message ||
              error?.message ||
              'Failed to load blog details'}
          </Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Ionicons name="close" size={22} color="#FFF" />
          </TouchableOpacity>
        </View>
      </Modal>
    );
  }

  return (
    <Modal visible={visible} animationType="slide" statusBarTranslucent>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="light-content"
      />

      <View style={styles.container}>
        <View style={styles.heroContainer}>
          <Image source={{uri: imageUrl}} style={styles.heroImage} />

          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.35)', 'rgba(0,0,0,0.8)']}
            style={styles.gradient}
          />

          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Ionicons name="close" size={22} color="#FFF" />
          </TouchableOpacity>

          <View style={styles.categoriesContainer}>
            {displayBlog.categories?.slice(0, 3).map((cat: any) => (
              <View key={cat.id} style={styles.categoryChip}>
                <Text
                  fontSize={11}
                  weight="medium"
                  style={{
                    color: '#FFF',
                  }}>
                  {cat.name}
                </Text>
              </View>
            ))}
          </View>

          <View style={styles.titleContainer}>
            <Text
              variant="h4"
              weight="bold"
              numberOfLines={3}
              style={styles.title}>
              {displayBlog.title}
            </Text>
          </View>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}>
          <View style={styles.metaCard}>
            <View style={styles.metaItem}>
              <Ionicons name="calendar-outline" size={18} color="#7C3AED" />

              <Text fontSize={13} style={styles.metaText}>
                {formattedDate}
              </Text>
            </View>

            <View style={styles.metaDivider} />

            <View style={styles.metaItem}>
              <Ionicons name="reader-outline" size={18} color="#7C3AED" />

              <Text fontSize={13} style={styles.metaText}>
                Blog Article
              </Text>
            </View>
          </View>

          <View style={styles.contentCard}>
            <Text
              variant="h6"
              weight="semibold"
              style={{
                marginBottom: 16,
              }}>
              About this Blog
            </Text>

            <Text style={styles.contentText}>
              {displayBlog.content ||
                'Detailed blog content is not available yet.'}
            </Text>
          </View>

          <View style={{height: 40}} />
        </ScrollView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FD',
  },

  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8F9FD',
  },

  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8F9FD',
    paddingHorizontal: 20,
  },

  errorText: {
    fontSize: 16,
    color: '#FF4D4F',
    textAlign: 'center',
    marginBottom: 20,
  },

  heroContainer: {
    height: 340,
  },

  heroImage: {
    width: '100%',
    height: '100%',
  },

  gradient: {
    ...StyleSheet.absoluteFillObject,
  },

  closeButton: {
    position: 'absolute',
    top: 60,
    right: 20,
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: 'rgba(0,0,0,0.35)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  categoriesContainer: {
    position: 'absolute',
    left: 20,
    top: 60,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },

  categoryChip: {
    backgroundColor: 'rgba(124,58,237,0.85)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 30,
    marginRight: 8,
  },

  titleContainer: {
    position: 'absolute',
    bottom: 30,
    left: 20,
    right: 20,
  },

  title: {
    color: '#FFF',
    lineHeight: 34,
  },

  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },

  metaCard: {
    backgroundColor: '#FFF',
    borderRadius: 20,
    paddingVertical: 16,
    paddingHorizontal: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',

    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: {
      width: 0,
      height: 6,
    },
    elevation: 4,
  },

  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  metaDivider: {
    width: 1,
    height: 22,
    backgroundColor: '#EEE',
  },

  metaText: {
    marginLeft: 8,
    color: '#555',
  },

  contentCard: {
    marginTop: 20,
    backgroundColor: '#FFF',
    borderRadius: 24,
    padding: 20,

    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    shadowOffset: {
      width: 0,
      height: 4,
    },

    elevation: 2,
  },

  contentText: {
    lineHeight: 28,
    fontSize: 15,
    color: '#444',
  },
});

import React, { useCallback, useState } from 'react';
import { View, FlatList, TouchableOpacity, StyleSheet, RefreshControl, Image } from 'react-native';
import { useTheme } from '../../theme';
import { Text } from '../../components/Text';
import { Icon } from '../../components/Icon';
import { Card, GoBack } from '../../components';
import { useBlogs } from '../../services/api/blogs/useBlogs';
import { BlogDetailsModal } from './home/components/Blog/BlogDetailsModal';
import type { Blog } from '../../services/api/blogs/blog.types';
import { API_BASE_URL } from '../../constants/api.constants';

const BlogListingScreen: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const theme = useTheme();
  const colors = theme.colors;
  const { blogs, loading, refresh } = useBlogs();
  const [selectedBlog, setSelectedBlog] = useState<Blog | null>(null);
  const [showModal, setShowModal] = useState(false);
  const baseUrl = API_BASE_URL.DEVELOPMENT

  const getImageUrl = useCallback((url?: string) => {
    if (!url) return '';
    if (url.startsWith('http')) return url;
    return `${baseUrl}${url}`;
  }, []);
  console.log("blogs data", blogs)
  console.log("image url", getImageUrl)

  const formatDate = useCallback((timestamp: string) => {
    return new Date(Number(timestamp)).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  }, []);

  const handleBlogPress = useCallback((blog: Blog) => {
    setSelectedBlog(blog);
    setShowModal(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setShowModal(false);
    setSelectedBlog(null);
  }, []);

  // const renderBlogItem = useCallback(({ item }: { item: Blog }) => (
  //   <Card
  //     style={[styles.card, { overflow: 'hidden', padding: 0 }]}
  //     onPress={() => handleBlogPress(item)}
  //   >
  //     <View style={styles.imageWrapper}>
  //       <Image
  //         source={{ uri: getImageUrl(item.featuredImage) }}
  //         style={styles.image}
  //         resizeMode="cover"
  //       />
  //       <View style={styles.overlay} />
  //       <View style={styles.badge}>
  //         <Icon library="Ionicons" name="eye-outline" size={12} color="#fff" />
  //         <Text style={styles.metaText}>{Math.floor(Math.random() * 900 + 100)}</Text>
  //       </View>
  //       <View style={styles.imageContent}>
  //         <Text variant="label" weight="semibold" numberOfLines={2} style={styles.titleText}>
  //           {item.title}
  //         </Text>
  //       </View>
  //     </View>
  //     <View style={styles.content}>
  //       <View style={styles.metaRow}>
  //         <View style={styles.metaItem}>
  //           <Text style={[styles.metaText, { color: colors.text.primary }]}>
  //             {item.categories?.map(c => c.name).join(', ') || ''}
  //           </Text>
  //         </View>
  //       </View>
  //       <View style={styles.dateContainer}>
  //         <Text>{formatDate(item.createdAt)}</Text>
  //         <Icon name="arrow-forward" size={26} color={colors.primary.main} />
  //       </View>
  //     </View>
  //   </Card>
  // ), [colors, formatDate, getImageUrl, handleBlogPress]);

  const renderBlogItem = ({ item }: { item: Blog }) => {

    const image = getImageUrl(item.featuredImage);

    return (

      <TouchableOpacity
        activeOpacity={0.9}
        style={[
          styles.blogCard,
          {
            backgroundColor: colors.background.secondary,
          },
        ]}
        onPress={() => handleBlogPress(item)}
      >

        <Image
          source={{ uri: image }}
          style={styles.blogImage}
          resizeMode="cover"
          onError={(e) =>
            console.log(
              'Image Error',
              e.nativeEvent.error,
              image,
            )
          }
        />

        <View style={styles.imageOverlay} />

        <View style={styles.categoryChip}>
          <Text style={styles.categoryText}>
            {item.categories?.length
              ? item.categories
                .map((i) => i.name)
                .join(', ')
              : 'Blog'}
          </Text>
        </View>

        <View style={styles.bottomContent}>

          <Text
            numberOfLines={2}
            style={styles.blogTitle}
          >
            {item.title}
          </Text>

          <View style={styles.bottomRow}>

            <View style={styles.dateRow}>
              <Icon
                library="Ionicons"
                name="calendar-outline"
                size={14}
                color="#777"
              />

              <Text style={styles.dateText}>
                {formatDate(item.createdAt)}
              </Text>
            </View>

            <View
              style={[
                styles.readMore,
                {
                  backgroundColor:
                    colors.primary.main,
                },
              ]}
            >
              <Text style={styles.readMoreText}>
                Read
              </Text>

              <Icon
                name="arrow-forward"
                color="#fff"
                size={16}
              />
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background.primary }]}>
     
      <GoBack onBack={onBack} title="All Blogs" />

      <FlatList
        data={blogs}
        keyExtractor={(item) => item.id}
        renderItem={renderBlogItem}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={refresh} tintColor={colors.primary.main} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No Blogs Found</Text>
          </View>
        }
      />

      <BlogDetailsModal
        visible={showModal}
        blog={selectedBlog}
        onClose={handleCloseModal}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
  },
  listContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 30,
  },
  card: {
    marginBottom: 20,
    borderRadius: 16,
  },
  imageWrapper: {
    position: 'relative',
  },
  image: {
    width: '100%',
    height: 180,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.15)',
  },
  badge: {
    position: 'absolute',
    top: 12,
    right: 12,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.4)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  metaText: {
    color: '#fff',
    fontSize: 12,
    marginLeft: 4,
  },
  imageContent: {
    position: 'absolute',
    bottom: 12,
    left: 12,
    right: 12,
  },
  titleText: {
    color: '#fff',
    fontSize: 16,
    lineHeight: 22,
  },
  content: {
    padding: 14,
  },
  metaRow: {
    marginBottom: 10,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  emptyContainer: {
    alignItems: 'center',
    marginTop: 60,
  },
  emptyText: {
    fontSize: 15,
    color: '#777',
  },
  blogCard: {

    borderRadius: 24,

    overflow: "hidden",

    marginBottom: 24,

    elevation: 6,

    shadowColor: "#000",

    shadowOpacity: .12,

    shadowRadius: 12,

    shadowOffset: {
      width: 0,
      height: 5
    }
  },

  blogImage: {

    width: "100%",

    height: 220,

    backgroundColor: "#ECECEC"

  },

  imageOverlay: {

    ...StyleSheet.absoluteFillObject,

    height: 220,

    backgroundColor: "rgba(0,0,0,.20)"

  },

  categoryChip: {

    position: "absolute",

    top: 18,

    left: 18,

    backgroundColor: "#ffffff",

    paddingHorizontal: 14,

    paddingVertical: 7,

    borderRadius: 20

  },

  categoryText: {

    fontWeight: "700",

    fontSize: 12,

    color: "#FF7A00"

  },

  bottomContent: {

    padding: 18

  },

  blogTitle: {

    fontSize: 19,

    fontWeight: "700",

    color: "#1A1A1A",

    lineHeight: 28,

    marginBottom: 14

  },

  bottomRow: {

    flexDirection: "row",

    justifyContent: "space-between",

    alignItems: "center"

  },

  dateRow: {

    flexDirection: "row",

    alignItems: "center"

  },

  dateText: {

    marginLeft: 6,

    color: "#666",

    fontSize: 13

  },

  readMore: {

    flexDirection: "row",

    alignItems: "center",

    paddingHorizontal: 14,

    paddingVertical: 8,

    borderRadius: 50

  },

  readMoreText: {

    color: "#fff",

    fontWeight: "700",

    marginRight: 5

  },
});

export default BlogListingScreen;

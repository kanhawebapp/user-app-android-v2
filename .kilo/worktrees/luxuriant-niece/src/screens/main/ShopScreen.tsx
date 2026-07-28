import React, {useState, useCallback} from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  StatusBar,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useTheme} from '../../theme';
import {Text} from '../../components/Text';
import {Icon} from '../../components/Icon';
import {Button} from '../../components/Button';
import {Card} from '../../components/Card';
import {InputBox} from '../../components/InputBox';
import {LoginRequiredModal} from '../../components/Modal';
import {useAuthStore} from '../../stores';

interface ShopScreenProps {
  onNavigateToLogin?: () => void;
  onNavigateToSignup?: () => void;
}

const categories = [
  {id: 1, name: 'All', icon: 'apps', active: true},
  {id: 2, name: 'Gemstones', icon: 'diamond-stone', active: false},
  {id: 3, name: 'Yantras', icon: 'star-circle', active: false},
  {id: 4, name: 'Books', icon: 'book-open-variant', active: false},
  {id: 5, name: 'Kits', icon: 'package-variant', active: false},
];

const products = [
  {
    id: 1,
    name: 'Blue Sapphire',
    category: 'Gemstones',
    price: 2500,
    rating: 4.5,
    image: null,
  },
  {
    id: 2,
    name: 'Ruby Ring',
    category: 'Gemstones',
    price: 3500,
    rating: 4.8,
    image: null,
  },
  {
    id: 3,
    name: 'Vastu Yantra',
    category: 'Yantras',
    price: 800,
    rating: 4.3,
    image: null,
  },
  {
    id: 4,
    name: 'Hanuman Yantra',
    category: 'Yantras',
    price: 600,
    rating: 4.6,
    image: null,
  },
  {
    id: 5,
    name: 'Vedic Astrology Book',
    category: 'Books',
    price: 450,
    rating: 4.7,
    image: null,
  },
  {
    id: 6,
    name: 'Puja Kit',
    category: 'Kits',
    price: 1200,
    rating: 4.4,
    image: null,
  },
];

const ShopScreen: React.FC<ShopScreenProps> = ({
  onNavigateToLogin,
  onNavigateToSignup,
}) => {
  const theme = useTheme();
  const colors = theme.colors;
  const insets = useSafeAreaInsets();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(1);
  const [cartCount, setCartCount] = useState(2);

  // Get auth state
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);

  // Modal state
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [modalMessage, setModalMessage] = useState(
    'Please login to perform this action',
  );

  // Check if user can perform action
  const handleRestrictedAction = useCallback(
    (actionMessage: string, callback?: () => void) => {
      if (isAuthenticated) {
        callback?.();
        return;
      }
      setModalMessage(actionMessage);
      setShowLoginModal(true);
    },
    [isAuthenticated],
  );

  // Action handlers
  const handleAddToCart = useCallback(() => {
    handleRestrictedAction('Please login to add items to cart');
  }, [handleRestrictedAction]);

  const handleCartPress = useCallback(() => {
    handleRestrictedAction('Please login to view your cart');
  }, [handleRestrictedAction]);

  // Modal handlers
  const handleCloseModal = useCallback(() => {
    setShowLoginModal(false);
  }, []);

  const handleLoginPress = useCallback(() => {
    setShowLoginModal(false);
    onNavigateToLogin?.();
  }, [onNavigateToLogin]);

  const handleSignupPress = useCallback(() => {
    setShowLoginModal(false);
    onNavigateToSignup?.();
  }, [onNavigateToSignup]);

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === 1 ||
      product.category === categories[selectedCategory - 1].name;
    return matchesSearch && matchesCategory;
  });

  const renderCategory = (category: (typeof categories)[0]) => (
    <TouchableOpacity
      key={category.id}
      style={[
        styles.categoryButton,
        selectedCategory === category.id && {
          backgroundColor: colors.primary.main,
        },
      ]}
      onPress={() => setSelectedCategory(category.id)}>
      <Icon
        name={category.icon}
        size={20}
        color={
          selectedCategory === category.id
            ? colors.primary.contrastText
            : colors.icon.secondary
        }
        library="MaterialCommunityIcons"
      />
      <Text
        variant="caption"
        weight="medium"
        style={{
          marginTop: 4,
          color:
            selectedCategory === category.id
              ? colors.primary.contrastText
              : colors.text.secondary,
        }}>
        {category.name}
      </Text>
    </TouchableOpacity>
  );

  const renderProductCard = (product: (typeof products)[0]) => (
    <Card key={product.id} style={styles.productCard}>
      <View
        style={[
          styles.productImage,
          {backgroundColor: colors.background.secondary},
        ]}>
        <Icon
          name="shopping-bag"
          size={32}
          color={colors.icon.tertiary}
          library="Feather"
        />
      </View>
      <View style={styles.productInfo}>
        <Text variant="label" weight="semibold" numberOfLines={1}>
          {product.name}
        </Text>
        <Text variant="captionSmall" style={{color: colors.text.secondary}}>
          {product.category}
        </Text>
        <View style={styles.ratingRow}>
          <Icon
            name="star"
            size={12}
            color={colors.common.yellow[500]}
            library="MaterialIcons"
          />
          <Text variant="captionSmall" style={{marginLeft: 4}}>
            {product.rating}
          </Text>
        </View>
        <View style={styles.priceRow}>
          <Text
            variant="subtitle"
            weight="bold"
            style={{color: colors.primary.main}}>
            ₹{product.price}
          </Text>
          <TouchableOpacity
            style={[styles.addButton, {backgroundColor: colors.primary.main}]}
            onPress={handleAddToCart}>
            <Icon
              name="plus"
              size={16}
              color={colors.primary.contrastText}
              library="MaterialCommunityIcons"
            />
          </TouchableOpacity>
        </View>
      </View>
    </Card>
  );

  return (
    <View
      style={[styles.container, {backgroundColor: colors.background.primary}]}>
      <StatusBar
        barStyle={theme.isDark ? 'light-content' : 'dark-content'}
        backgroundColor={colors.background.primary}
      />

      <View style={[styles.header, {paddingTop: insets.top}]}>
        {/* <View style={styles.headerTop}>
          <View>
            <Text variant="h5" weight="bold">Shop</Text>
            <Text variant="bodySmall" style={{ color: colors.text.secondary }}>
              Astrology products & remedies
            </Text>
          </View>
          <TouchableOpacity style={[styles.cartButton, { backgroundColor: colors.primary.light + '20' }]} onPress={handleCartPress}>
            <Icon name="shopping-cart" size={24} color={colors.primary.main} library="Feather" />
            {cartCount > 0 && (
              <View style={[styles.cartBadge, { backgroundColor: colors.primary.main }]}>
                <Text variant="captionSmall" style={{ color: colors.primary.contrastText }}>{cartCount}</Text>
              </View>
            )}
          </TouchableOpacity>
        </View> */}

        {/* Search */}
        <View style={styles.searchContainer}>
          <InputBox
            placeholder="Search products..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            leftIcon={
              <Icon
                name="search"
                size={20}
                color={colors.icon.secondary}
                library="MaterialIcons"
              />
            }
            containerStyle={{backgroundColor: colors.background.secondary}}
          />
        </View>
      </View>

      {/* Categories */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.categoriesContainer}>
        {categories.map(renderCategory)}
      </ScrollView>

      {/* Products Grid */}
      <FlatList
        data={filteredProducts}
        renderItem={({item}) => renderProductCard(item)}
        keyExtractor={item => item.id.toString()}
        numColumns={2}
        contentContainerStyle={[styles.listContent, {paddingBottom: 100}]}
        showsVerticalScrollIndicator={false}
        columnWrapperStyle={styles.row}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Icon
              name="shopping-bag"
              size={64}
              color={colors.icon.tertiary}
              library="Feather"
            />
            <Text
              variant="body"
              style={{color: colors.text.secondary, marginTop: 16}}>
              No products found
            </Text>
          </View>
        }
      />

      {/* Login Required Modal */}
      <LoginRequiredModal
        visible={showLoginModal}
        onClose={handleCloseModal}
        onLoginPress={handleLoginPress}
        onSignupPress={handleSignupPress}
        message={modalMessage}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  cartButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cartBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchContainer: {
    marginBottom: 8,
  },
  categoriesContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  categoryButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    marginRight: 8,
    backgroundColor: 'transparent',
    minWidth: 70,
  },
  listContent: {
    paddingHorizontal: 16,
  },
  row: {
    justifyContent: 'space-between',
  },
  productCard: {
    width: '48%',
    padding: 12,
    marginBottom: 12,
  },
  productImage: {
    width: '100%',
    height: 100,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  productInfo: {
    flex: 1,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  addButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 60,
  },
});

export default ShopScreen;

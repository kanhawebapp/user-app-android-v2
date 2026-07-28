/**
 * Remedies Screen
 * Screen for displaying astrology remedies and pujas
 */

import React, { useState, useCallback } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  StatusBar,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../../theme';
import { Text } from '../../components/Text';
import { Icon } from '../../components/Icon';
import { Button } from '../../components/Button';
import { Card } from '../../components/Card';
import { InputBox } from '../../components/InputBox';
import { LoginRequiredModal } from '../../components/Modal';
import { useAuthStore } from '../../stores';

interface RemediesScreenProps {
  onNavigateToLogin?: () => void;
  onNavigateToSignup?: () => void;
}

const remedyCategories = [
  { id: 1, name: 'All', icon: 'apps', active: true },
  { id: 2, name: 'Puja', icon: 'temple-buddhist', active: false },
  { id: 3, name: 'Donation', icon: 'charity', active: false },
  { id: 4, name: 'Mantra', icon: 'music-note', active: false },
  { id: 5, name: 'Gemstone', icon: 'diamond-stone', active: false },
];

const remedies = [
  { 
    id: 1, 
    name: 'Kalsarpa Dosha Puja', 
    category: 'Puja',
    description: 'Remedies for Kalsarpa Dosha in Kundli',
    duration: '2 hours',
    price: 5100,
    rating: 4.7,
    image: null 
  },
  { 
    id: 2, 
    name: 'Mangal Dosha Puja', 
    category: 'Puja',
    description: 'Remedies for Mangal Dosha',
    duration: '1.5 hours',
    price: 3100,
    rating: 4.5,
    image: null 
  },
  { 
    id: 3, 
    name: 'Feed Cows - Monday', 
    category: 'Donation',
    description: 'Donation to feed cows on Monday',
    duration: '-',
    price: 1100,
    rating: 4.8,
    image: null 
  },
  { 
    id: 4, 
    name: 'Grah Shanti Puja',
    category: 'Puja',
    description: 'Peaceful puja for all planets',
    duration: '3 hours',
    price: 8100,
    rating: 4.9,
    image: null
  },
  { 
    id: 5, 
    name: 'Om Namo Narayanaya', 
    category: 'Mantra',
    description: ' chant 108 times daily',
    duration: 'Daily',
    price: 0,
    rating: 4.6,
    image: null 
  },
  { 
    id: 6, 
    name: 'Blue Sapphire', 
    category: 'Gemstone',
    description: 'Natural Blue Sapphire for Saturn',
    duration: '-',
    price: 2500,
    rating: 4.5,
    image: null 
  },
];

const RemediesScreen: React.FC<RemediesScreenProps> = ({ 
  onNavigateToLogin,
  onNavigateToSignup 
}) => {
  const theme = useTheme();
  const colors = theme.colors;
  const insets = useSafeAreaInsets();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(1);

  // Get auth state
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  // Modal state
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('Please login to perform this action');

  // Check if user can perform action
  const handleRestrictedAction = useCallback((actionMessage: string, callback?: () => void) => {
    if (isAuthenticated) {
      callback?.();
      return;
    }
    setModalMessage(actionMessage);
    setShowLoginModal(true);
  }, [isAuthenticated]);

  // Action handlers
  const handleBookPress = useCallback(() => {
    handleRestrictedAction('Please login to book remedies and pujas');
  }, [handleRestrictedAction]);

  const handleLearnMorePress = useCallback(() => {
    handleRestrictedAction('Please login to learn more about remedies');
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

  const filteredRemedies = remedies.filter(remedy => {
    const matchesSearch = remedy.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 1 || remedy.category === remedyCategories[selectedCategory - 1].name;
    return matchesSearch && matchesCategory;
  });

  const getCategoryIcon = (icon: string) => {
    return icon === 'temple-buddhist' || icon === 'charity' || icon === 'music-note' || icon === 'diamond-stone' 
      ? 'MaterialCommunityIcons' 
      : 'MaterialIcons';
  };

  const renderCategory = (category: typeof remedyCategories[0]) => (
    <TouchableOpacity
      key={category.id}
      style={[
        styles.categoryButton,
        selectedCategory === category.id && { backgroundColor: colors.primary.main },
      ]}
      onPress={() => setSelectedCategory(category.id)}
    >
      <Icon
        name={category.icon}
        size={20}
        color={selectedCategory === category.id ? colors.primary.contrastText : colors.icon.secondary}
        library={getCategoryIcon(category.icon) as any}
      />
      <Text
        variant="caption"
        weight="medium"
        style={{
          marginTop: 4,
          color: selectedCategory === category.id ? colors.primary.contrastText : colors.text.secondary,
        }}
      >
        {category.name}
      </Text>
    </TouchableOpacity>
  );

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Puja': return { bg: colors.common.purple[50] || '#f3e5f5', text: colors.common.purple[500] || '#9c27b0' };
      case 'Donation': return { bg: colors.common.green[50] || '#e8f5e9', text: colors.common.green[500] || '#4caf50' };
      case 'Mantra': return { bg: colors.common.orange[50] || '#fff3e0', text: colors.common.orange[500] || '#ff9800' };
      case 'Gemstone': return { bg: colors.common.blue[50] || '#e3f2fd', text: colors.common.blue[500] || '#2196f3' };
      default: return { bg: colors.primary.light + '20', text: colors.primary.main };
    }
  };

  const renderRemedyCard = (remedy: typeof remedies[0]) => {
    const categoryColor = getCategoryColor(remedy.category);
    
    return (
      <Card key={remedy.id} style={styles.remedyCard}>
        <View style={styles.remedyHeader}>
          <View style={[styles.categoryBadge, { backgroundColor: categoryColor.bg }]}>
            <Text variant="captionSmall" weight="medium" style={{ color: categoryColor.text }}>
              {remedy.category}
            </Text>
          </View>
          <View style={styles.ratingContainer}>
            <Icon name="star" size={14} color={colors.common.yellow[500]} library="MaterialIcons" />
            <Text variant="captionSmall" weight="medium" style={{ marginLeft: 4 }}>{remedy.rating}</Text>
          </View>
        </View>
        
        <Text variant="subtitle" weight="semibold" style={{ marginTop: 8 }}>{remedy.name}</Text>
        <Text variant="bodySmall" style={{ color: colors.text.secondary, marginTop: 4 }} numberOfLines={2}>
          {remedy.description}
        </Text>
        
        <View style={styles.remedyFooter}>
          <View style={styles.durationContainer}>
            <Icon name="schedule" size={14} color={colors.text.secondary} library="MaterialIcons" />
            <Text variant="captionSmall" style={{ color: colors.text.secondary, marginLeft: 4 }}>
              {remedy.duration}
            </Text>
          </View>
          <View style={styles.priceContainer}>
            {remedy.price > 0 ? (
              <>
                <Text variant="subtitle" weight="bold" style={{ color: colors.primary.main }}>₹{remedy.price}</Text>
                <Button
                  title="Book"
                  variant="primary"
                  size="small"
                  style={{ marginLeft: 12 }}
                  onPress={handleBookPress}
                />
              </>
            ) : (
              <Button
                title="Learn More"
                variant="outline"
                size="small"
                onPress={handleLearnMorePress}
              />
            )}
          </View>
        </View>
      </Card>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background.primary }]}>
      <StatusBar
        barStyle={theme.isDark ? 'light-content' : 'dark-content'}
        backgroundColor={colors.background.primary}
      />
      
      <View style={[styles.header, { paddingTop: insets.top + 16 }]}>
        <Text variant="h5" weight="bold">Remedies</Text>
        <Text variant="bodySmall" style={{ color: colors.text.secondary, marginTop: 4 }}>
          Astrological solutions & pujas
        </Text>
      </View>

      {/* Search */}
      <View style={styles.searchContainer}>
        <InputBox
          placeholder="Search remedies..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          leftIcon={
            <Icon name="search" size={20} color={colors.icon.secondary} library="MaterialIcons" />
          }
          containerStyle={{ backgroundColor: colors.background.secondary }}
        />
      </View>

      {/* Categories */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.categoriesContainer}
      >
        {remedyCategories.map(renderCategory)}
      </ScrollView>

      {/* Remedies List */}
      <FlatList
        data={filteredRemedies}
        renderItem={({ item }) => renderRemedyCard(item)}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={[styles.listContent, { paddingBottom: 100 }]}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Icon name="spa" size={64} color={colors.icon.tertiary} library="MaterialIcons" />
            <Text variant="body" style={{ color: colors.text.secondary, marginTop: 16 }}>
              No remedies found
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
  searchContainer: {
    paddingHorizontal: 16,
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
  remedyCard: {
    padding: 16,
    marginBottom: 12,
  },
  remedyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  categoryBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  remedyFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 16,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  durationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 60,
  },
});

export default RemediesScreen;


import React, { useState } from 'react';
import {
  View,
  FlatList,
  TouchableOpacity,
  Image,
  StyleSheet,
  Alert,
} from 'react-native';
import { Text } from '../../../components/Text';
import { colors } from '../../../theme';
import { API_BASE_URL } from '../../../constants/api.constants';
import { useAstrologerList } from '../../../services/api/healingServices/astrologerList/useAstrologerList';

const BASE_IMAGE_URL = API_BASE_URL.DEVELOPMENT;
const ASTROLOGER_LIST_FILTERS = {page: 1, limit: 20};

export interface Astrologer {
  id: string;
  profilePic?: string;
  name: string;
  experience: number;
  rating: number;
  skills: string[];
  languages: string[];
}

interface SelectAstrologerScreenProps {
  onBack: () => void;
  onContinue: (astrologer: Astrologer) => void;
}

const SelectAstrologerScreen: React.FC<SelectAstrologerScreenProps> = ({
  onBack,
  onContinue,
}) => {
  const {astrologers, loading} = useAstrologerList(ASTROLOGER_LIST_FILTERS);

  const [selectedAstrologer, setSelectedAstrologer] = useState<Astrologer | null>(null);

  const handleContinue = () => {
    if (!selectedAstrologer) {
      Alert.alert('Selection Required', 'Please select an astrologer to continue');
      return;
    }
    onContinue(selectedAstrologer);
  };

  const renderAstrologer = ({ item }: { item: Astrologer }) => {
    const selected = selectedAstrologer?.id === item.id;

    return (
      <TouchableOpacity
        style={[
          styles.card,
          selected && styles.selectedCard,
        ]}
        onPress={() => setSelectedAstrologer(item)}
      >
        <Image
          source={{
            uri: `${BASE_IMAGE_URL}${item.profilePic}`,
          }}
          style={styles.avatar}
        />

        <View style={styles.infoContainer}>
          <View style={styles.nameRow}>
            <Text style={styles.name} weight="semibold">
              {item.name}
            </Text>
            <View style={styles.ratingBadge}>
              <Text style={styles.ratingText}>
                ⭐ {item.rating || 0}
              </Text>
            </View>
          </View>

          <Text style={styles.experience}>
            {item.experience} years experience
          </Text>

          <Text style={styles.detailLabel}>Skills:</Text>
          <Text style={styles.detailText} numberOfLines={1}>
            {item.skills?.join(', ') || 'Not specified'}
          </Text>

          <Text style={styles.detailLabel}>Languages:</Text>
          <Text style={styles.detailText} numberOfLines={1}>
            {item.languages?.join(', ') || 'Not specified'}
          </Text>
        </View>

        {selected && (
          <View style={styles.checkmark}>
            <Text style={styles.checkmarkText}>✓</Text>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backIcon}>
          <Text style={styles.backIconText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle} weight="semibold">
          Select Astrologer
        </Text>
      </View>

      <FlatList
        data={astrologers}
        keyExtractor={item => item.id}
        renderItem={renderAstrologer}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              {loading ? 'Loading astrologers...' : 'No astrologers available'}
            </Text>
          </View>
        }
      />

      <View style={styles.footer}>
        <TouchableOpacity
          style={[
            styles.continueButton,
            !selectedAstrologer && styles.disabledButton,
          ]}
          onPress={handleContinue}
          disabled={!selectedAstrologer}
        >
          <Text style={styles.continueText} weight="semibold">
            Continue to Payment
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F8FC',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#fff',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  backIcon: {
    marginRight: 16,
  },
  backIconText: {
    fontSize: 22,
    color: colors.primary.main,
  },
  headerTitle: {
    fontSize: 20,
    color: '#1F1F2E',
  },
  listContent: {
    padding: 16,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 14,
    marginBottom: 12,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  selectedCard: {
    borderColor: colors.primary.main,
    borderWidth: 2,
  },
  avatar: {
    width: 70,
    height: 70,
    borderRadius: 35,
    marginRight: 14,
    backgroundColor: '#F0F0F0',
  },
  infoContainer: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  name: {
    fontSize: 16,
    color: '#1F1F2E',
    flex: 1,
  },
  ratingBadge: {
    backgroundColor: '#FFF8E1',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  ratingText: {
    fontSize: 12,
    color: '#FFA000',
  },
  experience: {
    fontSize: 12,
    color: '#6B6B80',
    marginBottom: 8,
  },
  detailLabel: {
    fontSize: 11,
    color: '#888',
    marginTop: 4,
  },
  detailText: {
    fontSize: 12,
    color: '#444',
    marginTop: 2,
  },
  checkmark: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: colors.primary.main,
    borderRadius: 12,
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkmarkText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
  },
  footer: {
    padding: 16,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  continueButton: {
    backgroundColor: colors.primary.main,
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: 'center',
  },
  disabledButton: {
    opacity: 0.5,
  },
  continueText: {
    color: '#fff',
    fontSize: 16,
  },
  emptyContainer: {
    alignItems: 'center',
    marginTop: 60,
  },
  emptyText: {
    fontSize: 15,
    color: '#777',
  },
});

export default SelectAstrologerScreen;
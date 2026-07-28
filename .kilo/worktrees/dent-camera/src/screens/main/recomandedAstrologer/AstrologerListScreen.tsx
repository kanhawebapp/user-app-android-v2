import React, {useState, useCallback} from 'react';
import {
  FlatList,
  View,
  ActivityIndicator,
  TouchableOpacity,
  Text,
  StyleSheet,
} from 'react-native';
import {useAstrologers} from '../../../services/api/recomandedAstrologer/astrologer.hooks';
import AstrologerCard from './AstrologerCard';
import AstrologerProfileScreen from '../astrologerProfile';
import {ChatRequestModal, ChatRequestData} from '../../../components/Modal';
import type {Astrologer} from '../../../services/api/recomandedAstrologer/astrologer.types';

interface AstrologerListScreenProps {
  onBack?: () => void;
}

const AstrologerListScreen: React.FC<AstrologerListScreenProps> = ({
  onBack,
}) => {
  const {data, loading, loadMore} = useAstrologers();

  const [selectedAstrologer, setSelectedAstrologer] =
    useState<Astrologer | null>(null);
  const [showChatRequestModal, setShowChatRequestModal] = useState(false);
  const [chatTargetAstrologer, setChatTargetAstrologer] =
    useState<Astrologer | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCardPress = useCallback((astrologer: Astrologer) => {
    setSelectedAstrologer(astrologer);
  }, []);

  const handleChatPress = useCallback((astrologer: Astrologer) => {
    setChatTargetAstrologer(astrologer);
    setShowChatRequestModal(true);
  }, []);

  const handleAddPress = useCallback((astrologer: Astrologer) => {
    console.log('Add/Follow astrologer:', astrologer.name);
  }, []);

  const handleBackFromProfile = useCallback(() => {
    setSelectedAstrologer(null);
  }, []);

  const handleProfileChatPress = useCallback((astrologer: Astrologer) => {
    setSelectedAstrologer(null);
    setChatTargetAstrologer(astrologer);
    setShowChatRequestModal(true);
  }, []);

  const handleChatRequestSubmit = useCallback(
    async (_data: ChatRequestData) => {
      if (!chatTargetAstrologer) {
        return;
      }
      setIsSubmitting(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      setIsSubmitting(false);
      setShowChatRequestModal(false);
      setChatTargetAstrologer(null);
      console.log('Chat started with:', chatTargetAstrologer.name);
    },
    [chatTargetAstrologer],
  );

  if (selectedAstrologer) {
    return (
      <AstrologerProfileScreen
        astrologer={selectedAstrologer}
        onBack={handleBackFromProfile}
        onChatPress={handleProfileChatPress}
      />
    );
  }

  return (
    <View style={{flex: 1}}>
      {onBack && (
        <View style={styles.header}>
          <TouchableOpacity onPress={onBack} style={styles.backButton}>
            <Text style={styles.backText}>← Back</Text>
          </TouchableOpacity>
        </View>
      )}
      <FlatList
        data={data}
        keyExtractor={item => item.id}
        numColumns={2}
        renderItem={({item}) => (
          <View style={{flex: 1, margin: 6}}>
            <AstrologerCard
              item={item}
              onPress={() => handleCardPress(item)}
              onChatPress={() => handleChatPress(item)}
              onAddPress={() => handleAddPress(item)}
            />
          </View>
        )}
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={
          loading ? <ActivityIndicator style={{margin: 10}} /> : null
        }
      />

      <ChatRequestModal
        visible={showChatRequestModal}
        onClose={() => {
          setShowChatRequestModal(false);
          setChatTargetAstrologer(null);
        }}
        onSubmit={handleChatRequestSubmit}
        astrologer={chatTargetAstrologer}
        loading={isSubmitting}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    padding: 16,
    backgroundColor: '#fff',
  },
  backButton: {
    paddingVertical: 8,
    paddingRight: 16,
  },
  backText: {
    fontSize: 16,
    color: '#000',
    fontWeight: '600',
  },
});

export default AstrologerListScreen;

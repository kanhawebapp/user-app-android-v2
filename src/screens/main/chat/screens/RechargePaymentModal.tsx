import React, { useState } from 'react';
import {
  View,
  Text,
  Modal,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';

interface RechargePack {
  id: string;
  name: string;
  description: string;
  price: number;
  talktime: number;
  coins?: number;
  isFirstTimeOffer?: boolean;
  isFirstTimeOfferUsed?: boolean;
}

interface Props {
  visible: boolean;
  onClose: () => void;
  rechargePacks: RechargePack[];
  loading: boolean;
  onProceed: (pack: RechargePack) => void;
}

const RechargePaymentModal: React.FC<Props> = ({
  visible,
  onClose,
  rechargePacks,
  loading,
  onProceed,
}) => {
  const [selectedPack, setSelectedPack] = useState<RechargePack | null>(null);

  const renderItem = ({ item }: { item: RechargePack }) => {
    const isSelected = selectedPack?.id === item.id;

    const isFirstTimeOffer = item.isFirstTimeOffer === true;
    const isFirstTimeOfferUsed = item.isFirstTimeOfferUsed === true;
    const showFirstTimeOfferBadge =
      isFirstTimeOffer && !isFirstTimeOfferUsed;

    const isOfferUsed =
      isFirstTimeOffer && isFirstTimeOfferUsed;

    // Display logic (all values come from the live API response):
    //  - Used first-time offer: API-provided talktime value
    //  - Unused first-time offer / normal pack: API-provided coins value
    const displayTalktime = isOfferUsed
      ? item.talktime
      : item.coins;

    return (
      <TouchableOpacity
        style={[styles.card, isSelected && styles.selectedCard]}
        onPress={() => setSelectedPack(item)}>
        <View style={styles.row}>
          <Text style={styles.packName}>{item.name}</Text>
          <Text style={styles.price}>₹{item.price}</Text>
        </View>

        <Text style={styles.desc}>{item.description}</Text>

        <View style={styles.footer}>
          <Text style={styles.talktime}>
            Talktime: ₹{displayTalktime}
          </Text>
        </View>

        {showFirstTimeOfferBadge && (
          <View style={styles.offerBadge}>
            <Text style={styles.offerBadgeText}>First Time Offer</Text>
          </View>
        )}

        {isOfferUsed && (
          <Text style={styles.usedOfferText} numberOfLines={2}>
            First time offer already used
          </Text>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Recharge Packs</Text>
            <TouchableOpacity onPress={onClose}>
              <Text style={styles.close}>✕</Text>
            </TouchableOpacity>
          </View>

          {/* Content */}
          {loading ? (
            <ActivityIndicator size="large" />
          ) : (
            <FlatList
              data={rechargePacks}
              keyExtractor={item => item.id}
              renderItem={renderItem}
              showsVerticalScrollIndicator={false}
            />
          )}

          {/* Footer Button */}
          <TouchableOpacity
            style={[styles.payButton, !selectedPack && { opacity: 0.5 }]}
            disabled={!selectedPack}
            onPress={() => selectedPack && onProceed(selectedPack)}>
            <Text style={styles.payText}>
              Proceed to Pay {selectedPack ? `₹${selectedPack.price}` : ''}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'flex-end',
  },
  container: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 16,
    maxHeight: '80%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',

  },
  close: {
    fontSize: 18,
    color: '#000'
  },
  card: {
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#eee',
    marginBottom: 12,
  },
  selectedCard: {
    borderColor: '#6C5CE7',
    backgroundColor: '#F4F2FF',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  packName: {
    fontSize: 16,
    fontWeight: '600',
    color: "#000"
  },
  price: {
    fontSize: 16,
    fontWeight: 'bold',
    color: "#000"

  },
  desc: {
    fontSize: 12,
    color: '#444',
    marginVertical: 6,
  },
  footer: {
    marginTop: 6,
  },
  talktime: {
    fontSize: 13,
    color: '#444',
  },
  payButton: {
    backgroundColor: '#6C5CE7',
    padding: 14,
    borderRadius: 12,
    marginTop: 10,
    alignItems: 'center',
  },
  payText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  offerBadge: {
    marginTop: 6,
    backgroundColor: '#FFF3E0',
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 2,
    alignSelf: 'flex-start',
  },
  offerBadgeText: {
    fontSize: 11,
    color: '#F57C00',
    fontWeight: '600',
  },
  usedOfferText: {
    marginTop: 6,
    fontSize: 12,
    color: '#D32F2F',
    fontWeight: '600',
  },
});

export default RechargePaymentModal;

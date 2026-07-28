import React, {useState} from 'react';
import {
  View,
  Text,
  Modal,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import {RechargePack} from '../../../../services/api/recharge/recharge.types';

interface RechargePaymentModalProps {
  visible: boolean;
  onClose: () => void;
  rechargePacks: RechargePack[];
  loading: boolean;
  onProceed: (pack: RechargePack) => void;
}

const RechargePaymentModal: React.FC<RechargePaymentModalProps> = ({
  visible,
  onClose,
  rechargePacks,
  loading,
  onProceed,
}) => {
  const [selectedPack, setSelectedPack] = useState<RechargePack | null>(null);

  const renderItem = ({item}: {item: RechargePack}) => {
    const isSelected = selectedPack?.id === item.id;

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
          <Text style={styles.talktime}>🎙 {item.talktime} mins talktime</Text>
        </View>
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
            style={[styles.payButton, !selectedPack && {opacity: 0.5}]}
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
    backgroundColor: 'rgba(0,0,0,0.6)',
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
  },
  close: {
    fontSize: 18,
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
  },
  price: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  desc: {
    fontSize: 12,
    color: '#777',
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
});

export default RechargePaymentModal;

import React, { useState } from 'react';
import {
  FlatList,
  Image,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { API_BASE_URL } from '../../../../constants/api.constants';
import { colors } from '../../../../theme';


const BASE_IMAGE_URL =
  API_BASE_URL.DEVELOPMENT;

interface Props {
  visible: boolean;
  astrologers: any[];
  onClose: () => void;
  onContinue: (astrologer: any) => void;
  onSubmit:any
}

const SelectAstrologerModal = ({
  visible,
  astrologers,
  onClose,
  onContinue,
  onSubmit
}: Props) => {
  const [selectedAstrologer, setSelectedAstrologer] =
    useState<any>(null);

  const renderItem = ({ item }: any) => {
    const selected =
      selectedAstrologer?.id === item.id;

    return (
      <TouchableOpacity
        style={[
          styles.card,
          selected && styles.selectedCard,
        ]}
        onPress={() =>
          setSelectedAstrologer(item)
        }
      >
        <Image
          source={{
            uri: `${BASE_IMAGE_URL}${item.profilePic}`,
          }}
          style={styles.image}
        />

        <View style={{ flex: 1 }}>
          <Text style={styles.name}>
            {item.displayName || item.name || 'Astrologer'}
          </Text>

          <Text style={styles.info}>
            Experience: {item.experience} Years
          </Text>

          <Text style={styles.info}>
            Languages:
            {' '}
            {item.languages?.join(', ')}
          </Text>

          <Text style={styles.info}>
            Skills:
            {' '}
            {item.skills?.join(', ')}
          </Text>

          <Text style={styles.rating}>
            ⭐ {item.rating || 0}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          <Text style={styles.title}>
            Select Astrologer
          </Text>

          <FlatList
            data={astrologers}
            keyExtractor={item => item.id}
            renderItem={renderItem}
          />

          <TouchableOpacity
            disabled={!selectedAstrologer}
            style={[
              styles.button,
              !selectedAstrologer &&
                styles.disabledButton,
            ]}
            onPress={() =>
              onContinue(selectedAstrologer)
            }
          >
            <Text style={styles.buttonText}>
              Continue
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.cancelButton}
            onPress={onClose}
          >
            <Text>
              Cancel
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default SelectAstrologerModal;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor:
      'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },

  container: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '85%',
    padding: 20,
  },

  title: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 20,
    textAlign: 'center',
  },

  card: {
    flexDirection: 'row',
    padding: 12,
    borderWidth: 1,
    borderColor: '#eee',
    borderRadius: 14,
    marginBottom: 12,
  },

  selectedCard: {
    borderColor: colors.primary.main,
    borderWidth: 2,
  },

  image: {
    width: 70,
    height: 70,
    borderRadius: 35,
    marginRight: 12,
  },

  name: {
    fontWeight: '700',
    fontSize: 16,
  },

  info: {
    color: '#666',
    marginTop: 2,
  },

  rating: {
    marginTop: 4,
  },

  button: {
    backgroundColor:
      colors.primary.main,
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10,
  },

  disabledButton: {
    opacity: 0.5,
  },

  buttonText: {
    color: '#fff',
    fontWeight: '700',
  },

  cancelButton: {
    marginTop: 12,
    alignItems: 'center',
  },
});
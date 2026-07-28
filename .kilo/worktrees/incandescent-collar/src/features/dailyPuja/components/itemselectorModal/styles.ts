import { StyleSheet } from 'react-native';

export const itemSelectorModalStyle = StyleSheet.create({
  modalContent: {
    maxHeight: '80%',
    paddingHorizontal: 0,
    paddingBottom: 20,
   
  },
  selectedContainer: {
    margin: 16,
    marginBottom: 10,
    padding: 12,
    borderRadius: 12,
    borderWidth: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
  },
  selectedLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 8,
    fontWeight: '600',
  },
  selectedItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  selectedIconBg: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  selectedImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  selectedTextContainer: {
    marginLeft: 12,
  },
  selectedName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
  },
  selectedNameHindi: {
    fontSize: 13,
    color: '#666',
    marginTop: 2,
  },
  optionsContainer: {
    maxHeight: 350,
  },
  optionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 12,
    justifyContent: 'center',
  },
  optionItem: {
    margin: 5,
    padding: 12,
    borderRadius: 12,
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  optionIconBg: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
    overflow: 'hidden',
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
  },
  optionGlow: {
    position: 'absolute',
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  optionImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  optionName: {
    fontSize: 12,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
  },
  optionNameHindi: {
    fontSize: 10,
    color: '#666',
    textAlign: 'center',
    marginTop: 2,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },

  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#222',
  },

  closeButton: {
    padding: 6,
    borderRadius: 20,
  },
});

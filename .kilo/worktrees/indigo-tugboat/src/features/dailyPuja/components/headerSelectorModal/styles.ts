import { StyleSheet } from 'react-native';

export const headerSelectorModalStyle = StyleSheet.create({
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
    borderColor: '#b9935a',
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
    width: 80,
    height: 50,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    backgroundColor: '#f5f5f5',
  },
  selectedImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  selectedTextContainer: {
    marginLeft: 12,
    flex: 1,
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
    maxHeight: 300,
  },
  optionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 12,
    justifyContent: 'center',
  },
  optionItem: {
    margin: 6,
    padding: 8,
    borderRadius: 12,
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderWidth: 2,
    borderColor: 'transparent',
    width: '30%',
  },
  optionIconBg: {
    width: '100%',
    height: 60,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
    overflow: 'hidden',
    backgroundColor: '#f5f5f5',
  },
  optionGlow: {
    position: 'absolute',
    width: 70,
    height: 70,
    borderRadius: 35,
  },
  optionImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  optionName: {
    fontSize: 11,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
  },
  optionNameHindi: {
    fontSize: 9,
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


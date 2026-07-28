import { StyleSheet } from "react-native";


export const godSelectorModalStyle = StyleSheet.create({
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
  selectedImage: {
    width: 52,
    height: 52,
    borderRadius: 26,
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
    width: '30%',
    margin: 5,
    padding: 8,
    borderRadius: 12,
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  optionImage: {
    width: 56,
    height: 56,
    borderRadius: 28,
    marginBottom: 6,
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
});
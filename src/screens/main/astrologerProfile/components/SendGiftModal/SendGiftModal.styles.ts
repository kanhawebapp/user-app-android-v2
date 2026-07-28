import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  // Scroll styles
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },

  // Section styles
  section: {
    marginHorizontal: 16,
    marginBottom: 20,
  },
  sectionTitle: {
    marginBottom: 12,
  },
  section2: {
    marginHorizontal: 20,
    marginBottom: 200
  },

  // Button Container
  buttonContainer: {
    paddingHorizontal: 16,
    paddingVertical: 20,
    gap: 12,
    backgroundColor: 'transparent',
    zIndex: 999
  },

  button: {
    width: '100%',
  },


  //////
  modalSheet: {
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    maxHeight: '92%',
    overflow: 'hidden',
    backgroundColor: 'white',
  },

  header: {
    paddingTop: 10,
    paddingHorizontal: 20,
    paddingBottom: 18,
  },

  dragHandle: {
    width: 48,
    height: 5,
    borderRadius: 10,
    backgroundColor: '#D8D8D8',
    alignSelf: 'center',
    marginBottom: 18,
  },

  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  closeButton: {
    height: 38,
    width: 38,
    borderRadius: 19,
    justifyContent: 'center',
    alignItems: 'center',
  },

  tab: {
    flex: 1,
    height: 42,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
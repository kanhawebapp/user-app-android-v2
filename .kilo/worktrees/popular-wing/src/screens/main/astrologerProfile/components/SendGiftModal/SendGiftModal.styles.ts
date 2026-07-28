import {StyleSheet} from 'react-native';

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
  section2:{
    marginHorizontal:20,
    marginBottom:200
  },

  // Button Container
  buttonContainer: {
    paddingHorizontal: 16,
    paddingVertical: 20,
    gap: 12,
    backgroundColor: 'transparent',
    zIndex:999
  },

  button: {
    width: '100%',
  },
});
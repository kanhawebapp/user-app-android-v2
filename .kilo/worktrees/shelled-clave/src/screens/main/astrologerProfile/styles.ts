import {StyleSheet} from 'react-native';
import {colors} from '../../../theme';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerContainer: {
    padding: 10,
    backgroundColor: colors.primary.light,
    borderBottomLeftRadius: 100,
    borderBottomRightRadius: 100,
  },
  scrollContent: {
    paddingBottom: 32,
  },

  infoSection: {
    paddingHorizontal: 16,
    marginTop: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 12,
  },
  infoCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
  },
  pricingContainer: {
    gap: 16,
  },

  actionContainer: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 24,
    gap: 12,
  },
  actionButton: {
    flex: 1,
    height: 58,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  callActionButton: {
    borderWidth: 1,
    borderColor: colors.primary.main,
  },
  chatActionButton: {
    // backgroundColor: colors.primary.main,
    borderWidth: 1,
    borderColor: colors.primary.main,
  },
  actionButtonText: {
    color: colors.primary.main,
    marginLeft: 8,
    fontWeight: '800',
    fontSize: 15,
  },
});

export default styles;

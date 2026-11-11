import {StyleSheet} from 'react-native';
import {colors} from '../../../theme';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerContainer: {
    padding: 10,
    paddingBottom: 16,
    backgroundColor: colors.primary.light,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
  },
  scrollView: {
    flex: 1,
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
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    backgroundColor: colors.common.white,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  pricingCard: {
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: colors.common.white,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  statusPill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    marginRight: 14,
  },
  statusPillText: {
    fontSize: 13,
    fontWeight: '700',
  },
  pricingDivider: {
    width: 1,
    height: 28,
    backgroundColor: '#E5E7EB',
    marginHorizontal: 12,
  },
  pricingText: {
    fontSize: 13,
    fontWeight: '600',
  },
  pricingRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    flexWrap: 'wrap',
  },
  aboutText: {
    fontSize: 15,
    lineHeight: 24,
  },
  readMoreRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    gap: 2,
  },
  readMoreText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary.main,
  },
  aboutDivider: {
    height: 1,
    backgroundColor: '#E5E7EB',
    marginVertical: 14,
  },
  aboutStatsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  aboutStatItem: {
    flex: 1,
    alignItems: 'center',
  },
  aboutStatValue: {
    fontSize: 16,
    fontWeight: '800',
  },
  aboutStatLabel: {
    marginTop: 2,
    fontSize: 13,
  },
  aboutStatDivider: {
    width: 1,
    height: 36,
    backgroundColor: '#E5E7EB',
  },
  pricingContainer: {
    gap: 10,
  },

  actionContainer: {
    paddingHorizontal: 16,
    paddingTop: 10,
    gap: 10,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 8,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    borderRadius: 10,
  },
  callActionButton: {
    borderWidth: 1.5,
    borderColor: colors.primary.main,
    backgroundColor: colors.common.white,
  },
  chatActionButton: {
    borderWidth: 1.5,
    borderColor: colors.primary.main,
    backgroundColor: colors.common.white,
  },
  actionButtonText: {
    color: colors.primary.main,
    marginLeft: 4,
    fontWeight: '700',
    fontSize: 13,
  },
  chatPriceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  currentPriceText: {
    fontWeight: '700',
  },
  oldPriceText: {
    color: colors.text.primary ,
    fontSize: 12,
    fontWeight: '500',
    textDecorationLine: 'line-through',
    opacity: 0.55,
  },
  disabledBtn: {
    opacity: 0.5,
  },
});

export default styles;

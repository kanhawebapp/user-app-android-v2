/**
 * AstrologerCard Styles
 */

import { StyleSheet } from 'react-native';
import { colors } from '../../../../../theme';

export const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    padding: 14,
    marginBottom: 14,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  avatarContainer: {
    position: 'relative',
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#EDE7F6',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    padding: 2,
    borderColor: colors.primary.main,
  },
  avatarImage: {
    height: '100%',
    width: '100%',
    borderRadius: 50,
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#4CAF50',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  offlineIndicator: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#9E9E9E',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  busyIndicator: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#FF9800',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  infoContainer: {
    flex: 1,
    marginLeft: 12,
    minWidth: 0,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  name: {
    fontSize: 16,
    fontWeight: '700',
    color: '#2D1B4E',
    flexShrink: 1,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  starIcon: {
    fontSize: 13,
    marginRight: 3,
  },
  rating: {
    fontSize: 13,
    fontWeight: '500',
    color: '#6B6B80',
  },
  reviewCount: {
    fontSize: 12,
    color: '#666666',
    marginLeft: 2,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    marginTop: 4,
  },
  statsText: {
    fontSize: 12,
    color: '#8A8A9A',
  },
  statsSeparator: {
    fontSize: 12,
    color: '#C5C5D0',
    marginHorizontal: 6,
  },
  experienceContainer: {
    marginTop: 4,
  },
  experience: {
    fontSize: 13,
    color: '#666666',
  },
  languageContainer: {
    marginTop: 3,
  },
  language: {
    fontSize: 13,
    color: '#8A8A9A',
  },
  skillsText: {
    fontSize: 13,
    color: '#8A8A9A',
    marginTop: 2,
  },
  priceRow: {
    flexDirection: 'row',
    marginTop: 8,
    gap: 12,
  },
  priceItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  priceLabel: {
    fontSize: 12,
    color: '#666666',
    marginRight: 4,
  },
  priceValue: {
    fontSize: 14,
    fontWeight: '700',
    color: '#5B2CA5',
  },
  skillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 12,
    gap: 6,
  },
  skillBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: '#EDE7F6',
  },
  skillText: {
    fontSize: 12,
    color: '#6200EE',
    fontWeight: '500',
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 14,
    gap: 20,
  },
  priceBlock: {
    flexDirection: 'row',
    alignItems: 'center',
    flexShrink: 1,
    flexWrap: 'wrap',
    gap: 6,
  },
  currentPrice: {
    fontSize: 15,
    fontWeight: '700',
    color: '#2D1B4E',
  },
  oldPrice: {
    fontSize: 13,
    color: '#9E9E9E',
    textDecorationLine: 'line-through',
  },
  actionButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
    flexShrink: 0,
  },
  chatButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
    paddingHorizontal: 18,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#5B2CA5',
    minWidth: 80,
  },
  chatButtonDisabled: {
    backgroundColor: '#BDBDBD',
  },
  callButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
    paddingHorizontal: 18,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#5B2CA5',
    minWidth: 80,
  },
  callButtonDisabled: {
    borderColor: '#BDBDBD',
    backgroundColor: '#F5F5F5',
  },
  buttonIcon: {
    marginRight: 6,
  },
  buttonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  chatButtonText: {
    color: '#FFFFFF',
  },
  callButtonText: {
    color: '#6102e6',
  },
  callButtonTextDisabled: {
    color: '#9E9E9E',
  },
  profileButton: {
    marginTop: 10,
    alignItems: 'center',
    paddingVertical: 8,
  },
  profileButtonText: {
    fontSize: 14,
    color: 'rgb(98, 0, 238)',
    fontWeight: '500',
  },
});

export default styles;

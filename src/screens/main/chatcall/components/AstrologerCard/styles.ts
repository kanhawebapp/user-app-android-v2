/**
 * AstrologerCard Styles
 */

import {StyleSheet} from 'react-native';
import {colors} from '../../../../../theme';

export const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  cardContent: {
    flexDirection: 'row',
  },
  avatarContainer: {
    position: 'relative',
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#EDE7F6',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    padding: 2,
    borderColor: colors.primary.light,
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: 22,
    right: 5,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#4CAF50',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  offlineIndicator: {
    position: 'absolute',
    bottom: 22,
    right: 5,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#9E9E9E',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  busyIndicator: {
    position: 'absolute',
    bottom: 22,
    right: 5,
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
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  starIcon: {
    width: 14,
    height: 14,
    marginRight: 4,
  },
  rating: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  reviewCount: {
    fontSize: 12,
    color: '#666666',
    marginLeft: 2,
  },
  experienceContainer: {
    marginTop: 4,
  },
  experience: {
    fontSize: 13,
    color: '#666666',
  },
  languageContainer: {
    marginTop: 4,
  },
  language: {
    fontSize: 13,
    color: '#666666',
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
    color: '#6200EE',
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
  actionButtons: {
    flexDirection: 'row',
    marginTop: 16,
    gap: 10,
  },
  chatButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#6200EE',
  },
  chatButtonDisabled: {
    backgroundColor: '#BDBDBD',
  },
  callButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#6200EE',
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

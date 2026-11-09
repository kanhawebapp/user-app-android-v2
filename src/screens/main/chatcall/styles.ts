import {StyleSheet} from 'react-native';
import {colors} from '../../../theme';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F7FB',
  },

  header: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#EAE6EF',
  },

  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1A1A1A',
  },

  headerSubtitle: {
    fontSize: 14,
    color: '#77717F',
  },

  tabsContainer: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#EAE6EF',
  },

  tabsRow: {
    flexDirection: 'row',
    gap: 12,
  },

  tabButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 10,
    backgroundColor: '#F5F3F8',
    borderWidth: 1,
    borderColor: '#EFECF3',
  },

  tabButtonActive: {
    backgroundColor: '#6200EE',
    borderColor: '#6200EE',
    elevation: 3,
    shadowColor: '#6200EE',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },

  tabIcon: {
    marginRight: 8,
  },

  tabText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#666666',
  },

  tabTextActive: {
    color: '#FFFFFF',
  },

  searchContainer: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 12,
    backgroundColor: '#F8F7FB',
    gap: 10,
  },

  searchInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 14,
    height: 48,
    borderWidth: 1,
    borderColor: '#E8E3EE',
    shadowColor: '#302044',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.04,
    shadowRadius: 5,
    elevation: 1,
  },

  searchIcon: {
    marginRight: 10,
  },

  searchInput: {
    flex: 1,
    fontSize: 15,
    color: '#1A1A1A',
    paddingVertical: 0,
  },

  filterToggleContainer: {
    paddingHorizontal: 16,
    paddingBottom: 12,
  },

  filterToggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  filterInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  filterCount: {
    fontSize: 14,
    color: '#666666',
  },

  filterCountHighlight: {
    color: '#6200EE',
    fontWeight: '600',
  },

  filterToggleButton: {
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    backgroundColor: colors.primary.light,
    borderWidth: 1,
    borderColor: '#E6D9F5',
    shadowColor: '#6200EE',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },

  filterToggleText: {
    fontSize: 14,
    color: '#6200EE',
    fontWeight: '500',
    marginLeft: 6,
  },

  filterSection: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#EAE6EF',
  },

  listContent: {
    paddingHorizontal: 16,
    paddingTop: 4,
    paddingBottom: 100,
  },

  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },

  emptyIcon: {
    marginBottom: 16,
  },

  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 8,
  },

  emptySubtitle: {
    fontSize: 14,
    color: '#666666',
    textAlign: 'center',
    paddingHorizontal: 32,
  },

  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },

  loadingText: {
    fontSize: 14,
    color: '#666666',
    marginTop: 12,
  },
});

export default styles;
/**
 * Session History Screen
 * Shows chat and call session history with astrologers
 */

import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../../theme';
import { Text } from '../../components/Text';
import { Icon } from '../../components/Icon';
import { Card } from '../../components/Card';

interface SessionHistoryScreenProps {
  onNavigateBack?: () => void;
}

const SessionHistoryScreen: React.FC<SessionHistoryScreenProps> = ({ onNavigateBack }) => {
  const theme = useTheme();
  const colors = theme.colors;
  const insets = useSafeAreaInsets();
  
  const [activeTab, setActiveTab] = useState<'all' | 'chat' | 'call'>('all');

  const sessions = [
    { 
      id: '1', 
      type: 'chat', 
      astrologerName: 'Astrologer Rahul', 
      astrologerImage: null,
      duration: '15 min 30 sec',
      amount: 155,
      date: '2024-01-15',
      status: 'completed',
      rating: 4.5,
    },
    { 
      id: '2', 
      type: 'call', 
      astrologerName: 'Astrologer Priya', 
      astrologerImage: null,
      duration: '8 min 45 sec',
      amount: 175,
      date: '2024-01-14',
      status: 'completed',
      rating: 5,
    },
    { 
      id: '3', 
      type: 'chat', 
      astrologerName: 'Astrologer Amit', 
      astrologerImage: null,
      duration: '22 min 10 sec',
      amount: 220,
      date: '2024-01-13',
      status: 'completed',
      rating: 4,
    },
    { 
      id: '4', 
      type: 'call', 
      astrologerName: 'Astrologer Sneha', 
      astrologerImage: null,
      duration: '5 min 0 sec',
      amount: 100,
      date: '2024-01-12',
      status: 'cancelled',
      rating: null,
    },
    { 
      id: '5', 
      type: 'chat', 
      astrologerName: 'Astrologer Vikram', 
      astrologerImage: null,
      duration: '18 min 20 sec',
      amount: 183,
      date: '2024-01-11',
      status: 'completed',
      rating: 4.8,
    },
  ];

  const filteredSessions = activeTab === 'all' 
    ? sessions 
    : sessions.filter(s => s.type === activeTab);

  return (
    <View style={[styles.container, { backgroundColor: colors.background.primary }]}>
      <StatusBar
        barStyle={theme.isDark ? 'light-content' : 'dark-content'}
        backgroundColor={colors.background.primary}
      />
      
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.background.primary, paddingTop: insets.top }]}>
        <TouchableOpacity onPress={onNavigateBack} style={styles.backButton}>
          <Icon name="arrow-back" size={24} color={colors.icon.primary} library="MaterialIcons" />
        </TouchableOpacity>
        <Text variant="h6" weight="semibold" style={{ color: colors.text.primary }}>
          Session History
        </Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + 100 }
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Stats Summary */}
        <View style={styles.statsContainer}>
          <Card style={styles.statCard}>
            <Icon name="chat" size={24} color={colors.primary.main} library="MaterialIcons" />
            <Text variant="h5" weight="bold" style={{ color: colors.text.primary, marginTop: 8 }}>12</Text>
            <Text variant="captionSmall" style={{ color: colors.text.secondary }}>Chat Sessions</Text>
          </Card>
          <Card style={styles.statCard}>
            <Icon name="call" size={24} color={colors.secondary.main} library="MaterialIcons" />
            <Text variant="h5" weight="bold" style={{ color: colors.text.primary, marginTop: 8 }}>8</Text>
            <Text variant="captionSmall" style={{ color: colors.text.secondary }}>Call Sessions</Text>
          </Card>
          <Card style={styles.statCard}>
            <Icon name="access-time" size={24} color={colors.common.orange[500]} library="MaterialIcons" />
            <Text variant="h5" weight="bold" style={{ color: colors.text.primary, marginTop: 8 }}>2.5h</Text>
            <Text variant="captionSmall" style={{ color: colors.text.secondary }}>Total Time</Text>
          </Card>
        </View>

        {/* Filter Tabs */}
        <View style={[styles.tabContainer, { backgroundColor: colors.background.secondary }]}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'all' && { backgroundColor: colors.primary.main }]}
            onPress={() => setActiveTab('all')}
          >
            <Text variant="bodySmall" weight="medium" style={{ color: activeTab === 'all' ? colors.common.white : colors.text.secondary }}>All</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'chat' && { backgroundColor: colors.primary.main }]}
            onPress={() => setActiveTab('chat')}
          >
            <Text variant="bodySmall" weight="medium" style={{ color: activeTab === 'chat' ? colors.common.white : colors.text.secondary }}>Chat</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'call' && { backgroundColor: colors.primary.main }]}
            onPress={() => setActiveTab('call')}
          >
            <Text variant="bodySmall" weight="medium" style={{ color: activeTab === 'call' ? colors.common.white : colors.text.secondary }}>Call</Text>
          </TouchableOpacity>
        </View>

        {/* Session List */}
        <View style={styles.sessionList}>
          {filteredSessions.map((session, index) => (
            <Card key={session.id} style={styles.sessionCard}>
              <View style={styles.sessionHeader}>
                <View style={[styles.astrologerAvatar, { backgroundColor: colors.primary.light + '30' }]}>
                  <Icon name="person" size={24} color={colors.primary.main} library="MaterialIcons" />
                </View>
                <View style={styles.sessionInfo}>
                  <Text variant="body" weight="semibold" style={{ color: colors.text.primary }}>
                    {session.astrologerName}
                  </Text>
                  <View style={styles.sessionMeta}>
                    <View style={[
                      styles.typeBadge, 
                      { backgroundColor: session.type === 'chat' ? colors.primary.light + '20' : colors.secondary.light + '20' }
                    ]}>
                      <Icon 
                        name={session.type === 'chat' ? 'chat' : 'call'} 
                        size={12} 
                        color={session.type === 'chat' ? colors.primary.main : colors.secondary.main} 
                        library="MaterialIcons" 
                      />
                      <Text variant="captionSmall" style={{ color: session.type === 'chat' ? colors.primary.main : colors.secondary.main, marginLeft: 4 }}>
                        {session.type === 'chat' ? 'Chat' : 'Call'}
                      </Text>
                    </View>
                    <Text variant="captionSmall" style={{ color: colors.text.tertiary, marginLeft: 8 }}>
                      {session.date}
                    </Text>
                  </View>
                </View>
                <View style={[
                  styles.statusBadge,
                  { backgroundColor: session.status === 'completed' ? colors.success.light + '20' : colors.error.light + '20' }
                ]}>
                  <Text variant="captionSmall" weight="medium" style={{ color: session.status === 'completed' ? colors.success.main : colors.error.main }}>
                    {session.status === 'completed' ? 'Completed' : 'Cancelled'}
                  </Text>
                </View>
              </View>
              
              <View style={[styles.sessionDetails, { borderTopColor: colors.border.light }]}>
                <View style={styles.detailItem}>
                  <Icon name="schedule" size={16} color={colors.text.secondary} library="MaterialIcons" />
                  <Text variant="captionSmall" style={{ color: colors.text.secondary, marginLeft: 4 }}>{session.duration}</Text>
                </View>
                <View style={styles.detailItem}>
                  <Icon name="attach-money" size={16} color={colors.text.secondary} library="MaterialIcons" />
                  <Text variant="captionSmall" style={{ color: colors.text.secondary, marginLeft: 4 }}>₹{session.amount}</Text>
                </View>
                {session.rating && (
                  <View style={styles.detailItem}>
                    <Icon name="star" size={16} color={colors.common.yellow[500]} library="MaterialIcons" />
                    <Text variant="captionSmall" style={{ color: colors.text.secondary, marginLeft: 4 }}>{session.rating}</Text>
                  </View>
                )}
              </View>
            </Card>
          ))}
          
          {filteredSessions.length === 0 && (
            <View style={styles.emptyState}>
              <Icon name="history" size={48} color={colors.icon.tertiary} library="MaterialIcons" />
              <Text variant="body" style={{ color: colors.text.secondary, marginTop: 12 }}>No sessions found</Text>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  backButton: {
    padding: 8,
    marginLeft: -8,
  },
  placeholder: {
    width: 40,
  },
  scrollContent: {
    padding: 16,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    padding: 16,
    marginHorizontal: 4,
  },
  tabContainer: {
    flexDirection: 'row',
    borderRadius: 8,
    padding: 4,
    marginBottom: 16,
  },
  tab: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 6,
  },
  sessionList: {
    marginTop: 4,
  },
  sessionCard: {
    padding: 16,
    marginBottom: 12,
  },
  sessionHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  astrologerAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sessionInfo: {
    flex: 1,
    marginLeft: 12,
  },
  sessionMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  typeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  sessionDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  emptyState: {
    alignItems: 'center',
    padding: 32,
  },
});

export default SessionHistoryScreen;


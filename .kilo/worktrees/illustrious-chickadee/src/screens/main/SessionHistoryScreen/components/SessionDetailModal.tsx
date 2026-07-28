import React from 'react';
import {View, StyleSheet, Image, TouchableOpacity} from 'react-native';
import {useTheme} from '../../../../theme';
import {Text} from '../../../../components/Text';
import {Icon} from '../../../../components/Icon';
import {Modal} from '../../../../components/Modal';
import {
  Session,
  SessionStatus,
} from '../../../../services/api/sessions/sessions.types';

interface SessionDetailModalProps {
  visible: boolean;
  onClose: () => void;
  session: Session | null;
}

const STATUS_COLORS: Record<
  SessionStatus,
  {bg: string; text: string; gradient: string[]}
> = {
  COMPLETED: {
    bg: '#22C55E' + '20',
    text: '#22C55E',
    gradient: ['#22C55E', '#10B981'],
  },
  ONGOING: {
    bg: '#F59E0B' + '20',
    text: '#F59E0B',
    gradient: ['#F59E0B', '#F97316'],
  },
  CANCELLED: {
    bg: '#EF4444' + '20',
    text: '#EF4444',
    gradient: ['#EF4444', '#DC2626'],
  },
  SCHEDULED: {
    bg: '#3B82F6' + '20',
    text: '#3B82F6',
    gradient: ['#3B82F6', '#2563EB'],
  },
};

const getStatusLabel = (status: SessionStatus): string => {
  const labels: Record<SessionStatus, string> = {
    COMPLETED: 'Completed',
    ONGOING: 'Ongoing',
    CANCELLED: 'Cancelled',
    SCHEDULED: 'Scheduled',
  };
  return labels[status];
};

const formatTime = (ms: string): string => {
  if (!ms) return '-';
  return new Date(Number(ms)).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const formatDuration = (seconds: number): string => {
  if (!seconds || seconds === 0) return '0s';
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  if (mins === 0) return `${secs}s`;
  return `${mins}m ${secs}s`;
};

const formatRate = (rate: number): string => {
  return `₹${rate}/min`;
};

interface DetailRowProps {
  icon: string;
  label: string;
  value: string;
  valueColor?: string;
}

const DetailRow: React.FC<DetailRowProps> = ({
  icon,
  label,
  value,
  valueColor,
}) => {
  const {colors} = useTheme();
  return (
    <View style={styles.detailRow}>
      <View style={styles.detailLabelRow}>
        <View
          style={[
            styles.iconContainer,
            {backgroundColor: colors.primary.light + '40'},
          ]}>
          <Icon name={icon} size={16} color={colors.primary.main} />
        </View>
        <Text
          variant="bodySmall"
          style={{color: colors.text.secondary, marginLeft: 12}}>
          {label}
        </Text>
      </View>
      <Text
        variant="body"
        weight="semibold"
        style={{color: valueColor || colors.text.primary}}>
        {value}
      </Text>
    </View>
  );
};

interface DetailSectionProps {
  title: string;
  children: React.ReactNode;
}

const DetailSection: React.FC<DetailSectionProps> = ({title, children}) => {
  const {colors} = useTheme();
  return (
    <View style={styles.detailSection}>
      <View style={styles.sectionHeader}>
        <View
          style={[
            styles.sectionIndicator,
            {backgroundColor: colors.primary.main},
          ]}
        />
        <Text
          variant="captionSmall"
          weight="bold"
          style={{
            color: colors.text.tertiary,
            textTransform: 'uppercase',
            letterSpacing: 1.5,
          }}>
          {title}
        </Text>
      </View>
      <View
        style={[
          styles.sectionContent,
          {backgroundColor: colors.background.secondary + '60'},
        ]}>
        {children}
      </View>
    </View>
  );
};

interface CloseButtonProps {
  onPress: () => void;
}

const CloseButton: React.FC<CloseButtonProps> = ({onPress}) => {
  const {colors} = useTheme();
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        styles.closeButtonWrapper,
        {backgroundColor: colors.background.tertiary},
      ]}
      activeOpacity={0.7}>
      <Icon name="close" size={20} color={colors.text.secondary} />
    </TouchableOpacity>
  );
};

export const SessionDetailModal: React.FC<SessionDetailModalProps> = ({
  visible,
  onClose,
  session,
}) => {
  const {colors, isDark} = useTheme();

  if (!session) return null;

  const statusColors = STATUS_COLORS[session.status] || STATUS_COLORS.COMPLETED;

  return (
    <Modal
      visible={visible}
      onClose={onClose}
      showCloseButton={false}
      title=""
      animationType="fade"
      dismissOnBackdropPress={true}
      style={styles.modalWrapper}>
      <View
        style={[
          styles.modalContent,
          {backgroundColor: colors.background.primary},
        ]}>
        <View style={styles.dragIndicator} />

        <View style={styles.headerSection}>
          <CloseButton onPress={onClose} />
        </View>

        <View
          style={[
            styles.astrologerCard,
            {backgroundColor: colors.card.background},
          ]}>
          <View style={styles.astrologerInfo}>
            {session.astrologerImage ? (
              <Image
                source={{uri: session.astrologerImage}}
                style={styles.avatar}
              />
            ) : (
              <View
                style={[
                  styles.avatar,
                  styles.avatarPlaceholder,
                  {backgroundColor: colors.primary.light},
                ]}>
                <Icon name="person" size={28} color={colors.primary.main} />
              </View>
            )}
            <View style={styles.astrologerDetails}>
              <Text
                variant="h6"
                weight="bold"
                style={{color: colors.text.primary}}>
                {session.astrologerName || 'Astrologer'}
              </Text>
              <Text
                variant="bodySmall"
                style={{color: colors.text.secondary, marginTop: 2}}>
                Session ID: #{session.id?.slice(-8) || 'N/A'}
              </Text>
            </View>
            <View
              style={[styles.statusBadge, {backgroundColor: statusColors.bg}]}>
              <Text
                variant="captionSmall"
                weight="bold"
                style={{
                  color: statusColors.text,
                  letterSpacing: 0.5,
                }}>
                {getStatusLabel(session.status)}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.dividerContainer}>
          <View
            style={[styles.dividerLine, {backgroundColor: colors.border.light}]}
          />
        </View>

        <DetailSection title="Time Details">
          <DetailRow
            icon="schedule"
            label="Started At"
            value={formatTime(session.startedAt)}
          />
          <DetailRow
            icon="schedule"
            label="Ended At"
            value={formatTime(session.endedAt)}
          />
          <DetailRow
            icon="timer"
            label="Duration"
            value={formatDuration(session.durationSec)}
          />
        </DetailSection>

        <DetailSection title="Billing">
          <DetailRow
            icon="payments"
            label="Rate Per Minute"
            value={formatRate(session.ratePerMin)}
          />
          <DetailRow
            icon="account-balance-wallet"
            label="Rate Per Second"
            value={`₹${session.ratePerSecond?.toFixed(2) || '0.00'}`}
          />
          <DetailRow
            icon="payments"
            label="Total Charge"
            value={`₹${session.totalCharge}`}
            valueColor={colors.primary.main}
          />
        </DetailSection>

        <DetailSection title="Earnings">
          <DetailRow
            icon="star"
            label="Coins Earned"
            value={`${session.coinsEarned || 0}`}
            valueColor="#EAB308"
          />
          <DetailRow
            icon="account-balance"
            label="Commission"
            value={`₹${session.commission || 0}`}
            valueColor={colors.primary.main}
          />
        </DetailSection>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalWrapper: {
    margin: 0,
  },
  modalContent: {
    maxHeight: '95%',
    paddingBottom: 34,
    paddingHorizontal: 0,
  },
  dragIndicator: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#D1D5DB',
    alignSelf: 'center',
    marginTop: 12,
    marginBottom: 8,
  },
  headerSection: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    // paddingHorizontal: 20,
    // marginBottom: 8,
    marginTop: -26,
  },
  closeButtonWrapper: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  astrologerCard: {
    marginHorizontal: 20,
    padding: 16,
    borderRadius: 16,
    marginTop: 8,
  },
  astrologerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
  },
  avatarPlaceholder: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  astrologerDetails: {
    flex: 1,
    marginLeft: 14,
  },
  statusBadge: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 16,
  },
  dividerContainer: {
    paddingHorizontal: 20,
    marginVertical: 20,
  },
  dividerLine: {
    height: 1,
  },
  detailSection: {
    marginTop: 8,
    paddingHorizontal: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionIndicator: {
    width: 3,
    height: 14,
    borderRadius: 2,
    marginRight: 10,
  },
  sectionContent: {
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  detailLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 28,
    height: 28,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default SessionDetailModal;

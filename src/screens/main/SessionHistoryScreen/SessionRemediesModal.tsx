import React from 'react';
import {
  Modal,
  View,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import { Icon, Text, useTheme } from '../../../components';


interface Remedy {
  id: string;
  sessionId: string;
  remedyText: string;
  createdAt: string;
}

interface SessionRemediesModalProps {
  visible: boolean;
  loading: boolean;
  remedies: Remedy[];
  onClose: () => void;
}

const formatDate = (ms: string) => {
  if (!ms) {
    return '-';
  }

  return new Date(Number(ms)).toLocaleString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
};

const SessionRemediesModal: React.FC<SessionRemediesModalProps> = ({
  visible,
  loading,
  remedies,
  onClose,
}) => {
  const {colors, isDark} = useTheme();
  const insets = useSafeAreaInsets();

  const renderItem = ({item}: {item: Remedy}) => (
    <View
      style={[
        styles.remedyCard,
        {
          backgroundColor: colors.background.primary,
          borderColor: isDark
            ? colors.border.dark
            : colors.border.light,
        },
      ]}>
      <View style={styles.iconContainer}>
        <View
          style={[
            styles.iconCircle,
            {backgroundColor: colors.primary.main + '15'},
          ]}>
          <Icon
            name="medical-services"
            size={22}
            color={colors.primary.main}
          />
        </View>
      </View>

      <View style={styles.content}>
        <Text
          variant="body"
          weight="medium"
          style={{color: colors.text.primary}}>
          Remedy
        </Text>

        <Text
          variant="bodySmall"
          style={{
            color: colors.text.secondary,
            marginTop: 8,
            lineHeight: 22,
          }}>
          {item.remedyText}
        </Text>

        <View style={styles.dateRow}>
          <Icon
            name="schedule"
            size={14}
            color={colors.text.secondary}
          />
          <Text
            variant="captionSmall"
            style={{
              color: colors.text.secondary,
              marginLeft: 6,
            }}>
            {formatDate(item.createdAt)}
          </Text>
        </View>
      </View>
    </View>
  );

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      statusBarTranslucent
      onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View
          style={[
            styles.container,
            {
              backgroundColor: colors.background.secondary,
              paddingBottom: Math.max(insets.bottom, 16),
            },
          ]}>
          {/* Header */}

          <View
            style={[
              styles.header,
              {
                borderBottomColor: isDark
                  ? colors.border.dark
                  : colors.border.light,
              },
            ]}>
            <Text
              weight="bold"
              style={{color: colors.text.primary}}>
              My Remedies
            </Text>

            <TouchableOpacity
              activeOpacity={0.8}
              onPress={onClose}
              style={[
                styles.closeButton,
                {
                  backgroundColor: colors.background.primary,
                },
              ]}>
              <Icon
                name="close"
                size={22}
                color={colors.text.primary}
              />
            </TouchableOpacity>
          </View>

          {loading ? (
            <View style={styles.loaderContainer}>
              <ActivityIndicator
                size="large"
                color={colors.primary.main}
              />
            </View>
          ) : remedies?.length > 0 ? (
            <FlatList
              data={remedies}
              renderItem={renderItem}
              keyExtractor={item => item.id}
              contentContainerStyle={styles.listContent}
              showsVerticalScrollIndicator={false}
            />
          ) : (
            <View style={styles.emptyContainer}>
              <Icon
                name="medical-services"
                size={60}
                color={colors.text.secondary}
              />

              <Text
                weight="semibold"
                style={{
                  color: colors.text.primary,
                  marginTop: 16,
                }}>
                No Remedies Found
              </Text>

              <Text
                variant="bodySmall"
                style={{
                  color: colors.text.secondary,
                  marginTop: 8,
                  textAlign: 'center',
                  paddingHorizontal: 24,
                }}>
                No remedies are available for this session.
              </Text>
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
};

export default SessionRemediesModal;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'flex-end',
  },

  container: {
    height: '75%',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 18,
    borderBottomWidth: 1,
  },

  closeButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    justifyContent: 'center',
    alignItems: 'center',
  },

  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  listContent: {
    padding: 16,
  },

  remedyCard: {
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,
    flexDirection: 'row',
    elevation: 2,
  },

  iconContainer: {
    marginRight: 14,
  },

  iconCircle: {
    width: 46,
    height: 46,
    borderRadius: 23,
    justifyContent: 'center',
    alignItems: 'center',
  },

  content: {
    flex: 1,
  },

  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 14,
  },

  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
});
import React from 'react';
import { View, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { RechargePack } from '../../../../../services/api/recharge/recharge.types';
import { useTheme } from '../../../../../theme';
import { Text, Icon } from '../../../../../components';

interface RechargePackCardProps {
  pack: RechargePack;
  isSelected: boolean;
  onSelect: (pack: RechargePack) => void;
}

export const RechargePackCard: React.FC<RechargePackCardProps> = ({
  pack,
  isSelected,
  onSelect,
}) => {
  const theme = useTheme();
  const colors = theme.colors;

  const isRecommended = pack.price === 499;
  const isBestValue = pack.price >= 1999;

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={() => onSelect(pack)}
      style={[
        styles.container,
        {
          borderColor: isSelected ? colors.primary.main : colors.border.light,

          backgroundColor: isSelected
            ? colors.primary.light
            : colors.background.primary,

          // premium shadow
          shadowColor: isSelected ? colors.primary.main : '#000',
        },
      ]}>
      {/* 🔥 TOP BADGE */}
      {(isRecommended || isBestValue) && (
        <View
          style={[
            styles.badge,
            {
              backgroundColor: isRecommended
                ? colors.success.main
                : colors.warning.main,
            },
          ]}>
          <Text style={styles.badgeText}>
            {isRecommended ? 'Recommended' : 'Best Value'}
          </Text>
        </View>
      )}

      {/* 💰 PRICE */}
      <View style={styles.priceRow}>
        <Text
          // variant="h6"
          // weight="bodySmall"
          style={{
            color: isSelected ? colors.primary.main : colors.text.primary,
          }}>
          ₹{pack.price}
        </Text>

        {isSelected && (
          <View
            style={[styles.checkIcon, { backgroundColor: colors.primary.main }]}>
            <Icon name="check" size={12} color="#fff" />
          </View>
        )}
      </View>

      {/* 📊 TALKTIME */}
      <Text
        variant="bodySmall"
        style={{
          color: colors.text.secondary,
          marginTop: 2,
        }}>
        Talktime: ₹{pack.talktime}
      </Text>

      {/* 📝 DESCRIPTION */}
      {/* {pack.description && (
        <Text
          variant="captionSmall"
          numberOfLines={2}
          style={{
            color: colors.text.tertiary,
            marginTop: 4,
            lineHeight: 16,
          }}>
          {pack.description}
        </Text>
      )} */}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    minWidth: 120,
    borderWidth: 1.2,
    borderRadius: 16,
    padding: 8,
    margin: 8,

    // Premium shadow
    ...Platform.select({
      ios: {
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.12,
        shadowRadius: 10,
      },
      android: {
        elevation: 1.3,
      },
    }),
  },

  badge: {
    position: 'absolute',
    top: -10,
    right: 10,
    paddingHorizontal: 2,
    paddingVertical: 1,
    borderRadius: 6,
    zIndex: 10,
  },

  badgeText: {
    fontSize: 10,
    color: '#fff',
    fontWeight: '500',
  },

  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  checkIcon: {
    width: 16,
    height: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginBottom: -15,
  },
});

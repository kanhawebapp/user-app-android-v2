import React, { useCallback } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { colors, useTheme } from '../../../../../theme';
import { Text } from '../../../../../components/Text';
import { Icon } from '../../../../../components/Icon';
import { WALLET_LABELS, DEFAULTS } from '../../../../../constants/app.constants';
import { Button } from '../../../../../components';
import { useWalletTransactions } from '../../../../../services/api/walletTransactions/walletTransactions.hooks';
import type { WalletTransaction } from '../../../../../services/api/walletTransactions/walletTransactions.types';

const TransactionItem = ({ item, colors }: any) => {
  const isCredit = item.type === 'CREDIT';
  // Generate/display 8-digit transaction ID from UUID
  const transactionId = item.id
    ? item.id.replace(/-/g, '').slice(0, 8).toUpperCase()
    : 'N/A';

  const transactionDate = new Date(Number(item.createdAt));
  return (
    <View style={styles.transactionItem}>
      <View style={styles.transactionLeft}>
        <View
          style={[
            styles.transactionIcon,
            {
              backgroundColor:
                (isCredit ? colors.success.light : colors.error.light) + '20',
            },
          ]}>
          <Icon
            name={isCredit ? 'arrow-up-right' : 'arrow-down-left'}
            size={18}
            color={isCredit ? colors.success.main : colors.error.main}
            library="Feather"
          />
        </View>



        <View style={styles.transactionInfo}>
          <Text
            variant="body"
            weight="medium"
            style={{ color: colors.text.primary }}>
            {item.description ||
              (isCredit
                ? WALLET_LABELS.WALLET_RECHARGE
                : WALLET_LABELS.SERVICE_PAYMENT)}
          </Text>

          {!isCredit && item.astrologerName ? (
            <Text
              variant="bodySmall"
              style={{
                color: colors.text.secondary,
              }}>
              with {item.astrologerName}
            </Text>
          ) : null}

          {/* Date + Time */}
          <Text
            variant="captionSmall"
            style={{
              color: colors.text.tertiary,
              marginTop: 2,
            }}>
            {transactionDate.toLocaleDateString('en-IN', {
              day: 'numeric',
              month: 'short',
              year: 'numeric',
            })}{' '}
            •{' '}
            {transactionDate.toLocaleTimeString('en-IN', {
              hour: '2-digit',
              minute: '2-digit',
              hour12: true,
            })}
          </Text>

          {/* 8 Digit Transaction ID */}
          <Text
            variant="captionSmall"
            style={{
              color: colors.text.tertiary,
              marginTop: 2,
            }}>
            Transaction ID: {transactionId}
          </Text>
        </View>

      </View>

      <Text
        variant="body"
        weight="semibold"
        style={{
          color: isCredit ? colors.success.main : colors.error.main,
        }}>
        {isCredit ? '+' : '-'}
        {DEFAULTS.CURRENCY}
        {item.coins ?? item.amount}
      </Text>
    </View>
  );
};

const TransactionList = ({ onRechargePress }: any) => {
  const { colors } = useTheme();

  const { data, loading, applyFilter, loadMore } = useWalletTransactions();
  console.log("data>>>", data)
  const [activeTab, setActiveTab] = React.useState<'all' | 'credit' | 'debit'>(
    'all',
  );

  // 🔥 HANDLE TAB CHANGE
  const handleTabChange = (tab: 'all' | 'credit' | 'debit') => {
    setActiveTab(tab);

    if (tab === 'credit') {
      applyFilter('CREDIT');
    } else if (tab === 'debit') {
      applyFilter('DEBIT');
    } else {
      applyFilter(null);
    }
  };

  const renderItem = ({ item }: { item: WalletTransaction }) => (
    <TransactionItem item={item} colors={colors} />
  );

  const keyExtractor = (item: WalletTransaction) => item.id;

  const renderFooter = () => {
    if (!loading) {
      return null;
    }
    return <ActivityIndicator style={{ marginVertical: 16 }} />;
  };

  const TabButton = ({ label, value }: any) => {
    const isActive = activeTab === value;

    return (
      <TouchableOpacity
        style={[
          styles.tab,
          {
            backgroundColor: isActive
              ? colors.primary.main
              : colors.primary.light,
          },
        ]}
        onPress={() => handleTabChange(value)}>
        <Text
          variant="bodySmall"
          weight="semibold"
          style={{
            color: isActive ? '#fff' : colors.text.secondary,
          }}>
          {label}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {/* RECHARGE BUTTON */}
      <Button
        title={WALLET_LABELS.RECHARGE}
        variant="primary"
        size="large"
        onPress={onRechargePress}
      />

      {/* HEADER */}
      <View style={styles.filterTextCont}>
        <Text
          variant="h6"
          weight="semibold"
          style={{ color: colors.text.primary }}>
          {WALLET_LABELS.TRANSACTION_HISTORY}
        </Text>
      </View>

      {/* TABS */}
      <View style={styles.tabContainer}>
        <TabButton label="All" value="all" />
        <TabButton label="Credit" value="credit" />
        <TabButton label="Debit" value="debit" />
      </View>

      {/* LIST */}
      <FlatList
        data={data} // ✅ API DATA DIRECT
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        onEndReached={loadMore} // ✅ PAGINATION
        onEndReachedThreshold={0.5}
        ListFooterComponent={renderFooter}
        ListEmptyComponent={() => (
          <View style={styles.emptyState}>
            <Text style={{ color: colors.text.secondary }}>
              {loading ? 'Loading...' : WALLET_LABELS.NO_TRANSACTIONS}
            </Text>
          </View>
        )}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => (
          <View
            style={[styles.separator, { borderBottomColor: colors.border.light }]}
          />
        )}
      />
    </View>
  );
};

export default TransactionList;

const styles = StyleSheet.create({
  container: {
    marginBottom: 104,
  },

  filterTextCont: {
    marginVertical: 12,
  },

  tabContainer: {
    flexDirection: 'row',

    padding: 6,
    marginBottom: 12,
    borderRadius: 8,

    backgroundColor: colors.primary.light,

  },

  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 6,
  },

  transactionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
  },

  transactionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  transactionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },

  transactionInfo: {
    marginLeft: 12,
  },

  separator: {
    borderBottomWidth: StyleSheet.hairlineWidth,
  },

  emptyState: {
    alignItems: 'center',
    padding: 32,
  },
});

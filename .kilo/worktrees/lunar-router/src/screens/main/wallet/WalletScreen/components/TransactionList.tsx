import React from 'react';
import {View, StyleSheet, FlatList, TouchableOpacity} from 'react-native';
import {useTheme} from '../../../../../theme';
import {Text} from '../../../../../components/Text';
import {Icon} from '../../../../../components/Icon';
import {TransactionListProps} from '../walletType';
import type {WalletTransaction} from '../../../../../types/global.types';
import {WALLET_LABELS, DEFAULTS} from '../../../../../constants/app.constants';
import {Button} from '../../../../../components';
import {useWalletTransactions} from '../../../../../services/api/walletTransactions/walletTransactions.hooks';

const TransactionItem: React.FC<{item: WalletTransaction; colors: any}> = ({
  item,
  colors,
}) => (
  <View style={styles.transactionItem}>
    <View style={styles.transactionLeft}>
      <View
        style={[
          styles.transactionIcon,
          {
            backgroundColor:
              item.type === 'credit'
                ? colors.success.light + '20'
                : colors.error.light + '20',
          },
        ]}>
        <Icon
          name={item.type === 'credit' ? 'arrow-up-right' : 'arrow-down-left'}
          size={18}
          color={
            item.type === 'credit' ? colors.success.main : colors.error.main
          }
          library="Feather"
        />
      </View>

      <View style={styles.transactionInfo}>
        <Text
          variant="body"
          weight="medium"
          style={{color: colors.text.primary}}>
          {item.description ||
            (item.type === 'credit'
              ? WALLET_LABELS.WALLET_RECHARGE
              : WALLET_LABELS.SERVICE_PAYMENT)}
        </Text>

        <Text
          variant="captionSmall"
          style={{color: colors.text.tertiary, marginTop: 2}}>
          {new Date(item.createdAt).toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
          })}
        </Text>
      </View>
    </View>

    <Text
      variant="body"
      weight="semibold"
      style={{
        color: item.type === 'credit' ? colors.success.main : colors.error.main,
      }}>
      {item.type === 'credit' ? '+' : '-'}
      {DEFAULTS.CURRENCY}
      {item.amount}
    </Text>
  </View>
);

export const TransactionList: React.FC<TransactionListProps> = ({
  transactions = [],
  activeTab,
  onTabChange,
  isLoading = false,
  onRefresh,
  onRechargePress,
  onWithdrawPress,
  isAuthenticated,
  balance,
}) => {
  const theme = useTheme();
  const colors = theme.colors;
  const {data, loading, fetchTransactions, page, totalPages} =
    useWalletTransactions();

  console.log('transuction data', data, fetchTransactions, page, totalPages);

  // ✅ FILTER LOGIC
  const filteredTransactions = React.useMemo(() => {
    if (activeTab === 'credit') {
      return transactions.filter(t => t.type === 'credit');
    }
    if (activeTab === 'debit') {
      return transactions.filter(t => t.type === 'debit');
    }
    return transactions;
  }, [transactions, activeTab]);

  const renderTransaction = ({item}: {item: WalletTransaction}) => (
    <TransactionItem item={item} colors={colors} />
  );

  // ✅ TAB BUTTON
  const TabButton = ({label, value}: any) => {
    const isActive = activeTab === value;

    return (
      <TouchableOpacity
        style={[
          styles.tab,
          {
            backgroundColor: isActive
              ? colors.primary.main
              : colors.background.primary,
          },
        ]}
        onPress={() => onTabChange(value)}>
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
      <View>
        <Button
          title={WALLET_LABELS.RECHARGE}
          variant="primary"
          size="large"
          onPress={onRechargePress}
        />
      </View>
      {/* HEADER */}
      <View style={styles.filterTextCont}>
        <Text
          variant="h6"
          weight="semibold"
          style={{color: colors.text.primary}}>
          {WALLET_LABELS.TRANSACTION_HISTORY}
        </Text>
      </View>

      {/* ✅ FILTER TABS */}
      <View
        style={[
          styles.tabContainer,
          // {backgroundColor: colors.background.paper},
        ]}>
        <TabButton label="All" value="all" />
        <TabButton label="Credit" value="credit" />
        <TabButton label="Debit" value="debit" />
      </View>

      {/* LIST */}
      <View style={styles.transactionCard}>
        <FlatList
          data={filteredTransactions}
          renderItem={renderTransaction}
          keyExtractor={item => item.id}
          refreshing={isLoading}
          onRefresh={onRefresh}
          ListEmptyComponent={() => (
            <View style={styles.emptyState}>
              <Text style={{color: colors.text.secondary}}>
                {WALLET_LABELS.NO_TRANSACTIONS}
              </Text>
            </View>
          )}
          showsVerticalScrollIndicator={false}
          ItemSeparatorComponent={() => (
            <View
              style={[
                styles.separator,
                {borderBottomColor: colors.border.light},
              ]}
            />
          )}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },

  filterTextCont: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },

  // ✅ TABS
  tabContainer: {
    flexDirection: 'row',
    borderRadius: 8,
    padding: 4,
    marginBottom: 12,
  },

  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 6,
  },

  transactionCard: {
    padding: 0,
    overflow: 'hidden',
  },

  transactionItem: {
    flexDirection: 'row',
    alignItems: 'center',
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

export default TransactionList;

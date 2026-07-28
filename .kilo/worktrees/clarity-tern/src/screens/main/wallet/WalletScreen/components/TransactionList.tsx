import React from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import { useTheme } from '../../../../../theme';
import { Text } from '../../../../../components/Text';
import { Icon } from '../../../../../components/Icon';
import { Card } from '../../../../../components/Card';
import { TransactionListProps } from '../walletType';
import type { WalletTransaction } from '../../../../../types/global.types';
import { WALLET_LABELS, DEFAULTS } from '../../../../../constants/app.constants';

const TransactionItem: React.FC<{ item: WalletTransaction; colors: any }> = ({
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
        ]}
      >
        <Icon
          name={item.type === 'credit' ? 'arrow-downward' : 'arrow-upward'}
          size={18}
          color={
            item.type === 'credit' ? colors.success.main : colors.error.main
          }
          library="MaterialIcons"
        />
      </View>
      <View style={styles.transactionInfo}>
        <Text
          variant="body"
          weight="medium"
          style={{ color: colors.text.primary }}
        >
          {item.description ||
            (item.type === 'credit' ? WALLET_LABELS.WALLET_RECHARGE : WALLET_LABELS.SERVICE_PAYMENT)}
        </Text>
        <Text
          variant="captionSmall"
          style={{ color: colors.text.tertiary, marginTop: 2 }}
        >
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
      }}
    >
      {item.type === 'credit' ? '+' : '-'}{DEFAULTS.CURRENCY}{item.amount}
    </Text>
  </View>
);

export const TransactionList: React.FC<TransactionListProps> = ({
  transactions = [],
  activeTab,
  onTabChange,
  isLoading = false,
  onRefresh,
}) => {
  const theme = useTheme();
  const colors = theme.colors;

  const filteredTransactions = React.useMemo(() => {
    if (activeTab === 'credit') {
      return transactions.filter(t => t.type === 'credit');
    }
    if (activeTab === 'debit') {
      return transactions.filter(t => t.type === 'debit');
    }
    return transactions;
  }, [transactions, activeTab]);

  const renderTransaction = ({ item }: { item: WalletTransaction }) => (
    <TransactionItem item={item} colors={colors} />
  );

  return (
    <View style={styles.container}>
      <Text
        variant="h6"
        weight="semibold"
        style={{ color: colors.text.primary, marginBottom: 12 }}
      >
        {WALLET_LABELS.TRANSACTION_HISTORY}
      </Text>

      {/* TABS */}
      <View
        style={[
          styles.tabContainer,
          { backgroundColor: colors.background.secondary },
        ]}
      >
        {(['all', 'credit', 'debit'] as const).map((tab) => {
          const isActive = activeTab === tab;
          const tabLabel = tab === 'all' ? WALLET_LABELS.TAB_ALL : 
                           tab === 'credit' ? WALLET_LABELS.TAB_CREDIT : 
                           WALLET_LABELS.TAB_DEBIT;

          return (
            <TouchableOpacity
              key={tab}
              activeOpacity={0.8}
              style={[
                styles.tab,
                isActive && {
                  backgroundColor:
                    tab === 'credit'
                      ? colors.success.main
                      : tab === 'debit'
                      ? colors.error.main
                      : colors.primary.main,
                },
              ]}
              onPress={() => onTabChange(tab)}
            >
              <Text
                variant="bodySmall"
                weight="medium"
                style={{
                  color: isActive ? colors.common.white : colors.text.secondary,
                }}
              >
                {tabLabel}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* LIST */}
      <Card style={styles.transactionCard}>
        <FlatList
          data={filteredTransactions}
          renderItem={renderTransaction}
          keyExtractor={item => item.id}
          ListEmptyComponent={() => (
            <View style={styles.emptyState}>
              <Text style={{ color: colors.text.secondary }}>
                {WALLET_LABELS.NO_TRANSACTIONS}
              </Text>
            </View>
          )}
          showsVerticalScrollIndicator={false}
          nestedScrollEnabled
          ItemSeparatorComponent={() => (
            <View
              style={[
                styles.separator,
                { borderBottomColor: colors.border.light },
              ]}
            />
          )}
        />
      </Card>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
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
  emptyIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default TransactionList;

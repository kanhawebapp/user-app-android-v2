import React, {useCallback, useEffect, useState} from 'react';
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StatusBar,
  StyleSheet,
  View,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useTheme} from '../../../theme';
import {GoBack} from '../../../components';
import {useToast} from '../../../context/ToastContext';
import {
  resolvePaymentLogInvoiceTransactionId,
  usePaymentLogInvoice,
  usePaymentLogs,
  type PaymentLogsCategory,
  type UnifiedPaymentLog,
} from '../../../services/api/paymentLogs';
import {generateAndDownloadInvoice} from '../../../utils/invoice/invoicePdf';
import {
  CATEGORY_TABS,
  CategoryTabs,
  EmptyState,
  ErrorState,
  PaymentFilters,
  PaymentLogCard,
} from './components';

const SEARCH_DEBOUNCE_MS = 350;

const downloadKeyForItem = (item: UnifiedPaymentLog): string =>
  `${item.rawSource}-${item.id}`;

interface PaymentLogsScreenProps {
  onNavigateBack?: () => void;
}

const PaymentLogsScreen: React.FC<PaymentLogsScreenProps> = ({
  onNavigateBack,
}) => {
  const {colors, isDark} = useTheme();
  const insets = useSafeAreaInsets();
  const toast = useToast();
  const {fetchInvoice} = usePaymentLogInvoice();

  const [category, setCategory] = useState<PaymentLogsCategory>('all');
  const [startDate, setStartDate] = useState<string | null>(null);
  const [endDate, setEndDate] = useState<string | null>(null);
  const [invoiceSearch, setInvoiceSearch] = useState('');
  const [debouncedInvoiceSearch, setDebouncedInvoiceSearch] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedInvoiceSearch(invoiceSearch);
    }, SEARCH_DEBOUNCE_MS);
    return () => clearTimeout(timer);
  }, [invoiceSearch]);

  const {data, loading, loadingMore, error, hasMore, loadMore, refresh} =
    usePaymentLogs({
      category,
      startDate,
      endDate,
      invoiceSearch: debouncedInvoiceSearch,
    });

  const handleCategoryChange = useCallback((next: PaymentLogsCategory) => {
    setCategory(next);
  }, []);

  const handleStartDateChange = useCallback((value: string | null) => {
    setStartDate(value);
  }, []);

  const handleEndDateChange = useCallback((value: string | null) => {
    setEndDate(value);
  }, []);

  const handleResetFilters = useCallback(() => {
    const shouldRefetchManually = startDate == null && endDate == null;
    setStartDate(null);
    setEndDate(null);
    setInvoiceSearch('');
    setDebouncedInvoiceSearch('');
    // Date changes already retrigger the hook; otherwise force a first-page reload.
    if (shouldRefetchManually) {
      refresh();
    }
  }, [startDate, endDate, refresh]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await refresh();
    setRefreshing(false);
  }, [refresh]);

  const handleEndReached = useCallback(() => {
    if (!loading && !loadingMore && hasMore && !error) {
      loadMore();
    }
  }, [loading, loadingMore, hasMore, error, loadMore]);

  const handleDownloadInvoice = useCallback(
    async (item: UnifiedPaymentLog) => {
      if (downloadingId != null) {
        return;
      }

      const transactionId = resolvePaymentLogInvoiceTransactionId(item);
      if (!transactionId) {
        toast.showError('Transaction ID not available');
        return;
      }

      if (
        item.kind !== 'SERVICE' &&
        item.kind !== 'PUJA' &&
        item.kind !== 'RECHARGE'
      ) {
        toast.showError('Invoice download is not supported for this type');
        return;
      }

      const key = downloadKeyForItem(item);
      setDownloadingId(key);

      try {
        const invoice = await fetchInvoice(item.kind, transactionId);
        if (!invoice) {
          throw new Error('Invoice not found');
        }
        await generateAndDownloadInvoice(invoice);
        toast.showSuccess('Invoice downloaded');
      } catch (e: any) {
        console.log('PAYMENT LOG INVOICE DOWNLOAD ERROR:', e);
        toast.showError(e?.message ?? 'Failed to download invoice');
      } finally {
        setDownloadingId(null);
      }
    },
    [downloadingId, fetchInvoice, toast],
  );

  const renderItem = useCallback(
    ({item, index}: {item: UnifiedPaymentLog; index: number}) => (
      <PaymentLogCard
        item={item}
        serialNumber={index + 1}
        onDownloadInvoice={handleDownloadInvoice}
        downloadingId={downloadingId}
      />
    ),
    [downloadingId, handleDownloadInvoice],
  );

  const keyExtractor = useCallback(
    (item: UnifiedPaymentLog) => `${item.rawSource}-${item.id}`,
    [],
  );

  const listHeader = (
    <>
      <CategoryTabs
        tabs={CATEGORY_TABS}
        activeTab={category}
        onTabChange={handleCategoryChange}
      />
      <PaymentFilters
        startDate={startDate}
        endDate={endDate}
        invoiceSearch={invoiceSearch}
        onStartDateChange={handleStartDateChange}
        onEndDateChange={handleEndDateChange}
        onInvoiceSearchChange={setInvoiceSearch}
        onReset={handleResetFilters}
      />
    </>
  );

  const listFooter = () => {
    if (!loadingMore) {
      return null;
    }
    return (
      <View style={styles.footerLoader}>
        <ActivityIndicator size="small" color={colors.primary.main} />
      </View>
    );
  };

  const listEmpty = () => {
    if (loading) {
      return (
        <View style={styles.loader}>
          <ActivityIndicator size="large" color={colors.primary.main} />
        </View>
      );
    }
    if (error && data.length === 0) {
      return <ErrorState message={error} onRetry={refresh} />;
    }
    return <EmptyState />;
  };

  return (
    <View
      style={[styles.container, {backgroundColor: colors.background.primary}]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
      <GoBack onBack={onNavigateBack} title="Payment Logs" />

      <FlatList
        data={loading && data.length === 0 ? [] : data}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        ListHeaderComponent={listHeader}
        ListEmptyComponent={listEmpty}
        ListFooterComponent={listFooter}
        onEndReached={handleEndReached}
        onEndReachedThreshold={0.4}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.primary.main}
            colors={[colors.primary.main]}
          />
        }
        contentContainerStyle={[
          styles.listContent,
          {paddingBottom: insets.bottom + 24},
        ]}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContent: {
    flexGrow: 1,
    paddingTop: 8,
  },
  loader: {
    marginTop: 48,
    alignItems: 'center',
  },
  footerLoader: {
    paddingVertical: 20,
    alignItems: 'center',
  },
});

export default PaymentLogsScreen;

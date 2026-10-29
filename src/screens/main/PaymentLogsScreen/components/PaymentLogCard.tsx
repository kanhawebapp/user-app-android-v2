import React from 'react';
import {ActivityIndicator, StyleSheet, View} from 'react-native';
import {useTheme} from '../../../../theme';
import {Text} from '../../../../components/Text';
import {Icon} from '../../../../components/Icon';
import {DATE_FORMATS, DEFAULTS} from '../../../../constants/app.constants';
import {formatCurrency, formatDate} from '../../../../utils/helpers';
import {
  parsePaymentTimestamp,
  type UnifiedPaymentLog,
} from '../../../../services/api/paymentLogs';

interface PaymentLogCardProps {
  item: UnifiedPaymentLog;
  serialNumber: number;
  onDownloadInvoice?: (item: UnifiedPaymentLog) => void;
  downloadingId?: string | null;
}

const displayValue = (value: string | number | null | undefined): string => {
  if (value == null || value === '') {
    return '—';
  }
  return String(value);
};

const formatAmount = (amount: number | null | undefined): string => {
  if (amount == null) {
    return '—';
  }
  try {
    return formatCurrency(amount, 'INR');
  } catch {
    return `${DEFAULTS.CURRENCY}${amount}`;
  }
};

const formatPaymentDate = (createdAt: string | number): string => {
  const ts = parsePaymentTimestamp(createdAt);
  if (!ts) {
    return '—';
  }
  return formatDate(new Date(ts), DATE_FORMATS.DISPLAY_DATE_TIME);
};

const kindLabel = (kind: UnifiedPaymentLog['kind']): string => {
  switch (kind) {
    case 'PUJA':
      return 'Puja';
    case 'RECHARGE':
      return 'Recharge';
    default:
      return 'Service';
  }
};

const kindIcon = (kind: UnifiedPaymentLog['kind']): string => {
  switch (kind) {
    case 'PUJA':
      return 'local-fire-department';
    case 'RECHARGE':
      return 'account-balance-wallet';
    default:
      return 'miscellaneous-services';
  }
};

const downloadKey = (item: UnifiedPaymentLog): string =>
  `${item.rawSource}-${item.id}`;

export const PaymentLogCard: React.FC<PaymentLogCardProps> = ({
  item,
  serialNumber,
  onDownloadInvoice,
  downloadingId,
}) => {
  const {colors} = useTheme();
  const isRecharge = item.kind === 'RECHARGE';
  const isDownloading = downloadingId === downloadKey(item);
  const downloadDisabled = downloadingId != null;

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: colors.background.primary,
          borderColor: colors.border.light,
        },
      ]}>
      <View style={styles.headerRow}>
        <View style={styles.headerLeft}>
          <View
            style={[
              styles.iconWrap,
              {backgroundColor: colors.primary.main + '18'},
            ]}>
            <Icon
              name={kindIcon(item.kind)}
              size={18}
              color={colors.primary.main}
            />
          </View>
          <View style={styles.headerText}>
            <Text
              variant="body"
              weight="semibold"
              style={{color: colors.text.primary}}>
              {isRecharge
                ? displayValue(item.rechargePackName)
                : displayValue(item.serviceName)}
            </Text>
            <Text
              variant="captionSmall"
              style={{color: colors.text.secondary, marginTop: 2}}>
              #{serialNumber} · {kindLabel(item.kind)}
            </Text>
          </View>
        </View>
        <View style={styles.headerRight}>
          <Text
            variant="body"
            weight="bold"
            style={{color: colors.text.primary}}>
            {formatAmount(item.amount)}
          </Text>
          {onDownloadInvoice ? (
            isDownloading ? (
              <ActivityIndicator
                size="small"
                color={colors.primary.main}
                style={styles.downloadAction}
              />
            ) : (
              <Icon
                name="download"
                size={18}
                color={
                  downloadDisabled
                    ? colors.text.tertiary
                    : colors.text.secondary
                }
                library="Feather"
                style={styles.downloadAction}
                onPress={() => {
                  if (!downloadDisabled) {
                    onDownloadInvoice(item);
                  }
                }}
              />
            )
          ) : null}
        </View>
      </View>

      <View style={styles.metaGrid}>
        <MetaRow
          label="Invoice"
          value={displayValue(item.invoiceNo)}
          colors={colors}
        />
        {isRecharge ? (
          <>
            <MetaRow
              label="Coins"
              value={displayValue(item.coins)}
              colors={colors}
            />
            <MetaRow
              label="Status"
              value={displayValue(item.status)}
              colors={colors}
            />
          </>
        ) : (
          <>
            <MetaRow
              label="Service type"
              value={displayValue(item.serviceType)}
              colors={colors}
            />
            <MetaRow
              label="Service Name"
              value={displayValue(item.serviceName)}
              colors={colors}
            />
            <MetaRow
              label="Taxable"
              value={formatAmount(item.taxableAmount)}
              colors={colors}
            />
            <MetaRow
              label="Total tax"
              value={formatAmount(item.totalTax)}
              colors={colors}
            />
          </>
        )}
        <MetaRow
          label="Payment date"
          value={formatPaymentDate(item.createdAt)}
          colors={colors}
        />
      </View>
    </View>
  );
};

const MetaRow = ({
  label,
  value,
  colors,
}: {
  label: string;
  value: string;
  colors: any;
}) => (
  <View style={styles.metaRow}>
    <Text variant="captionSmall" style={{color: colors.text.tertiary}}>
      {label}
    </Text>
    <Text
      variant="bodySmall"
      weight="medium"
      style={{color: colors.text.primary, flex: 1, textAlign: 'right'}}
      numberOfLines={2}>
      {value}
    </Text>
  </View>
);

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 16,
    marginBottom: 12,
    borderRadius: 14,
    borderWidth: 1,
    padding: 14,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 12,
  },
  headerRight: {
    alignItems: 'flex-end',
  },
  iconWrap: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerText: {
    marginLeft: 10,
    flex: 1,
  },
  downloadAction: {
    marginTop: 8,
  },
  metaGrid: {
    gap: 8,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 12,
  },
});

export default PaymentLogCard;

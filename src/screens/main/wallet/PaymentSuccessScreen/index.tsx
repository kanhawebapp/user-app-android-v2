import React from 'react';
import { View, StyleSheet, StatusBar, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import { useTheme } from '../../../../theme';
import { Text } from '../../../../components/Text';
import { Icon } from '../../../../components/Icon';
import { Button } from '../../../../components/Button';

interface PaymentSuccessData {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
  amount?: number;
  packName?: string;
}

interface PaymentSuccessScreenProps {
  paymentData: PaymentSuccessData;
  onGoToWallet: () => void;
  onGoToHome: () => void;
}

const PaymentSuccessScreen: React.FC<PaymentSuccessScreenProps> = ({
  paymentData,
  onGoToWallet,
  onGoToHome,
}) => {
  const theme = useTheme();
  const colors = theme.colors;
  const insets = useSafeAreaInsets();

  const formatPaymentId = (id: string) => {
    if (!id) {
      return 'N/A';
    }

    return id.length > 16
      ? `${id.substring(0, 8)}...${id.substring(id.length - 6)}`
      : id;
  };

  const formatOrderId = (id: string) => {
    if (!id) {
      return 'N/A';
    }

    return id.length > 16
      ? `${id.substring(0, 8)}...${id.substring(id.length - 6)}`
      : id;
  };

  return (
    <View style={[styles.container, { backgroundColor: '#F8F7FB' }]}>
      <StatusBar
        barStyle="light-content"
        translucent
        backgroundColor="transparent"
      />

      <LinearGradient
        colors={['#6200EE', '#9C27B0', '#E040FB']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.gradientHeader, { paddingTop: insets.top + 16 }]}>
        <View style={styles.confettiContainer}>
          <View
            style={[
              styles.confettiDot,
              { backgroundColor: '#FFD700', top: 20, left: 30 },
            ]}
          />

          <View
            style={[
              styles.confettiDot,
              { backgroundColor: '#FF4081', top: 40, right: 40 },
            ]}
          />

          <View
            style={[
              styles.confettiDot,
              { backgroundColor: '#00E676', top: 15, right: 80 },
            ]}
          />

          <View
            style={[
              styles.confettiDot,
              { backgroundColor: '#FFEB3B', top: 50, left: 70 },
            ]}
          />

          <View
            style={[
              styles.confettiDot,
              { backgroundColor: '#40C4FF', top: 30, left: 120 },
            ]}
          />

          <View
            style={[
              styles.confettiDot,
              { backgroundColor: '#FF6E40', top: 10, right: 120 },
            ]}
          />
        </View>

        <View style={styles.checkContainer}>
          <View style={styles.ringOuter} />

          <View style={styles.ringMiddle} />

          <View style={styles.checkCircle}>
            <Icon
              name="check"
              size={48}
              color="#FFFFFF"
              library="MaterialIcons"
            />
          </View>
        </View>

        <View style={styles.successTextContainer}>
          <Text variant="h4" weight="semibold" style={styles.successTitle}>
            Recharge Successful!
          </Text>

          <Text variant="body" style={styles.successSubtitle}>
            Your wallet has been recharged successfully
          </Text>
        </View>
      </LinearGradient>

      <ScrollView
        style={styles.scrollContent}
        contentContainerStyle={[
          styles.scrollContentContainer,
          { paddingBottom: insets.bottom + 100 },
        ]}
        showsVerticalScrollIndicator={false}>
        <View style={styles.detailsCard}>
          {paymentData.amount !== undefined && (
            <View style={styles.amountSection}>
              <Text
                variant="captionSmall"
                weight="medium"
                style={[styles.amountLabel, { color: colors.text.tertiary }]}>
                Amount Paid
              </Text>

              <Text
                variant="h3"
                weight="bold"
                style={[styles.amountValue, { color: colors.primary.main }]}>
                ₹{paymentData.amount.toLocaleString('en-IN')}
              </Text>
            </View>
          )}

          <View
            style={[styles.divider, { backgroundColor: colors.border.light }]}
          />

          <View style={styles.detailRow}>
            <View style={styles.detailIconContainer}>
              <Icon
                name="receipt-long"
                size={20}
                color={colors.primary.main}
                library="MaterialIcons"
              />
            </View>

            <View style={styles.detailTextContainer}>
              <Text
                variant="captionSmall"
                style={[styles.detailLabel, { color: colors.text.tertiary }]}>
                Order ID
              </Text>

              <Text
                variant="body"
                weight="medium"
                style={[styles.detailValue, { color: colors.text.primary }]}>
                {formatOrderId(paymentData.razorpay_order_id)}
              </Text>
            </View>
          </View>

          <View style={styles.detailRow}>
            <View style={styles.detailIconContainer}>
              <Icon
                name="payment"
                size={20}
                color={colors.primary.main}
                library="MaterialIcons"
              />
            </View>

            <View style={styles.detailTextContainer}>
              <Text
                variant="captionSmall"
                style={[styles.detailLabel, { color: colors.text.tertiary }]}>
                Payment ID
              </Text>

              <Text
                variant="body"
                weight="medium"
                style={[styles.detailValue, { color: colors.text.primary }]}>
                {formatPaymentId(paymentData.razorpay_payment_id)}
              </Text>
            </View>
          </View>

          <View style={styles.detailRow}>
            <View style={styles.detailIconContainer}>
              <Icon
                name="verified"
                size={20}
                color={colors.success.main}
                library="MaterialIcons"
              />
            </View>

            <View style={styles.detailTextContainer}>
              <Text
                variant="captionSmall"
                style={[styles.detailLabel, { color: colors.text.tertiary }]}>
                Status
              </Text>

              <View style={styles.statusRow}>
                <View
                  style={[
                    styles.statusBadge,
                    { backgroundColor: colors.success.background },
                  ]}>
                  <Text
                    variant="captionSmall"
                    weight="semibold"
                    style={[styles.statusText, { color: colors.success.dark }]}>
                    Verified
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.buttonsContainer}>
          {/* <Button
            title="Chat again"
            variant="primary"
            size="large"
            onPress={onGoToWallet}
            style={styles.primaryButton}
          /> */}

          {/* <Button
            // title={isDownloading ? 'Downloading...' : 'Download Invoice'}
            title={'Download Invoice'}

            variant="primary"
            size="large"
            // onPress={handleDownloadInvoice}
            // disabled={isDownloading}
            style={styles.invoiceButton}
          /> */}

          <Button
            title="Back to Home"
            variant="outline"
            size="large"
            onPress={onGoToHome}
            style={styles.secondaryButton}
          />
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  gradientHeader: {
    paddingBottom: 40,
    alignItems: 'center',
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
  },

  confettiContainer: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'hidden',
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
  },

  confettiDot: {
    position: 'absolute',
    width: 8,
    height: 8,
    borderRadius: 4,
    opacity: 0.7,
  },

  checkContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 24,
    marginBottom: 24,
  },

  ringOuter: {
    position: 'absolute',
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.2)',
  },

  ringMiddle: {
    position: 'absolute',
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.3)',
  },

  checkCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255,255,255,0.25)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  successTextContainer: {
    alignItems: 'center',
    paddingHorizontal: 32,
  },

  successTitle: {
    color: '#FFFFFF',
    fontSize: 24,
    marginBottom: 8,
  },

  successSubtitle: {
    color: 'rgba(255,255,255,0.85)',
    fontSize: 15,
    textAlign: 'center',
  },

  scrollContent: {
    flex: 1,
    marginTop: -20,
  },

  scrollContentContainer: {
    paddingHorizontal: 20,
    paddingTop: 12,
  },

  detailsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 4,
  },

  amountSection: {
    alignItems: 'center',
    paddingVertical: 8,
  },

  amountLabel: {
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 6,
  },

  amountValue: {
    fontSize: 32,
  },

  divider: {
    height: 1,
    marginVertical: 16,
  },

  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },

  detailIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: 'rgba(98,0,238,0.08)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },

  detailTextContainer: {
    flex: 1,
  },

  detailLabel: {
    fontSize: 11,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 2,
  },

  detailValue: {
    fontSize: 14,
  },

  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 8,
  },

  statusText: {
    fontSize: 12,
  },

  buttonsContainer: {
    marginTop: 24,
    gap: 12,
  },

  primaryButton: {
    width: '100%',
  },

  invoiceButton: {
    width: '100%',
  },
  secondaryButton: {
    width: '100%',
  },
});

export default PaymentSuccessScreen;

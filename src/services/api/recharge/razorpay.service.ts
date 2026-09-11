
import { Platform } from 'react-native';
import RazorpayCheckout from 'react-native-razorpay';
import { getIPLocation } from '../../location/location.service';
import { RAZORPAY_KEY } from '../../../constants/api.constants';

export const openRazorpayCheckout = async ({
  order,
  user,
  selectedPack,
  amount,
}: {
  order: any;
  user: any;
  selectedPack: any;
  amount: number;

}) => {
  // Get IP + City + State + Country
  const ipData = await getIPLocation();

  console.log('FINAL IP DATA:', ipData);

  const options = {
    description: 'Wallet Recharge',

    currency: order?.currency || 'INR',

    key: RAZORPAY_KEY.NEXT_PUBLIC_RAZORPAY_KEY_ID,

    amount: amount,

    order_id: order?.orderId,

    name: 'Dhwani Astro',

    prefill: {
      name: user?.name || '',
      contact: user?.mobile || '',
    },

    notes: {
      userId: user?.id || '',
      rechargePackId: selectedPack?.id || '',
      coins: selectedPack?.talktime || 0,
      source: 'dhwaniastro',

      // Location details
      ip: ipData.ip,
      city: ipData.city,
      state: ipData.state,
      country: ipData.country,
      platform: Platform.OS,

    },

    theme: {
      color: '#3399cc',
    },
  };

  console.log(
    'RAZORPAY OPTIONS:',
    JSON.stringify(options, null, 2),
  );

  return RazorpayCheckout.open(options);
};

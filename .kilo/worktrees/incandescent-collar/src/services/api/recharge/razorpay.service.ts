// import RazorpayCheckout from 'react-native-razorpay';

// export const openRazorpayCheckout = async ({
//   order,
//   user,
// }: {
//   order: any;
//   user: any;
// }) => {
//   const options = {
//     description: 'Wallet Recharge',
//     currency: 'INR',
//     key: 'rzp_test_SNXjhTOgP1CIx0',
//     amount: order.amount,
//     order_id: order.id,
//     name: 'Dhwani Astro',
//     prefill: {
//       name: user?.name || '',
//       contact: user?.mobile || '',
//     },
//     theme: {
//       color: '#3399cc',
//     },
//   };

//   return RazorpayCheckout.open(options);
// };


import RazorpayCheckout from 'react-native-razorpay';

export const openRazorpayCheckout = async ({
  order,
  user,
  selectedPack,
}: {
  order: any;
  user: any;
  selectedPack: any;
}) => {
  const options = {
    description: 'Wallet Recharge',
    currency: 'INR',
    key: 'rzp_test_SNXjhTOgP1CIx0',
    amount: order.amount,
    order_id: order.id,
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
    },

    theme: {
      color: '#3399cc',
    },
  };

  return RazorpayCheckout.open(options);
};


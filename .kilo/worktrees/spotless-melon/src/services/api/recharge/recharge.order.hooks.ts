// import {useState} from 'react';
// import {createRechargeOrder} from './recharge.order.api';

// export const useRechargeOrder = () => {
//   const [loading, setLoading] = useState(false);
//   const [order, setOrder] = useState<any>(null);
//   const [error, setError] = useState<any>(null);

//   const createOrder = async (amount: number) => {
//     try {
//       setLoading(true);
//       setError(null);

//       const res = await createRechargeOrder(amount);

//       setOrder(res);

//       return res;
//     } catch (err: any) {
//       console.log(
//         'CREATE ORDER HOOK ERROR:',
//         err?.response?.data || err?.message,
//       );
//       setError(err);
//       throw err;
//     } finally {
//       setLoading(false);
//     }
//   };

//   return {
//     order,
//     loading,
//     error,
//     createOrder,
//   };
// };

import {useState} from 'react';
import {createRechargeOrder} from './recharge.order.api';

export const useRechargeOrder = () => {
  const [loading, setLoading] = useState(false);
  const [order, setOrder] = useState<any>(null);
  const [error, setError] = useState<any>(null);

  const createOrder = async (rechargePackId: string) => {
    try {
      setLoading(true);
      setError(null);

      const res = await createRechargeOrder(rechargePackId);

      setOrder(res);

      return res;
    } catch (err: any) {
      console.log('CREATE ORDER HOOK ERROR:', err);
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    order,
    loading,
    error,
    createOrder,
  };
};

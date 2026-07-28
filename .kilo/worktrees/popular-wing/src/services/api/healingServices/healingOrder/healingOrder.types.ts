// export interface CreateHealingOrderInput {
//   bookingId: string;
//   useWallet: boolean;
// }

// export interface HealingOrder {
//   success: boolean;
//   orderId: string;
//   bookingId: string;
//   currency: string;
//   totalAmount: number;
//   walletAmount: number;
//   payableAmount: number;
// }

// export interface CreateHealingOrderResponse {
//   createHealingOrder: HealingOrder;
// }

export interface HealingOrder {
  success: boolean;

  orderId: string;

  bookingId: string;

  currency: string;

  totalAmount: number;

  payableAmount: number;
}

export interface CreateHealingOrderResponse {
  createHealingOrder: HealingOrder;
}
export type ServicesBankServiceType = 'SERVICE' | 'PUJA';

export type PaymentLogsCategory = 'all' | 'service' | 'puja' | 'recharge';

export interface PaymentLogsPagination {
  totalRecords: number;
  totalPages: number;
  currentPage: number;
  limit: number;
}

export interface ServicesBankPaymentLog {
  id: string;
  userId: string | null;
  serviceType: ServicesBankServiceType | string | null;
  serviceId: string | null;
  bookingId: string | null;
  invoiceNo: string | null;
  taxableAmount: number | null;
  totalTax: number | null;
  createdAt: string | number;
  amount: number | null;
  serviceName: string | null;
}

export interface RechargePaymentLog {
  id: string;
  rechargePackName: string | null;
  amount: number | null;
  coins: number | null;
  status: string | null;
  invoiceNo: string | null;
  createdAt: string | number;
}

export interface GetServicesBankPaymentLogsPayload {
  success: boolean;
  message?: string | null;
  data: ServicesBankPaymentLog[];
  pagination: PaymentLogsPagination;
}

export interface GetRechargePaymentLogsPayload {
  success: boolean;
  message?: string | null;
  data: RechargePaymentLog[];
  pagination: PaymentLogsPagination;
}

export interface GetServicesBankPaymentLogsResponse {
  getServicesBankPaymentLogs: GetServicesBankPaymentLogsPayload;
}

export interface GetRechargePaymentLogsResponse {
  getRechargePaymentLogs: GetRechargePaymentLogsPayload;
}

export interface ServicesBankPaymentLogsInput {
  page?: number;
  limit?: number;
  serviceType?: ServicesBankServiceType | null;
  startDate?: string | null;
  endDate?: string | null;
}

export interface RechargePaymentLogsInput {
  page: number;
  limit: number;
  startDate?: string | null;
  endDate?: string | null;
}

/** Normalized row used by the Payment Logs UI for all categories. */
export type UnifiedPaymentKind = 'SERVICE' | 'PUJA' | 'RECHARGE';

export interface UnifiedPaymentLog {
  id: string;
  kind: UnifiedPaymentKind;
  invoiceNo: string | null;
  serviceType: string | null;
  serviceName: string | null;
  bookingId: string | null;
  taxableAmount: number | null;
  totalTax: number | null;
  amount: number | null;
  rechargePackName: string | null;
  coins: number | null;
  status: string | null;
  createdAt: string | number;
  rawSource: 'services_bank' | 'recharge';
}

export interface PaymentLogsFilters {
  category: PaymentLogsCategory;
  startDate: string | null;
  endDate: string | null;
  invoiceSearch: string;
  page: number;
  limit: number;
}

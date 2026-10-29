import {graphqlRequest} from '../graphql.client';
import {toGraphqlDateParam} from './paymentLogs.date';
import {
  GET_RECHARGE_PAYMENT_LOGS,
  GET_SERVICES_BANK_PAYMENT_LOGS,
} from './paymentLogs.query';
import type {
  GetRechargePaymentLogsPayload,
  GetRechargePaymentLogsResponse,
  GetServicesBankPaymentLogsPayload,
  GetServicesBankPaymentLogsResponse,
  RechargePaymentLogsInput,
  ServicesBankPaymentLogsInput,
} from './paymentLogs.types';

const emptyPagination = (page: number, limit: number) => ({
  totalRecords: 0,
  totalPages: 0,
  currentPage: page,
  limit,
});

/** Builds GraphQL variables for services-bank payment logs (exported for tests). */
export const buildServicesBankPaymentLogsVariables = (
  input: ServicesBankPaymentLogsInput = {},
) => {
  const page = input.page ?? 1;
  const limit = input.limit ?? 10;
  return {
    page,
    limit,
    serviceType: input.serviceType ?? null,
    startDate: toGraphqlDateParam(input.startDate),
    endDate: toGraphqlDateParam(input.endDate),
  };
};

/** Builds GraphQL variables for recharge payment logs (exported for tests). */
export const buildRechargePaymentLogsVariables = (
  input: RechargePaymentLogsInput,
) => ({
  page: input.page,
  limit: input.limit,
  startDate: toGraphqlDateParam(input.startDate),
  endDate: toGraphqlDateParam(input.endDate),
});

export const getServicesBankPaymentLogs = async (
  input: ServicesBankPaymentLogsInput = {},
): Promise<GetServicesBankPaymentLogsPayload> => {
  const variables = buildServicesBankPaymentLogsVariables(input);
  const {page, limit} = variables;

  try {
    if (__DEV__) {
      console.log(
        '[PaymentLogs] GetServicesBankPaymentLogs variables:',
        JSON.stringify(variables),
      );
    }

    const response = await graphqlRequest<GetServicesBankPaymentLogsResponse>(
      'GetServicesBankPaymentLogs',
      GET_SERVICES_BANK_PAYMENT_LOGS,
      variables,
    );

    const payload = response.getServicesBankPaymentLogs;

    return {
      success: payload?.success ?? false,
      message: payload?.message ?? null,
      data: payload?.data ?? [],
      pagination: payload?.pagination ?? emptyPagination(page, limit),
    };
  } catch (error) {
    console.log('GET SERVICES BANK PAYMENT LOGS ERROR:', error);
    throw error;
  }
};

export const getRechargePaymentLogs = async (
  input: RechargePaymentLogsInput,
): Promise<GetRechargePaymentLogsPayload> => {
  const variables = buildRechargePaymentLogsVariables(input);

  try {
    if (__DEV__) {
      console.log(
        '[PaymentLogs] GetRechargePaymentLogs variables:',
        JSON.stringify(variables),
      );
    }

    const response = await graphqlRequest<GetRechargePaymentLogsResponse>(
      'GetRechargePaymentLogs',
      GET_RECHARGE_PAYMENT_LOGS,
      variables,
    );

    const payload = response.getRechargePaymentLogs;

    return {
      success: payload?.success ?? false,
      message: payload?.message ?? null,
      data: payload?.data ?? [],
      pagination:
        payload?.pagination ?? emptyPagination(input.page, input.limit),
    };
  } catch (error) {
    console.log('GET RECHARGE PAYMENT LOGS ERROR:', error);
    throw error;
  }
};

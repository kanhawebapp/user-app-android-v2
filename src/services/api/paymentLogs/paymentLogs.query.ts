export const GET_SERVICES_BANK_PAYMENT_LOGS = `
query GetServicesBankPaymentLogs(
  $page: Int
  $limit: Int
  $serviceType: String
  $startDate: String
  $endDate: String
) {
  getServicesBankPaymentLogs(
    page: $page
    limit: $limit
    serviceType: $serviceType
    startDate: $startDate
    endDate: $endDate
  ) {
    success
    message
    data {
      id
      userId
      serviceType
      serviceId
      bookingId
      invoiceNo
      taxableAmount
      totalTax
      createdAt
      amount
      serviceName
    }
    pagination {
      totalRecords
      totalPages
      currentPage
      limit
    }
  }
}
`;

export const GET_RECHARGE_PAYMENT_LOGS = `
query GetRechargePaymentLogs(
  $page: Int!
  $limit: Int!
  $startDate: String
  $endDate: String
) {
  getRechargePaymentLogs(
    page: $page
    limit: $limit
    startDate: $startDate
    endDate: $endDate
  ) {
    success
    message
    data {
      id
      rechargePackName
      amount
      coins
      status
      invoiceNo
      createdAt
    }
    pagination {
      totalRecords
      totalPages
      currentPage
      limit
    }
  }
}
`;

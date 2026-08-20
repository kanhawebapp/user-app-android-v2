export const GET_USER_SESSIONS = `
query GetUserSessions($filter: SessionFilterInput) {
  getUserSessions(filter: $filter) {
    data {
      id
      userName
      astrologerName
      displayName
      astrologerImage
      status
      startedAt
      endedAt
      durationSec
      durationMin
      ratePerMin
      ratePerSecond
      totalCharge
      coinsEarned
      commission
    }
    totalCount
    currentPage
    totalPages
  }
}
`;

export interface UpdateBookingAstrologerInput {
  bookingId: string;
  astrologerId: string;
}

export interface UpdatedBookingAstrologer {
  id: string;
  astrologerId: string;
}

export interface UpdateBookingAstrologerResponse {
  updateBookingAstrologer: UpdatedBookingAstrologer;
}
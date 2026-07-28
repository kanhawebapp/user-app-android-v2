export interface BookingService {
  id: string;

  name: string;

  image?: string | null;
}

export interface BookingAstrologer {
  id: string;

  name: string;

  profilePic?: string | null;
}

export interface MyServiceBooking {
  id: string;

  bookingStatus: string;

  paymentStatus: string;

  amount: number;

  createdAt: string;

  service: BookingService;

  astrologer: BookingAstrologer;
}

export interface GetMyServiceBookingsResponse {
  getMyServiceBookings: MyServiceBooking[];
}
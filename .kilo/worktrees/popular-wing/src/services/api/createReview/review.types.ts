export interface CreateReviewInput {
  astro_id: string;

  star: number;

  comment: string;
}

export interface Review {
  id: string;

  userId: string;

  astrologerId: string;

  sessionId?: string;

  rating: number;

  comment: string;

  userName?: string;

  astroName?: string;

  createdAt: string;
}

export interface CreateReviewResponse {
  success: boolean;

  message: string;

  review: Review;
}

export interface CreateReviewGraphQLResponse {
  createReview: CreateReviewResponse;
}

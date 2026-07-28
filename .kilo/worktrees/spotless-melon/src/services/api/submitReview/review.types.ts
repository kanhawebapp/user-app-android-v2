export interface CreateReviewInput {
  astro_id: string;

  //   review_id: string;

  star: number;

  comment: string;

  user_name: string;

  astro_name: string;
}

export interface CreateReviewData {
  success: boolean;

  message: string;
}

export interface CreateReviewResponse {
  createReview: CreateReviewData;
}

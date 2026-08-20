
export interface AstrologerPricing {
  type: 'CHAT' | 'CALL' | 'VIDEO' | 'AUDIO';

  price: number;

  offerPrice: number;

  commissionPercent: number;

  isActive: boolean;
}

export interface AstrologerReview {
  id: string;
  rating: number;
  comment: string;
  reply?: string | null;
  userName: string;
  createdAt: string;
}

export interface AstrologerDetails {
  id: string;

  name: string;

  displayName?: string;

  profilePic?: string;

  experience: number;

  rating: number;

  skills: string[];

  languages: string[];

  about?: string;

  tags?: string;

  vtags?: string;

  pricing: AstrologerPricing[];

  reviews?: AstrologerReview[];
}

export interface GetAstrologerByIdResponse {
  getAstrologerById: AstrologerDetails;
}

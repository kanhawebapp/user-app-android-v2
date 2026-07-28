export interface ActiveOffer {
  id: string;

  offerName: string;

  price: number;

  description?: string;
}

export interface AstrologerPricing {
  type: string;

  price: number;

  originalPrice: number;

  offerPrice?: number | null;

  commissionPercent: number;

  isActive: boolean;
}

export interface Astrologer {
  id: string;

  profilePic?: string;

  name: string;

  experience: number;

  rating: number;

  skills: string[];

  languages: string[];

  activeOffer?: ActiveOffer | null;

  pricing: AstrologerPricing[];
}

export interface AstrologerSearchInput {
  page?: number;

  limit?: number;

  search?: string;

  skill?: string;

  language?: string;
}

export interface AstrologerListResponse {
  totalCount: number;

  currentPage: number;

  totalPages: number;

  data: Astrologer[];
}

export interface GetAstrologerListForUserResponse {
  getAstrologerListForUser: AstrologerListResponse;
}
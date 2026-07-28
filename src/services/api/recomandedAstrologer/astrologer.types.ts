export interface AstrologerPagination {
  data: Astrologer[];

  totalPages: number;

  __typename?: string;
}

export interface GetAstrologersResponse {
  getAstrologerListBySearch: AstrologerPagination;
}


export interface AstrologerSearchInput {
  limit?: number;
  page?: number;
  sortField?: 'RATING' | 'PRICE' | 'EXPERIENCE';
  sortOrder?: 'ASC' | 'DESC';

  type?: 'CHAT' | 'CALL';

  skills?: string[];
  languages?: string[];
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  minExperience?: number;
  search?: string;
}

export interface ActiveOffer {
  id: string;
  offerName: string;
  price: number;
  description: string;
}

export interface AstrologerPricing {
  type: 'CHAT' | 'CALL' | string;
  price: number;
  offerPrice: number;
  commissionPercent: number;
  isActive: boolean;
}

export interface Astrologer {
  id: string;
  profilePic: string;
  name: string;
  experience: number;
  rating: number;
  skills: string[];
  languages: string[];

  activeOffer?: ActiveOffer | null;
  pricing: AstrologerPricing[];

  __typename?: string;
}

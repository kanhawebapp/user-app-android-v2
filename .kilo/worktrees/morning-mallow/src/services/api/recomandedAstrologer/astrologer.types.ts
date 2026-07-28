export interface Astrologer {
  id: string;
  profilePic: string;
  name: string;
  experience: number;
  price: number;
  rating: number;
  skills: string[];
  languages: string[];
  __typename: string;
  astrologer: any;
}

export interface AstrologerPagination {
  data: Astrologer[];
  totalCount: number;
  currentPage: number;
  totalPages: number;
  __typename: string;
}

export interface GetAstrologersResponse {
  getAstrologerListBySearch: AstrologerPagination;
}

export interface AstrologerSearchInput {
  limit?: number;
  page?: number;
  sortField?: 'RATING' | 'PRICE' | 'EXPERIENCE';
  sortOrder?: 'ASC' | 'DESC';
  skills?: string[];
  languages?: string[];
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  minExperience?: number;
  search?: string;
}

export interface Pricing {
  id: string;
  type: string;
  price: number;
  offerPrice: number;
}

export interface Offer {
  offerName: string;
  price: number;
}

export interface AstrologerOffer {
  id: string;
  offer: Offer;
}

// export interface FollowedAstrologer {
//   id: string;
//   name: string;
//   displayName: string;
//   profilePic: string | null;
//   rating: number;
//   experience: number;
//   pricing: Pricing[];
//   offers: AstrologerOffer[];
// }

export interface FollowedAstrologersData {
  astrologers: FollowedAstrologer[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface GetFollowedAstrologersResponse {
  getFollowedAstrologers: FollowedAstrologersData;
}

export interface FollowedAstrologerPricing {
  id: string;

  type: string;

  price: number;

  offerPrice?: number | null;
}

export interface FollowedAstrologer {
  id: string;

  name: string;

  displayName?: string;

  profilePic?: string | null;

  rating?: number;

  experience?: number;

  pricing: FollowedAstrologerPricing[];
}
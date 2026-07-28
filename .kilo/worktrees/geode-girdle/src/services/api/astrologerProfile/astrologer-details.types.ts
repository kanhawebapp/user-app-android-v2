export interface AstrologerPricing {
  type: 'CHAT' | 'CALL';

  price: number;

  offerPrice: number;

  commissionPercent: number;

  isActive: boolean;
}

export interface AstrologerDetails {
  id: string;

  name: string;

  profilePic?: string;

  experience: number;

  rating: number;

  skills: string[];

  languages: string[];

  pricing: AstrologerPricing[];
}

export interface GetAstrologerByIdResponse {
  getAstrologerById: AstrologerDetails;
}

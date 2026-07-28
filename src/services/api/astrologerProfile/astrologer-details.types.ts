
export interface AstrologerPricing {
  type: 'CHAT' | 'CALL' | 'VIDEO' | 'AUDIO';

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

  about?: string;

  tags?: string;

  vtags?: string;

  pricing: AstrologerPricing[];
}

export interface GetAstrologerByIdResponse {
  getAstrologerById: AstrologerDetails;
}

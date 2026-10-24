export interface PujaService {
  id: string;
  title: string;
  slug: string;
  image: string;
  category: string | null;
  shortDescription: string;
  price: number;
  mrp: number;
  discount: number;
  rating: number;
  __typename?: string;
}

export interface PujaMantraOption {
  id: string;
  name: string;
  originalPrice: number;
  offerPrice: number;
  sortOrder: number;
}

export interface PujaFaq {
  id: string;
  question: string;
  answer: string;
}

export interface PujaReview {
  id: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface PujaServiceDetails extends PujaService {
  description: string | null;
  benefits: string | null;
  howToPerform: string | null;
  packaging: string | null;
  customersCount: number;
  mantraOptions: PujaMantraOption[];
  faqs: PujaFaq[];
  reviews: PujaReview[];
}

export interface GetPujaServicesResponse {
  pujaServices: PujaService[];
}

export interface GetPujaDetailsResponse {
  pujaService: PujaServiceDetails | null;
}

export interface GetPujaDetailsVariables {
  slug: string;
}

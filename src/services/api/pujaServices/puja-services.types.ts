export interface PujaService {
  id: string;
  title: string;
  slug: string;
  image: string;
  category: string;
  shortDescription: string;
  price: number;
  mrp: number;
  discount: number;
  rating: number;
  __typename: string;
}

export interface GetPujaServicesResponse {
  pujaServices: PujaService[];
}

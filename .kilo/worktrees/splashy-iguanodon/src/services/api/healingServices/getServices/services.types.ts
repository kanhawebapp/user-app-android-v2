export interface ServiceCategory {
  id: string;
  name: string;
  slug: string;
}

export interface Service {
  id: string;
  name: string;
  slug: string;
  image?: string;
  description?: string;
  longText?: string;
  price: number;

  category?: ServiceCategory;
}

export interface GetServicesResponse {
  getServices: Service[];
}
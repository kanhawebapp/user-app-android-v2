export interface FreeServiceDetail {
  id: string;

  title: string;

  slug: string;

  href: string;

  icon: string;

  isActive: boolean;

  order: number;

  createdAt: string;

  updatedAt: string;
}

export interface GetFreeServiceByIdResponse {
  getFreeServiceById: FreeServiceDetail;
}

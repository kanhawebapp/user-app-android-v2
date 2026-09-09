// export interface FreeService {
//   id: string;

//   title: string;

//   slug: string;

//   href: string;

//   icon: string;

//   isActive: boolean;

//   order: number;

//   createdAt: string;

//   updatedAt: string;
// }

export interface FreeService {
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

export interface FreeServicesResponse {
  totalCount: number;

  data: FreeService[];
}

export interface GetFreeServicesResponse {
  getFreeServices: FreeServicesResponse;
}

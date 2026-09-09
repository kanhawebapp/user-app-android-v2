export interface Banner {
  id: string;

  heading: string;

  subheading: string;

  slug: string;

  bannerlink: string;

  imageUrl: string;

  status: boolean;

  bannerType?: string;
}

export interface BannerPagination {
  totalCount: number;

  data: Banner[];
}

export interface GetBannersResponse {
  getBanners: BannerPagination;
}

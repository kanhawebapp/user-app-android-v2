export interface AstrologerMapping {
  price: number;
}

export interface CategoryService {
  id: string;

  name: string;

  slug: string;

  image?: string;

  description?: string;

  price: number;

  astrologerMappings: AstrologerMapping[];
}

export interface CategoryWithServices {
  id: string;

  name: string;

  slug: string;

  services: CategoryService[];
}

export interface GetCategoryResponse {
  getCategory: CategoryWithServices | null;
}

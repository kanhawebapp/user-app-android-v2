export interface Category {
  id: string;
  name: string;
  slug: string;
  image?: string;
}

export interface GetCategoriesResponse {
  getCategories: Category[];
}
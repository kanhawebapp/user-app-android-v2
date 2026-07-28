export interface BlogCategory {
  id: string;
  name: string;
  slug: string;
}

export interface Blog {
  id: string;

  title: string;

  slug: string;

  featuredImage: string;

  createdAt: string;

  categories: BlogCategory[];
}

export interface GetBlogsResponse {
  blogs: Blog[];
}
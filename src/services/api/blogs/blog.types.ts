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

export interface BlogDetail {
  id: string;

  title: string;

  slug: string;

  content: string;

  featuredImage: string;

  createdAt: string;

  categories: BlogCategory[];
}

export interface GetBlogBySlugResponse {
  blogBySlug: BlogDetail;
}

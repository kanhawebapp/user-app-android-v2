export interface FAQ {
  id: string;

  question: string;

  answer: string;

  createdAt: string;

  updatedAt: string;
}

export interface FAQPagination {
  totalCount: number;

  data: FAQ[];
}

export interface GetFAQsResponse {
  getFaqs: FAQPagination;
}
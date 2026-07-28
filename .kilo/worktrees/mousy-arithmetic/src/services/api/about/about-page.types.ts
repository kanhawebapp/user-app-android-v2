export interface AboutPerson {
  name: string;

  image: string;

  description: string;

  designation: string;
}

export interface AboutPage {
  id: string;

  pageType: string;

  heroTitle: string;

  heroDescription: string;

  mentors: AboutPerson[];

  founders: AboutPerson[];

  metaTitle: string;

  metaDescription: string;

  keywords: string[];

  status: string;

  createdAt: string;

  updatedAt: string;
}

export interface GetAboutPageResponse {
  getAboutPage: AboutPage;
}
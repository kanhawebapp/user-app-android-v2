// export interface Testimonial {
//   id: string;

//   name: string;

//   address: string;

//   content: string;

//   image: string;

//   rating: number;

//   createdAt: string;

//   updatedAt: string;
// }

// export interface GetTestimonialsResponse {
//   getTestimonials: Testimonial[];
// }
export interface Testimonial {
  id: string;

  name: string;

  address: string;

  content: string;

  image: string;

  rating: number;

  createdAt: string;

  updatedAt: string;
}

export interface TestimonialResponse {
  totalCount: number;

  data: Testimonial[];
}

export interface GetTestimonialsResponse {
  getTestimonials: TestimonialResponse;
}
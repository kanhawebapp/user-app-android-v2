export interface ServiceCategory {
  id: string;
  name: string;
  slug: string;
}

/**
 * The astrologer as it is exposed through a service's `astrologerMappings`.
 */
export interface ServiceAstrologer {
  id: string;
  name: string;
  displayName?: string;
  profilePic?: string;
  experience?: number;
  rating?: number;
  skills?: string[];
  languages?: string[];
  about?: string;
}

/**
 * `ServiceAstrologer` join row: binds an astrologer to a service with the
 * price configured for that service. `id` here is the mapping id, not the
 * astrologer id (that one is `astrologer.id`).
 */
export interface ServiceAstrologerMapping {
  id: string;
  price: number;
  astrologer: ServiceAstrologer;
}

export interface Service {
  id: string;
  name: string;
  slug: string;
  image?: string;
  description?: string;
  longText?: string;
  price: number;

  category?: ServiceCategory;

  astrologerMappings?: ServiceAstrologerMapping[] | null;
}

export interface GetServicesResponse {
  getServices: Service[];
}
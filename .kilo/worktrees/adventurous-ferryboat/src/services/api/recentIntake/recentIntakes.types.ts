// ==========================================
// recentIntakes.types.ts
// ==========================================

export interface Intake {
  id: string;
  name: string;
  countryCode: string;
  mobile: string;
  gender?: string;
  birthDate?: string;
  birthTime?: string;
  occupation?: string;
  birthPlace?: string;
  __typename?: string;
}

export interface RecentIntakesApiResponse {
  success: boolean;
  message: string;
  data: Intake[];
  __typename?: string;
}

export interface RecentIntakesResponse {
  recentIntakes: RecentIntakesApiResponse;
}
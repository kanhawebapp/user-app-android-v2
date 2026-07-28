export interface UpdateUserInput {
  name?: string;
  gender?: string;
  birthDate?: string;
  birthTime?: string;
  occupation?: string;
}

export interface UpdateUserProfileResponse {
  updateUserProfile: {
    id: string;
    name: string;
    __typename?: string;
  };
}
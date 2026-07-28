export interface UserProfile {
  profilePic: string;
  id: string;
  name: string;
  mobile: string;
  countryCode: string;
  gender?: string;
  birthDate?: string;
  birthTime?: string;
  occupation?: string;
  __typename?: string;
}

export interface UserProfileResponse {
  getUserProfile: UserProfile;
}
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

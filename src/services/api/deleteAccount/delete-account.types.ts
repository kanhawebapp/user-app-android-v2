export interface SoftDeleteUserResponse {
  success: boolean;
  message: string;
}

export interface SoftDeleteUserGraphQLResponse {
  softDeleteUser: SoftDeleteUserResponse;
}

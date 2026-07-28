
export interface FollowResponse {
  success: boolean;
  message: string;
}

export interface FollowAstrologerResponse {
  followAstrologer: FollowResponse;
}

export interface UnfollowAstrologerResponse {
  unfollowAstrologer: FollowResponse;
}

export interface IsFollowingResponse {
  isFollowing: {
    isFollowing: boolean;
  };
}
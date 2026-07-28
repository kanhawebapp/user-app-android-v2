// import {graphqlRequest} from '../graphql.client';

// import {
//   FollowAstrologerResponse,
//   UnfollowAstrologerResponse,
//   IsFollowingResponse,
// } from './follow-astrologer.types';

// const FOLLOW_ASTROLOGER = `
// mutation FollowAstrologer($astrologerId: ID!) {
//   followAstrologer(
//     astrologerId: $astrologerId
//   ) {
//     success
//     message
//   }
// }
// `;

// const UNFOLLOW_ASTROLOGER = `
// mutation UnfollowAstrologer($astrologerId: ID!) {
//   unfollowAstrologer(
//     astrologerId: $astrologerId
//   ) {
//     success
//     message
//   }
// }
// `;

// const IS_FOLLOWING = `
// query IsFollowing($astrologerId: ID!) {
//   isFollowing(
//     astrologerId: $astrologerId
//   ) {
//     isFollowing
//   }
// }
// `;


// export const followAstrologer = async (
//   astrologerId: string,
// ) => {
//   const response =
//     await graphqlRequest<FollowAstrologerResponse>(
//       'FollowAstrologer',
//       FOLLOW_ASTROLOGER,
//       {
//         astrologerId,
//       },
//     );

//   return response.followAstrologer;
// };

// export const unfollowAstrologer = async (
//   astrologerId: string,
// ) => {
//   const response =
//     await graphqlRequest<UnfollowAstrologerResponse>(
//       'UnfollowAstrologer',
//       UNFOLLOW_ASTROLOGER,
//       {
//         astrologerId,
//       },
//     );

//   return response.unfollowAstrologer;
// };

// export const checkIsFollowing =
//   async (
//     astrologerId: string,
//   ) => {
//     const response =
//       await graphqlRequest<IsFollowingResponse>(
//         'IsFollowing',
//         IS_FOLLOWING,
//         {
//           astrologerId,
//         },
//       );

//     return response.isFollowing;
//   };


import {graphqlRequest} from '../graphql.client';

import {
  FollowAstrologerResponse,
  UnfollowAstrologerResponse,
  IsFollowingResponse,
} from './follow-astrologer.types';

const FOLLOW_ASTROLOGER = `
mutation FollowAstrologer($astrologerId: ID!) {
  followAstrologer(astrologerId: $astrologerId) {
    success
    message
  }
}
`;

const UNFOLLOW_ASTROLOGER = `
mutation UnfollowAstrologer($astrologerId: ID!) {
  unfollowAstrologer(astrologerId: $astrologerId) {
    success
    message
  }
}
`;

const IS_FOLLOWING = `
query IsFollowing($astrologerId: ID!) {
  isFollowing(astrologerId: $astrologerId) {
    isFollowing
  }
}
`;

export const followAstrologer = async (
  astrologerId: string,
) => {
  try {
    console.log(
      'FOLLOW ASTROLOGER ID:',
      astrologerId,
    );

    const response =
      await graphqlRequest<FollowAstrologerResponse>(
        'FollowAstrologer',
        FOLLOW_ASTROLOGER,
        {
          astrologerId,
        },
      );

    console.log(
      'FOLLOW RESPONSE:',
      JSON.stringify(response, null, 2),
    );

    return response.followAstrologer;
  } catch (error: any) {
    console.log(
      'FOLLOW ASTROLOGER ERROR:',
      JSON.stringify(
        error?.response?.data ||
          error?.message ||
          error,
        null,
        2,
      ),
    );

    throw error;
  }
};

export const unfollowAstrologer = async (
  astrologerId: string,
) => {
  try {
    console.log(
      'UNFOLLOW ASTROLOGER ID:',
      astrologerId,
    );

    const response =
      await graphqlRequest<UnfollowAstrologerResponse>(
        'UnfollowAstrologer',
        UNFOLLOW_ASTROLOGER,
        {
          astrologerId,
        },
      );

    console.log(
      'UNFOLLOW RESPONSE:',
      JSON.stringify(response, null, 2),
    );

    return response.unfollowAstrologer;
  } catch (error: any) {
    console.log(
      'UNFOLLOW ASTROLOGER ERROR:',
      JSON.stringify(
        error?.response?.data ||
          error?.message ||
          error,
        null,
        2,
      ),
    );

    throw error;
  }
};

export const getFollowStatus = async (
  astrologerId: string,
) => {
  try {
    const response =
      await graphqlRequest<IsFollowingResponse>(
        'IsFollowing',
        IS_FOLLOWING,
        {
          astrologerId,
        },
      );

    console.log(
      'FOLLOW STATUS RESPONSE:',
      JSON.stringify(response, null, 2),
    );

    return (
      response?.isFollowing?.isFollowing ||
      false
    );
  } catch (error: any) {
    console.log(
      'FOLLOW STATUS ERROR:',
      JSON.stringify(
        error?.response?.data ||
          error?.message ||
          error,
        null,
        2,
      ),
    );

    return false;
  }
};

import {useEffect, useState} from 'react';
import {getUserProfile, updateUserProfile} from './profile.api';
import {UpdateUserInput, UserProfile} from './profile.types';

// export const useProfile = () => {
//   const [profile, setProfile] = useState<UserProfile | null>(null);
//   const [loading, setLoading] = useState(false);

//   const fetchProfile = async () => {
//     try {
//       setLoading(true);

//       const res = await getUserProfile();

//       setProfile(res);
//     } catch (error) {
//       console.log('PROFILE HOOK ERROR:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchProfile();
//   }, []);

//   return {
//     profile,
//     loading,
//     refresh: fetchProfile,
//   };
// };

// export const useProfile = () => {
//   const [profile, setProfile] = useState<UserProfile | null>(null);
//   const [loading, setLoading] = useState(false);
//   const [updating, setUpdating] = useState(false);

//   const fetchProfile = async () => {
//     try {
//       setLoading(true);
//       const res = await getUserProfile();
//       setProfile(res);
//     } catch (error) {
//       console.log('PROFILE FETCH ERROR:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const updateProfile = async (input: UpdateUserInput) => {
//     try {
//       setUpdating(true);

//       const res = await updateUserProfile(input);

//       // 🔥 BEST PRACTICE: refetch full profile
//       await fetchProfile();

//       return res;
//     } catch (error) {
//       console.log('PROFILE UPDATE ERROR:', error);
//       throw error;
//     } finally {
//       setUpdating(false);
//     }
//   };

//   useEffect(() => {
//     fetchProfile();
//   }, []);

//   return {
//     profile,
//     loading,
//     updating,
//     refresh: fetchProfile,
//     updateProfile,
//   };
// };



export const useProfile = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(false);
  const [updating, setUpdating] = useState(false);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const res = await getUserProfile();
      setProfile(res);
    } catch (error) {
      console.log('PROFILE FETCH ERROR:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (input: UpdateUserInput) => {
    try {
      setUpdating(true);

      const res = await updateUserProfile(input);

      // 🔥 BEST PRACTICE: refetch full profile
      await fetchProfile();

      return res;
    } catch (error) {
      console.log('PROFILE UPDATE ERROR:', error);
      throw error;
    } finally {
      setUpdating(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  return {
    profile,
    loading,
    updating,
    refresh: fetchProfile,
    updateProfile,
  };
};
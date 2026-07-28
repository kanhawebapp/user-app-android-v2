import AsyncStorage from '@react-native-async-storage/async-storage';

export const getAuthToken = async () => {
  return AsyncStorage.getItem('token');
};

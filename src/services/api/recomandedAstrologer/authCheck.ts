import { STORAGE_KEYS } from "../../../constants/app.constants";
import secureStorage from "../../storage/secure.storage";
import { useAuthStore } from "../../../stores/auth.store";

export const getAuthToken = async () => {
  const authToken = useAuthStore.getState().accessToken;
  if (authToken) {
    return authToken;
  }

  return secureStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
};
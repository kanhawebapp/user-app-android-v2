import { STORAGE_KEYS } from "../../../constants/app.constants";
import secureStorage from "../../storage/secure.storage";

export const getAuthToken = async () => {
  return secureStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
};
import * as SecureStore from "expo-secure-store";

export const save_access_token = async (value) => {
  await SecureStore.setItemAsync("access_token", value);
};

export const get_access_token = async () => {
  const acc_tk = await SecureStore.getItemAsync("access_token");
  if (acc_tk) {
    // console.log(acc_tk);
    return acc_tk;
  } else {
    return "";
  }
};

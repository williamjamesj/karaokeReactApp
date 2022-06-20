import { useState, useContext, createContext } from "react";
import { setItemAsync, getItemAsync, deleteItemAsync } from "expo-secure-store";
import { Platform } from "react-native";

// export const TokenContext = createContext({
//   // The user context stores all of the relevant user data.
//   token: undefined,
//   setToken: () => {},
// });

export async function getToken() {
  token = await getItemAsync("token");
  return token;
}

export async function setToken(token) {
  if (Platform.OS !== "web") {
    setItemAsync("token", token);
  }
  return;
}

export async function wipeKey() {
  deleteItemAsync("token");
  return;
}

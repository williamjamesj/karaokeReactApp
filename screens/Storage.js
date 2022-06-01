import { useState, useContext, createContext } from "react";
import { setItemAsync, getItemAsync, deleteItemAsync } from "expo-secure-store";

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
  setItemAsync("token", token);
  return;
}

export async function wipeKey() {
  deleteItemAsync("token");
  return;
}

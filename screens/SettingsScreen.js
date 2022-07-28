import { View, Button } from "react-native";
import { useContext } from "react";
import { stylesGlobal } from "../Styles";
import { UserContext } from "./LoginScreen";
import { setToken, wipeKey } from "./Storage";
import { BigButton } from "../Styles";

export function SettingsScreen() {
  const { setAuthenticated } = useContext(UserContext);
  return (
    <View style={stylesGlobal.background}>
      <BigButton
        text="Log Out"
        doOnPress={() => {
          logOut(setAuthenticated);
        }}
      />
    </View>
  );
}

function logOut(setAuthenticated) {
  setAuthenticated(false);
  wipeKey();
  return;
}

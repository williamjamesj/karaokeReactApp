import { View, Button } from "react-native";
import { useContext } from "react";
import { stylesGlobal } from "../Styles";
import { UserContext } from "./LoginScreen";
import { setToken, wipeKey } from "./Storage";

export function SettingsScreen() {
  const { setAuthenticated } = useContext(UserContext);
  return (
    <View style={stylesGlobal.background}>
      <Button
        title="Log Out"
        onPress={() => {
          logOut(setAuthenticated);
        }}
      ></Button>
    </View>
  );
}

function logOut(setAuthenticated) {
  setAuthenticated(false);
  wipeKey();
  return;
}

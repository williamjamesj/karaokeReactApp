import { View, Button } from "react-native";
import { stylesGlobal } from "./Styles";

export function SettingsScreen() {
  return (
    <View style={stylesGlobal.background}>
      <Button title="Log Out"></Button>
    </View>
  );
}

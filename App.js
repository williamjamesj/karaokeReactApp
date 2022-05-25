import { useState, useContext } from "react";
import { View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Ionicons from "@expo/vector-icons/Ionicons";
import { LoginScreen, UserContext } from "./screens/LoginScreen";
import { HomeScreen } from "./screens/HomeScreen";
import { SettingsScreen } from "./screens/SettingsScreen";
import { TwoFactorScreen } from "./screens/TwoFactorScreen";

const navigator = createNativeStackNavigator();
const homeNavigator = createBottomTabNavigator();

function App() {
  const [authenticated, setAuthenticated] = useState(false);
  return (
    <UserContext.Provider value={{ authenticated, setAuthenticated }}>
      <NavigationContainer>
        <MainNavigator />
      </NavigationContainer>
    </UserContext.Provider>
  );
}

function MainApp() {
  // This tab navigator contains all of the features of the project, except for login.
  return (
    <homeNavigator.Navigator>
      <navigator.Screen
        name="Home"
        component={HomeScreen}
        options={{ headerShown: false }}
      />
      <navigator.Screen name="Settings" component={SettingsScreen} />
    </homeNavigator.Navigator>
  );
}

function MainNavigator() {
  // The main navigator chooses between the login screen and the tab navigator.
  const { authenticated } = useContext(UserContext);
  return (
    <navigator.Navigator>
      {authenticated == true ? ( // When the user has authenticated, they get access to the main app.
        <navigator.Screen
          name="Main App"
          component={MainApp}
          options={{ headerShown: false }}
        />
      ) : authenticated == "2fa" ? (
        <navigator.Screen
          name="Two Factor Authentication"
          component={TwoFactorScreen}
          options={{ headerShown: true }}
        />
      ) : (
        <navigator.Screen
          name="Login"
          component={LoginScreen}
          options={{ headerShown: false }}
        />
      )}
    </navigator.Navigator>
  );
}

export default App;

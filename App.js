import { useState, useContext } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Ionicons from "@expo/vector-icons/Ionicons";
import { LoginScreen, UserContext } from "./LoginScreen";
import { HomeScreen } from "./HomeScreen";

const navigator = createNativeStackNavigator();

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

export const MainNavigator = () => {
  const { authenticated } = useContext(UserContext);
  console.log(authenticated);
  return (
    <navigator.Navigator>
      {authenticated ? (
        <navigator.Screen name="Home" component={HomeScreen} />
      ) : (
        <navigator.Screen name="Login" component={LoginScreen} />
      )}
    </navigator.Navigator>
  );
};

export default App;

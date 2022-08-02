import { useState, useContext } from "react";
import { View, StatusBar } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Ionicons from "@expo/vector-icons/Ionicons";
import { RegistrationScreen } from "./screens/RegistrationScreen";
import { LoginScreen, UserContext } from "./screens/LoginScreen";
import { HomeScreen } from "./screens/HomeScreen";
import { SettingsScreen } from "./screens/SettingsScreen";
import { TwoFactorScreen } from "./screens/TwoFactorScreen";
import { SongFinderScreen } from "./screens/SongFinderScreen";
import { SnippetsScreen } from "./screens/SnippetsScreen";
import { setStatusBarStyle } from "expo-status-bar";

const navigator = createNativeStackNavigator();
const homeNavigator = createBottomTabNavigator();

function App() {
  // This is the entry point into the app.
  const [authenticated, setAuthenticated] = useState(false);
  return (
    // Establish the user context, and initialise the main navigator.
    <UserContext.Provider value={{ authenticated, setAuthenticated }}>
      <NavigationContainer>
        <MainNavigator />
      </NavigationContainer>
    </UserContext.Provider>
  );
}

function MainApp() {
  // This tab navigator contains all of the features of the project, except for login.
  setStatusBarStyle("dark-content");
  return (
    <homeNavigator.Navigator // This home navigator contains the main navbar that is visible after the authentication flow, and present throughout most of the app.
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === "Home") {
            // This if else block determines which icon is displayed on the navbar.
            iconName = focused ? "home" : "home-outline"; // If the tab is selected, a different icon will be displayed to when it is not selected.
          } else if (route.name === "Song Finder") {
            iconName = focused ? "musical-note" : "musical-note-sharp";
          } else if (route.name === "Settings") {
            iconName = focused ? "cog" : "cog-outline";
          } else if (route.name === "Snippets") {
            iconName = focused ? "volume-high" : "volume-high-outline";
          }
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: "blue",
        tabBarInactiveTintColor: "gray",
      })}
    >
      <navigator.Screen
        name="Home"
        component={HomeScreen}
        options={{ headerShown: false }}
      />
      <navigator.Screen
        name="Song Finder"
        component={SongFinderScreen}
        options={{ headerShown: false }}
      />
      <navigator.Screen
        name="Snippets"
        component={SnippetsScreen}
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
          name="Main App" // The main app includes many sub-navigators, but here is where it is first initialised.
          component={MainApp}
          options={{ headerShown: false }}
        />
      ) : authenticated == "2fa" ? (
        <navigator.Screen
          name="Two Factor Authentication" // The login page will change to this page if 2fa is required for authentication.
          component={TwoFactorScreen}
          options={{ headerShown: true }}
        />
      ) : authenticated == "register" ? (
        <navigator.Screen
          name="Registration" // This page will be selected if the user chooses to create an acccount.
          component={RegistrationScreen}
          options={{ headerShown: true }}
        />
      ) : (
        <navigator.Screen
          name="Login" // This is the default page, and when it loads, the app will attempt to authenticate with a token first.
          component={LoginScreen}
          options={{ headerShown: false }}
        />
      )}
    </navigator.Navigator>
  );
}

export default App; // Set App as the entry point.

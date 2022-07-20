import { Pressable, Text, View, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "@expo/vector-icons/Ionicons";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { EventCreationFlow } from "./EventCreate";
import { stylesGlobal } from "../Styles";
import { BigButton } from "../Styles";
const Stack = createNativeStackNavigator();

export function HomeScreen() {
  // This needs to be a navigator, as there are two screens, the input screen and the results screen.
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Main"
        component={MainHomeScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Event"
        component={EventCreationFlow}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}

export function MainHomeScreen({ route, navigation }) {
  return (
    <SafeAreaView>
      <ScrollView contentContainerStyle={{}}>
        <BigButton
          doOnPress={() => navigateToEventCreate(navigation)}
          text="Create Event"
        />
        <BigButton doOnPress={dummyOnClick} text="Record Audio" />
      </ScrollView>
    </SafeAreaView>
  );
}

function dummyOnClick() {
  console.log("hello");
}

function navigateToEventCreate(navigation) {
  navigation.navigate("Event");
}

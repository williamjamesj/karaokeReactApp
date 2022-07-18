import { Pressable, Text, View, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "@expo/vector-icons/Ionicons";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { EventCreateScreen } from "./EventCreate";
import { stylesGlobal } from "../Styles";

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
        name="Create Event"
        component={EventCreateScreen}
        options={{ headerShown: true }}
      />
      {/* <Stack.Screen
        name="Song Details"
        component={DetailsScreen}
        options={{ headerShown: false }}
      /> */}
    </Stack.Navigator>
  );
}

export function MainHomeScreen({ route, navigation }) {
  return (
    <SafeAreaView>
      <ScrollView
        contentContainerStyle={{
          justifyContent: "space-evenly",
          height: "100%",
        }}
      >
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
  navigation.navigate("Create Event");
}

function BigButton({ doOnPress, text, navigation }) {
  return (
    <View style={{ alignItems: "center", height: "8%" }}>
      <Pressable
        style={{
          backgroundColor: "#091540",
          borderRadius: 10,
          padding: 10,
          width: "75%",
          height: "100%",
          alignItems: "center",
        }}
        onPress={doOnPress}
      >
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-evenly",
          }}
        >
          <Text style={{ color: "white", fontSize: 25, flex: 5 }}>{text}</Text>
          <Ionicons
            name="chevron-forward-outline"
            style={{
              fontSize: 25,
              alignSelf: "center",
            }}
            color="white"
          />
        </View>
      </Pressable>
    </View>
  );
}

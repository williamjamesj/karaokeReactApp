import {
  Pressable,
  Text,
  View,
  ScrollView,
  FlatList,
  SafeAreaView,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { EventCreationFlow } from "./EventCreate";
import { stylesGlobal } from "../Styles";
import { BigButton } from "../Styles";
import AudioRecordScreen from "./AudioRecordScreen";
import { SnippetViewScreen } from "./SnippetViewScreen";
import { EventsViewScreen } from "./EventsMap";
import { ENDPOINT_URL } from "./LoginScreen";
import { useEffect, useState } from "react";
import { render } from "react-dom";
import { EventViewScreen } from "./EventsMap";
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
      <Stack.Screen
        name="Event View"
        component={EventsViewScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen name="Interested Event" component={EventViewScreen} />
    </Stack.Navigator>
  );
}

export function MainHomeScreen({ route, navigation }) {
  const [events, setEvents] = useState([]);
  useEffect(() => {
    retrieveEvents(setEvents);
    console.log("Events retrieved.");
  }, []);
  return (
    <SafeAreaView>
      <ScrollView contentContainerStyle={{}}>
        <BigButton
          doOnPress={() => navigateToEventCreate(navigation)}
          text="Create Event"
        />
        <BigButton
          text="View Events"
          doOnPress={() => navigation.navigate("Event View")}
        />
        <Text style={[stylesGlobal.title, { alignSelf: "center" }]}>
          My Events:
        </Text>
        {events.map((item) => (
          <EventCard key={item.eventID} item={item} navigation={navigation} />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

function EventCard(item, navigation) {
  return (
    <Pressable
      style={{
        height: "auto", // Automatically adjusts to the size of the content.
        width: "95%",
        alignSelf: "center",
        borderColor: "black",
        borderWidth: 1,
        borderRadius: 10,
        padding: 5,
        margin: 5,
        backgroundColor: "#D4D5D8",
        // https://stackoverflow.com/questions/50162879/create-raised-or-shadow-effect-on-touchableopacity-react-native - makes the cards look like they are elevated.
        shadowColor: "rgba(0,0,0, .4)", // IOS
        shadowOffset: { height: 1, width: 1 }, // IOS
        shadowOpacity: 1, // IOS
        shadowRadius: 1, //IOS
        elevation: 2, // Android
      }}
      onPress={() =>
        navigation.navigate("SnippetView", { snippetID: item.item.eventID })
      }
    >
      <Text style={{ marginBottom: 5 }}>
        {item.item.title} by{" "}
        <Text style={{ fontWeight: "bold" }}>{item.item.name}</Text>
      </Text>
      <Text style={{ marginBottom: 10 }}>{item.item.description}</Text>
      <View style={{ flexDirection: "row", marginTop: "auto" }}>
        <IoniconWithText
          name="checkmark-circle-outline"
          text={item.item.likes ? item.item.likes : 0}
          style={{ paddingRight: 5 }}
        />
        <IoniconWithText
          name="eye-outline"
          text={item.item.views ? item.item.views : 0}
          style={{ paddingRight: 5 }}
        />
      </View>
    </Pressable>
  );
}

function dummyOnClick() {
  console.log("hello");
}

function navigateToEventCreate(navigation) {
  navigation.navigate("Event");
}

function retrieveEvents(setEvents) {
  fetch(ENDPOINT_URL + "/user_events", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    }, // No body is required, as the server already has the user's ID stored as a session variable.
  })
    .then((response) => response.json())
    .then((json) => setEvents(json.events))
    .catch((error) => console.log(error));
}

function IoniconWithText({ name, text, style = {} }) {
  return (
    <View style={[{ flexDirection: "row" }, style]}>
      <Ionicons name={name} size={20} />
      <Text style={{ alignSelf: "center" }}>{text}</Text>
    </View>
  );
}

import {
  View,
  Text,
  TextInput,
  Dimensions,
  SafeAreaView,
  ScrollView,
  Button,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { useState, useEffect, createContext, useContext } from "react";
import { stylesGlobal } from "../Styles";
import MapView from "react-native-maps";
import { Marker } from "react-native-maps";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { showMessage, hideMessage } from "react-native-flash-message";
import { LoadingIndicator } from "./LoadingAnimation";
import FlashMessage from "react-native-flash-message";
import * as Location from "expo-location";
import { BigButton, FormInput } from "../Styles";
import { ENDPOINT_URL } from "./LoginScreen";
import DateTimePicker from "@react-native-community/datetimepicker";
import { showLocation } from "react-native-map-link";

const Stack = createNativeStackNavigator();

export function EventsViewScreen({ route, navigation }) {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Events Map"
        component={EventsMapScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen name="Event Details" component={EventViewScreen} />
    </Stack.Navigator>
  );
}

function EventsMapScreen({ route, navigation }) {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [latitude, setLatitude] = useState(-27.46977); // Default lat long is Brisbane.
  const [longitude, setLongitude] = useState(153.025131);
  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        return;
      }

      let location = await Location.getLastKnownPositionAsync({});
      setLatitude(location.coords.latitude);
      setLongitude(location.coords.longitude);
    })();
    retrieveEvents(setEvents, setLoading); // It's not really a race condition if you know you're going to win the race?
  }, []);
  return (
    <SafeAreaView>
      <LoadingIndicator active={loading} />
      <MapView
        style={{ width: "100%", height: "100%" }}
        showsUserLocation={true}
        region={{
          latitude: latitude,
          longitude: longitude,
          latitudeDelta: 0.1, // Determines how zoomed out the map is.
          longitudeDelta: 0.1,
        }}
      >
        {events.map((item, index) => (
          <Marker
            key={index} // Each event shows up as a marker on the map. These keys are arbitary and unused, but required to render multiple markers.
            title={item.title}
            description={item.description}
            coordinate={{ latitude: item.latitude, longitude: item.longitude }}
            onCalloutPress={() => {
              navigation.navigate("Event Details", { eventID: item.eventID });
            }}
          />
        ))}
      </MapView>
    </SafeAreaView>
  );
}

export function EventViewScreen({ route, navigation }) {
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState(new Date());
  const [likes, setLikes] = useState(0);
  const [views, setViews] = useState(0);
  const [latitude, setLatitude] = useState(0);
  const [longitude, setLongitude] = useState(0);
  const [name, setName] = useState("");
  useEffect(() => {
    retrieveEvent(
      route.params.eventID,
      setTitle,
      setDescription,
      setDate,
      setLikes,
      setViews,
      setLatitude,
      setLongitude,
      setName,
      setLoading
    );
  }, []);
  return (
    <SafeAreaView
      style={[
        stylesGlobal.background,
        { justifyContent: "flex-start", alignItems: "flex-start" },
      ]}
    >
      <FlashMessage position="top" floating={true} />
      <LoadingIndicator active={loading} />
      <Text style={[stylesGlobal.title, { alignSelf: "center" }]}>{title}</Text>
      <Text style={[stylesGlobal.subtitle, { alignSelf: "center" }]}>
        Created By: {name}
      </Text>
      <View style={{ margin: 5 }}>
        <Text>Description: {description}</Text>
        <Text>Starts on: {date.toLocaleDateString()}</Text>
        <Text>Starts at: {date.toLocaleTimeString()}</Text>
        <Text>Interested: {likes}</Text>
        <Text>Views: {views}</Text>
      </View>

      <BigButton
        text="Register Interest"
        doOnPress={() => {
          like(route.params.eventID, setLoading);
        }}
        style={{ alignSelf: "center" }}
      />
      <BigButton
        text="Navigate"
        doOnPress={() => {
          showLocation({
            latitude: latitude,
            longitude: longitude,
            alwaysIncludeGoogle: true,
          });
        }}
        style={{ alignSelf: "center" }}
      />
    </SafeAreaView>
  );
}

function like(eventID, setLoading) {
  setLoading(true);
  fetch(ENDPOINT_URL + "/event_like", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      eventID: eventID,
    }),
  })
    .then((response) => response.json())
    .then((json) => {
      if (json.status == "already liked") {
        // Registrations of interest are stored as "likes" in the database, but the terminology of likes isn't used.
        showMessage({
          message: "You have already registered interest in this event",
          type: "info",
        });
      } else {
        showMessage({
          message: "You have registered interest in this event",
          type: "success",
        });
      }
      setLoading(false);
    })
    .catch((error) => {
      console.log(error);
      setLoading(false);
    });
}

function retrieveEvents(setEvents, setLoading) {
  setLoading(true);
  fetch(ENDPOINT_URL + "/events_list", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.json())
    .then((json) => {
      setEvents(json.events);
      setLoading(false);
    })
    .catch((error) => console.log(error));
}

function retrieveEvent(
  eventID,
  setTitle,
  setDescription,
  setDate,
  setLikes,
  setViews,
  setLatitude,
  setLongitude,
  setName,
  setLoading
) {
  setLoading(true);
  fetch(ENDPOINT_URL + "/event_details", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      eventID: eventID,
    }),
  })
    .then((response) => response.json())
    .then((json) => {
      console.log(json.event);
      console.log(json.event.startTime);
      setTitle(json.event.title);
      setDescription(json.event.description);
      setDate(new Date(json.event.startTime * 1000));
      setLikes(json.event.likes);
      setViews(json.event.views);
      setLatitude(json.event.latitude);
      setLongitude(json.event.longitude);
      setName(json.event.name);
      setLoading(false);
    })
    .catch((error) => console.log(error));
}

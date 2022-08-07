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

const Stack = createNativeStackNavigator();

export function EventCreationFlow({ route, navigation }) {
  // The flow of the event creation is: Pick location on map -> enter details about events -> submit event
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Map"
        component={EventMapScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Create Event"
        component={EventCreateScreen}
        options={{ headerShown: true }}
      />
    </Stack.Navigator>
  );
}

function EventMapScreen({ route, navigation }) {
  const [locationName, setLocationName] = useState("");
  const [latitude, setLatitude] = useState(0);
  const [longitude, setLongitude] = useState(0);
  const [originalLatitude, setOriginalLatitude] = useState(0);
  const [originalLongitude, setOriginalLongitude] = useState(0);
  const [loading, setLoading] = useState(false);
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    (async () => {
      setLoading(true);
      console.log("Location Start");
      let { status } = await Location.requestForegroundPermissionsAsync(); // This takes a good while to process, so give the user the loading indicator while it runs. Likely misconfigured.
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        return;
      } else {
        let location = await Location.getCurrentPositionAsync({});
        setLatitude(location.coords.latitude);
        setLongitude(location.coords.longitude);
        setOriginalLatitude(location.coords.latitude);
        setOriginalLongitude(location.coords.longitude);
        setLoading(false); // Stop loading, the location has been found.
        reverseGeocode(
          // The geocode requests are quite fast, and it doesn't really matter if it happens after the loading indicator.
          location.coords.latitude,
          location.coords.longitude,
          setLocationName
        );
        setLoaded(true);
      }
    })();
  }, []);
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <LoadingIndicator active={loading} />
      <FlashMessage position="top" floating={true} />
      <View
        style={{
          height: "80%",
        }}
      >
        {loaded ? ( // Wait until the location has been found to display the map, otherwise the map starts at Null Island.
          <MapView
            style={{
              height: "100%",
              width: "100%",
            }}
            tracksViewChanges={false}
            initialRegion={{
              longitude: originalLongitude,
              latitude: originalLatitude,
              latitudeDelta: 0.05,
              longitudeDelta: 0.05,
            }}
          >
            <MapView.Marker
              coordinate={{ latitude: latitude, longitude: longitude }}
              draggable
              onDragEnd={(e) => {
                setLatitude(e.nativeEvent.coordinate.latitude);
                setLongitude(e.nativeEvent.coordinate.longitude);
                reverseGeocode(
                  e.nativeEvent.coordinate.latitude,
                  e.nativeEvent.coordinate.longitude,
                  setLocationName
                );
              }}
            />
          </MapView>
        ) : null}
      </View>
      <ScrollView style={{}}>
        <Text>Latitude: {latitude}</Text>
        <Text>Longitude: {longitude}</Text>
        <Text>Location: {locationName}</Text>
        <BigButton
          text="Next"
          doOnPress={() => {
            navigation.navigate("Create Event", {
              latitude: latitude,
              longitude: longitude,
            });
          }}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

function EventCreateScreen({ route, navigation }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [latitude, setLatitude] = useState(route.params.latitude);
  const [longitude, setLongitude] = useState(route.params.longitude);
  const [date, setDate] = useState(new Date());
  const [isPickerShow, setIsPickerShow] = useState(true);

  const showPicker = () => {
    setIsPickerShow(true);
  };

  return (
    <TouchableWithoutFeedback
      onPress={() => {
        Keyboard.dismiss();
      }}
    >
      <View style={[stylesGlobal.background]}>
        <FlashMessage position="top" floating={true} />
        <FormInput
          title="Title:"
          onChange={(text) => setTitle(text)}
        ></FormInput>
        <FormInput
          title="Description:"
          onChange={(text) => setDescription(text)}
          multiline={true}
          height={200}
        />

        {/* The button that used to trigger the date picker */}
        {!isPickerShow && (
          <View>
            <Button title="Show Picker" color="purple" onPress={showPicker} />
          </View>
        )}

        {/* The date picker */}
        {isPickerShow && (
          <DateTimePicker
            value={date}
            mode="datetime"
            display={Platform.OS === "ios" ? "spinner" : "default"}
            is24Hour={true}
            onChange={(event, value) => {
              setDate(value);
              if (Platform.OS === "android") {
                setIsPickerShow(false);
              }
            }}
            style={{
              width: 320,
              height: 260,
              display: "flex",
              justifyContent: "center",
              alignItems: "flex-start",
            }}
          />
        )}
        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
            width: "100%",
          }}
        >
          <BigButton
            doOnPress={() => {
              createEvent(
                title,
                description,
                latitude,
                longitude,
                date,
                navigation
              );
            }}
            text="Submit"
            weightLoss={150}
            chevron={false}
          />
          <BigButton
            doOnPress={() => {
              navigation.navigate("Main");
            }}
            text="Cancel"
            weightLoss={150}
            chevron={false}
          />
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
}

function createEvent(
  title,
  description,
  latitude,
  longitude,
  date,
  navigation
) {
  fetch(ENDPOINT_URL + "/create_event", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      title: title,
      description: description,
      latitude: latitude,
      longitude: longitude,
      startTime: parseInt((date.getTime() / 1000).toFixed(0)),
    }),
  })
    .then((response) => response.json())
    .then((json) => {
      navigation.navigate("Main");
    });
}

function reverseGeocode(
  lat,
  long,
  setReversedLocation,
  requiredData = "display_name"
) {
  console.log("------------ Requesting ------------");
  fetch(
    `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat.toString()}&lon=${long.toString()}`,
    {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    }
  )
    .then((response) => response.json())
    .then((json) => {
      setReversedLocation(json[requiredData]);
    })
    .catch((error) => {
      console.log(error);
      showMessage({
        message: "Error finding location name.",
        type: "warning",
      });
    });
}

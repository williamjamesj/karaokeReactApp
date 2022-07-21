import { View, Text, TextInput, Dimensions, SafeAreaView } from "react-native";
import { useState, useEffect, createContext, useContext } from "react";
import { stylesGlobal } from "../Styles";
import MapView from "react-native-maps";
import { Marker } from "react-native-maps";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { showMessage, hideMessage } from "react-native-flash-message";
import FlashMessage from "react-native-flash-message";
import * as Location from "expo-location";
import { BigButton } from "../Styles";
import parseErrorStack from "react-native/Libraries/Core/Devtools/parseErrorStack";

const Stack = createNativeStackNavigator();

export const LatitudeContext = createContext({
  // The user context stores all of the relevant user data.
  latitude: 0,
  setLatitude: () => {},
});
export const LongitudeContext = createContext({
  // The user context stores all of the relevant user data.
  longitude: 0,
  setLongitude: () => {},
});

export function EventCreationFlow({ route, navigation }) {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Create Event"
        component={EventCreateScreen}
        options={{ headerShown: true }}
      />
      <Stack.Screen
        name="Map"
        component={EventMapScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}

function EventMapScreen({ route, navigation }) {
  const [locationName, setLocationName] = useState("");
  const { latitude, setLatitude } = useContext(LatitudeContext);
  const { longitude, setLongitude } = useContext(LongitudeContext);
  useEffect(() => {
    console.log(latitude);
    reverseGeocode(latitude, longitude, setLocationName);
  }, []);
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <FlashMessage position="top" floating={true} />
      <View
        style={{
          height: "90%",
        }}
      >
        <MapView
          style={{
            height: "100%",
            width: "100%",
          }}
          tracksViewChanges={false}
          region={{
            longitude: longitude,
            latitude: latitude,
            latitudeDelta: 0.05,
            longitudeDelta: 0.05,
          }}
        >
          <Marker
            coordinate={{
              longitude: latitude,
              latitude: longitude,
              latitudeDelta: 0.01,
              longitudeDelta: 0.01,
            }}
            draggable
            scrollEnabled={true}
            onDragEnd={(e) => {
              setLatitude(e.nativeEvent.coordinate["latitude"]);
              setLongitude(e.nativeEvent.coordinate["longitude"]);
              reverseGeocode(latitude, longitude, setLocationName);
            }}
          />
        </MapView>
      </View>
      <View style={{}}>
        <Text>Latitude: {latitude}</Text>
        <Text>Longitude: {longitude}</Text>
        <Text>Location: {locationName}</Text>
      </View>
    </SafeAreaView>
  );
}

function EventCreateScreen({ route, navigation }) {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const { latitude, setLatitude } = useContext(LatitudeContext);
  const { longitude, setLongitude } = useContext(LongitudeContext);
  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLatitude(location.coords.latitude);
      setLongitude(location.coords.longitude);
      setLocation(location);
      console.log(latitude);
      console.log(longitude);
    })();
  }, []);
  if (errorMsg) {
    showMessage({
      message: `Error finding location: ${errorMsg}`,
      type: "danger",
    });
  } else if (location) {
    console.log("Location found!");
  }
  return (
    <View style={[stylesGlobal.background]}>
      <FlashMessage position="top" floating={true} />
      <FormInput title="Title:"></FormInput>
      <FormInput title="Description:"></FormInput>
      <FormInput title="Latitude:">{latitude}</FormInput>
      <FormInput title="Longitude:">{longitude}</FormInput>
      <BigButton
        doOnPress={() => navigation.navigate("Map", {})}
        text="Change Location"
      />
      <View
        style={{
          flexDirection: "row",
          justifyContent: "center",
          width: "100%",
        }}
      >
        <BigButton
          doOnPress={() => {
            console.log("Submission.");
          }}
          text="Submit"
          weightLoss={150}
          chevron={false}
        />
        <BigButton
          doOnPress={() => {
            navigation.goBack();
          }}
          text="Cancel"
          weightLoss={150}
          chevron={false}
        />
      </View>
    </View>
  );
}

function FormInput(props) {
  return (
    <View style={{ flexDirection: "row", flex: 1, alignItems: "center" }}>
      <View>
        <Text style={stylesGlobal.text}>{props.title}</Text>
      </View>
      <TextInput style={[stylesGlobal.input, { height: "20%" }]}>
        {props.children}
      </TextInput>
    </View>
  );
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
      console.log(json);
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

import { View, Text, TextInput, Dimensions, SafeAreaView } from "react-native";
import { useState, useEffect } from "react";
import { stylesGlobal } from "../Styles";
import MapView from "react-native-maps";
import { Marker } from "react-native-maps";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { showMessage, hideMessage } from "react-native-flash-message";
import FlashMessage from "react-native-flash-message";
import * as Location from "expo-location";
import { BigButton } from "../Styles";

const Stack = createNativeStackNavigator();

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
  const [latitude, setLatitude] = useState(route.params.latitude);
  const [longitude, setLongitude] = useState(route.params.longitude);
  const [locationName, setLocationName] = useState("");
  useEffect(() => {
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
              longitude: route.params.longitude,
              latitude: route.params.latitude,
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
  const [reversedLocation, setReversedLocation] = useState(
    "Press Refresh Location to find the name of the location you have selected."
  );
  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
    })();
  }, []);
  let lat = "Waiting...";
  let long = "Waiting...";
  if (errorMsg) {
    lat = errorMsg;
    long = errorMsg;
  } else if (location) {
    lat = location.coords.latitude;
    long = location.coords.longitude;
  }
  return (
    <View style={[stylesGlobal.background]}>
      <FlashMessage position="top" floating={true} />
      <FormInput title="Title:"></FormInput>
      <FormInput title="Description:"></FormInput>
      <FormInput title="Latitude:">{lat}</FormInput>
      <FormInput title="Longitude:">{long}</FormInput>
      <BigButton
        doOnPress={() =>
          navigation.navigate("Map", {
            latitude: lat,
            longitude: long,
          })
        }
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
  console.log(
    `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat.toString()}&lon=${long.toString()}`
  );
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

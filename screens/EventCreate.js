import { View, Text, TextInput, Dimensions } from "react-native";
import { useState, useEffect } from "react";
import { stylesGlobal } from "../Styles";
import MapView from "react-native-maps";
import { Marker } from "react-native-maps";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
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
        options={{ headerShown: true, headerTransparent: true }}
      />
    </Stack.Navigator>
  );
}

function EventMapScreen({ route, navigation }) {
  return (
    <View>
      <MapView
        style={{
          width: Dimensions.get("window").width,
          height: Dimensions.get("window").height * 0.9,
        }}
        region={{
          longitude: route.params.longitude,
          latitude: route.params.latitude,
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
        />
      </MapView>
      <Text>{route.params.location}</Text>
    </View>
  );
}

function EventCreateScreen({ route, navigation }) {
  const [location, setLocation] = useState(null);
  const [newLocation, setNewLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [reversedLocation, setReversedLocation] = useState(
    "Loading Location..."
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
    reverseGeocode(lat, long, setReversedLocation);
  }
  return (
    <View style={[stylesGlobal.background]}>
      <FlashMessage position="top" floating={true} />
      <FormInput title="Title:"></FormInput>
      <FormInput title="Description:"></FormInput>
      <Text style={{ flex: 1 }}>{reversedLocation}</Text>
      <BigButton
        doOnPress={() =>
          navigation.navigate("Map", {
            latitude: lat,
            longitude: long,
            setNewLocation: setNewLocation,
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

function reverseGeocode(lat, long, setReversedLocation) {
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
      setReversedLocation(json.display_name);
    })
    .catch((error) => {
      showMessage({
        message: "Error finding location name.",
        type: "warning",
      });
    });
}

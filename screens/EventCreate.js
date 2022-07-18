import { View, Text, TextInput } from "react-native";
import { useState, useEffect } from "react";
import { stylesGlobal } from "../Styles";
import FlashMessage from "react-native-flash-message";
import * as Location from "expo-location";

export function EventCreateScreen() {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [reversedLocation, setReversedLocation] = useState(null);
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
  let lat = "Waiting..";
  let long = "Waiting..";
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
      <View style={{ flexDirection: "row", flex: 1, alignItems: "center" }}>
        <View>
          <Text style={stylesGlobal.text}>Title:</Text>
        </View>
        <TextInput style={[stylesGlobal.input, { height: "10%" }]}></TextInput>
      </View>
      <View style={{ flexDirection: "row", flex: 1, alignItems: "center" }}>
        <View>
          <Text style={stylesGlobal.text}>Description:</Text>
        </View>
        <TextInput style={[stylesGlobal.input, { height: "10%" }]}></TextInput>
      </View>
      <View style={{ flexDirection: "row", flex: 1, alignItems: "center" }}>
        <View>
          <Text style={stylesGlobal.text}>Latitude:</Text>
        </View>
        <TextInput style={[stylesGlobal.input, { height: "10%" }]}>
          {lat}
        </TextInput>
      </View>
      <View style={{ flexDirection: "row", flex: 1, alignItems: "center" }}>
        <View>
          <Text style={stylesGlobal.text}>Longitude:</Text>
        </View>
        <TextInput style={[stylesGlobal.input, { height: "10%" }]}>
          {long}
        </TextInput>
      </View>
      <Text style={{ flex: 1 }}>{reversedLocation}</Text>
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

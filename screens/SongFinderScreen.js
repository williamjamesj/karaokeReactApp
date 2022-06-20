import {
  Text,
  TextInput,
  KeyboardAvoidingView,
  Button,
  View,
  StyleSheet,
  SectionList,
  SafeAreaView,
  Platform,
} from "react-native";
import { useState } from "react";
import { ENDPOINT_URL } from "./LoginScreen";
import { LoadingIndicator } from "./LoadingAnimation";
import { stylesGlobal } from "../Styles";
import { showMessage, hideMessage } from "react-native-flash-message";
import FlashMessage from "react-native-flash-message";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

const Stack = createNativeStackNavigator();

export function SongFinderScreen() {
  // This needs to be a navigator, as there are two screens, the input screen and the results screen.
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Input"
        component={InputScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Results"
        component={ResultsScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}

function InputScreen({ route, navigation }) {
  const [loading, setLoading] = useState(false);
  let lyrics = "";
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={[stylesGlobal.background]}
    >
      <LoadingIndicator active={loading} />
      <TextInput
        style={(stylesGlobal.input, styles.lyricsInput)}
        multiline={true}
        onChangeText={(text) => (lyrics = text)}
        autoCorrect={false}
      />
      <Button
        title="Submit"
        style={{ color: "#303136" }}
        onPress={() => {
          submitLyrics(lyrics, setLoading, navigation);
        }}
      />
    </KeyboardAvoidingView>
  );
}

function ResultsScreen({ navigation, route }) {
  if (route.params.data != "No Lyrics.") {
    let responsedata = route.params.data;
    let hits = responsedata.song.response.hits;
    let fullDict = [];
    for (let i = 0; i < hits.length; i++) {
      let hit = hits[i];
      fullDict.push({ title: hit.full_title, data: [hit] });
    }
    console.log(hits);
    return (
      <SafeAreaView>
        <SectionList
          sections={fullDict}
          keyExtractor={(item, index) => item + index}
          renderItem={({ item }) => <Text title={item} />}
          renderSectionHeader={({ section: { title } }) => <Text>{title}</Text>}
        ></SectionList>
      </SafeAreaView>
    );
  } else {
    return <Text>No Results.</Text>;
  }
}

function submitLyrics(lyrics, setLoading, navigation) {
  setLoading(true);
  fetch(ENDPOINT_URL + "/find_song", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ lyrics: lyrics }),
  })
    .then((response) => response.json())
    .then((json) => {
      handleResponse(json, setLoading, navigation);
    })
    .catch((error) => {
      setLoading(false);
      showMessage({
        message:
          "Error connecting to server. Please check your internet connection.",
        type: "danger",
      });
    });
}

function handleResponse(data, setLoading, navigation) {
  setLoading(false);
  // console.log(data);
  if (data.status == "No Lyrics.") {
    console.log("No Lyrics recieved.");
  }
  navigation.navigate("Results", { data: data });
}
const styles = StyleSheet.create({
  lyricsInput: {
    height: "50%",
    width: "75%",
    borderColor: "black",
    borderWidth: 1,
    borderRadius: 5,
    backgroundColor: "#FBF9FF",
  },
});

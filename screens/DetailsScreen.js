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
  ScrollView,
  Image,
} from "react-native";
import { useEffect, useState } from "react";
import { ENDPOINT_URL } from "./LoginScreen";
import { LoadingIndicator } from "./LoadingAnimation";
import { stylesGlobal } from "../Styles";
import { showMessage } from "react-native-flash-message";
import FlashMessage from "react-native-flash-message";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

export function DetailsScreen({ route, navigation }) {
  const [loading, setLoading] = useState(false);
  const [lyrics, setLyrics] = useState("");
  useEffect(() => {
    getData(route.params.artist, route.params.songName, setLoading, setLyrics);
  }, []);
  let songName = route.params.songName;
  let artist = route.params.artist;
  let imageURL = route.params.imageURL;
  return (
    <SafeAreaView>
      <ScrollView>
        <FlashMessage position="top" floating={true} />
        <LoadingIndicator active={loading} />
        <View style={{ flexDirection: "row", margin: 5 }}>
          <View style={{ flex: 2, justifyContent: "space-between" }}>
            <Text style={stylesGlobal.title}>{songName}</Text>
            <Text style={stylesGlobal.subtitle}>by {artist}</Text>
            <Text style={stylesGlobal.bigText}>Lyrics: </Text>
          </View>
          <Image
            source={{ uri: imageURL }}
            style={{ width: 125, height: 125, resizeMode: "contain" }}
          />
        </View>
        <Text style={{ margin: 5 }}>{lyrics}</Text>
        {/* The margin is necessary otherwise the text is almost unreadable at the start of the screen */}
      </ScrollView>
    </SafeAreaView>
  );
}

function getData(artist, songName, setLoading, setLyrics) {
  setLoading(true);
  fetch(ENDPOINT_URL + "/get_lyrics", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ artist: artist, song: songName }),
  })
    .then((response) => response.json())
    .then((json) => {
      setLoading(false);
      setLyrics(json.lyrics.lyrics);
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

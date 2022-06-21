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
} from "react-native";
import { useEffect, useState } from "react";
import { ENDPOINT_URL } from "./LoginScreen";
import { LoadingIndicator } from "./LoadingAnimation";
import { stylesGlobal } from "../Styles";
import { showMessage } from "react-native-flash-message";
import FlashMessage from "react-native-flash-message";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

export function LyricsScreen({ route, navigation }) {
  const [loading, setLoading] = useState(false);
  const [lyrics, setLyrics] = useState("");
  useEffect(() => {
    getLyrics(
      route.params.artist,
      route.params.songName,
      setLoading,
      setLyrics
    );
  }, []);
  let songName = route.params.songName;
  let artist = route.params.artist;
  return (
    <SafeAreaView>
      <ScrollView>
        <FlashMessage position="top" floating={true} />
        <LoadingIndicator active={loading} />
        <Text style={stylesGlobal.title}>{songName}</Text>
        <Text style={stylesGlobal.subtitle}>by {artist}</Text>
        <Text>{lyrics}</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

function getLyrics(artist, songName, setLoading, setLyrics) {
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

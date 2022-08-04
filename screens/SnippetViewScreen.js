import { useState, useEffect, useLayoutEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Button,
  Image,
  ScrollView,
  SafeAreaView,
  FlatList,
  TextInput,
  Pressable,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { ENDPOINT_URL } from "./LoginScreen";
import { LoadingIndicator } from "./LoadingAnimation";
import { BigButton, stylesGlobal } from "../Styles";
import { Audio } from "expo-av";
import * as FileSystem from "expo-file-system";
import Ionicons from "@expo/vector-icons/Ionicons";
import { showMessage, hideMessage } from "react-native-flash-message";
import FlashMessage from "react-native-flash-message";

export function SnippetViewScreen({ route, navigation }) {
  const [creatorName, setCreatorName] = useState("Loading...");
  const [snippetTitle, setSnippetTitle] = useState("Loading...");
  const [snippetDescription, setSnippetDescription] = useState("Loading...");
  const [sound, setSound] = useState();
  const [likes, setLikes] = useState(0);
  const [views, setViews] = useState(0);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [doPlay, setDoPlay] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [shouldRetrieve, setShouldRetrieve] = useState(false);
  if (shouldRetrieve) {
    setShouldRetrieve(false);
    retrieveSnippetData(
      route.params.snippetID,
      setCreatorName,
      setSnippetTitle,
      setSnippetDescription,
      setLoading,
      navigation,
      creatorName,
      setComments
    );
  }
  useLayoutEffect(() => {
    navigation.setOptions({
      title: snippetTitle + " by " + creatorName, // Changes the title from "Loading..." to the title and author of the snippet.
    });
  }, [navigation, snippetTitle, creatorName]);
  useEffect(() => {
    retrieveSnippetData(
      route.params.snippetID,
      setCreatorName,
      setSnippetTitle,
      setSnippetDescription,
      setLoading,
      navigation,
      creatorName,
      setComments
    );
  }, []);
  return (
    <SafeAreaView>
      <TouchableWithoutFeedback
        onPress={() => {
          Keyboard.dismiss();
        }}
      >
        <View>
          <LoadingIndicator active={loading} />
          <FlashMessage position="top" floating={true} />
          <Text style={[stylesGlobal.title, { marginTop: 5, marginBottom: 5 }]}>
            {snippetTitle}
          </Text>
          <Text style={stylesGlobal.subtitle}>Shared By: {creatorName}</Text>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-evenly",
            }}
          >
            <Pressable // Recording Button, turns red when recording.
              style={[styles.roundedButton, { backgroundColor: "white" }]}
              onPress={() => playSound(route.params.snippetID, setSound)}
            >
              <Ionicons name="play-outline" size={50} color="black" />
            </Pressable>
            <Pressable // Recording Button, turns red when recording.
              style={[styles.roundedButton, { backgroundColor: "white" }]}
              onPress={() => likeSnippet(route.params.snippetID)}
            >
              <Ionicons name="heart-outline" size={50} color="black" />
            </Pressable>
          </View>
          <TextInput
            onChangeText={(text) => setCommentText(text)}
            style={{
              borderWidth: 1,
              height: "20%",
              borderRadius: 5,
              width: "95%",
              alignSelf: "center",
            }}
            multiline={true}
            placeholder="Add a comment..."
          />
          <BigButton
            text="Submit"
            doOnPress={() =>
              submitComment(
                commentText,
                route.params.snippetID,
                setShouldRetrieve
              )
            }
          />
          <Text
            style={{
              marginTop: 10,
              marginLeft: 10,
              fontSize: 20,
              fontWeight: "bold",
            }}
          >
            {comments.length != 0 && comments ? "Comments:" : "No comments."}
          </Text>
          <FlatList
            style={{
              marginTop: "auto",
            }}
            data={comments}
            renderItem={(item, index) => (
              <CommentCard item={item} index={index} navigation={navigation} />
            )} // This SnippetCard is displayed for every item in the snippets array.
            extraData={comments}
          />
        </View>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
}

function likeSnippet(snippetID) {
  fetch(ENDPOINT_URL + "/like_snippet", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ snippetID: snippetID }),
  }).then((response) => {
    response.json().then((json) => {
      if (json["status"] == "alreadyLiked") {
        showMessage({
          message: "This snippet has been already liked.",
          type: "info",
        });
      } else {
        showMessage({ message: "Snippet liked.", type: "success" });
      }
    });
  });
}

function submitComment(commentText, snippetID, setShouldRetrieve) {
  fetch(ENDPOINT_URL + "/submit_comment", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ commentText: commentText, snippetID: snippetID }),
  }).then((response) => {
    response.json().then((json) => {
      showMessage({ message: "Comment posted.", type: "success" });
      setShouldRetrieve(true);
    });
  });
}

function CommentCard({ item, index }) {
  return (
    <TouchableWithoutFeedback onPress={() => {}}>
      <View
        style={{
          height: "auto",
          borderColor: "black",
          borderTopWidth: 1,
          marginTop: 10,
        }}
      >
        <Text style={{ fontWeight: "bold", marginLeft: 10 }}>
          {item.item.name}
        </Text>
        <Text style={{ marginLeft: 20 }}>{item.item.comment}</Text>
      </View>
    </TouchableWithoutFeedback>
  );
}

async function playSound(snippetID, setSound) {
  let url = ENDPOINT_URL + "/snippets/" + snippetID.toString();
  await Audio.setAudioModeAsync({
    playsInSilentModeIOS: true, // This has caused me several worlds of pain. Funny story, silent mode is pretty much my 24/7 mode.
  });
  const downloadResumable = FileSystem.createDownloadResumable(
    // This wouldn't have been necessary.
    url,
    FileSystem.documentDirectory + "audio.m4a",
    {}
  );
  const { uri } = await downloadResumable.downloadAsync(); // Could have done without this.
  const { sound } = await Audio.Sound.createAsync({ uri: uri });
  await sound.playAsync();
}

function retrieveSnippetData(
  snippetID,
  setCreatorName,
  setSnippetTitle,
  setSnippetDescription,
  setLoading,
  navigation,
  creatorName,
  setComments
) {
  setLoading(true);
  fetch(ENDPOINT_URL + "/snippets", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ snippetID: snippetID }),
  }).then((response) => {
    response.json().then((json) => {
      setLoading(false);
      setCreatorName(json.snippetData[0].name); // Name is the field that returns the username, author just returns the creator's ID.
      setSnippetTitle(json.snippetData[0].title);
      setSnippetDescription(json.snippetData[0].description);
      setComments(json.comments);
    });
  });
}

const styles = StyleSheet.create({
  roundedButton: {
    marginTop: 10,
    marginBottom: 10,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 100,
    backgroundColor: "#ccc",
    width: 100,
    height: 100,
  },
});

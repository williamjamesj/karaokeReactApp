import * as React from "react";
import {
  Text,
  View,
  StyleSheet,
  Button,
  KeyboardAvoidingView,
} from "react-native";
import { ENDPOINT_URL } from "./LoginScreen";
import { Audio } from "expo-av";
import { BigButton, FormInput } from "../Styles";

async function startRecording(setRecording, setDuration) {
  try {
    console.log("Requesting permissions..");
    await Audio.requestPermissionsAsync();
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: true,
      playsInSilentModeIOS: true,
    });
    console.log("Starting recording..");
    const { recording } = await Audio.Recording.createAsync(
      Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY
    );
    recording.setOnRecordingStatusUpdate((details) => {
      setDuration(details.durationMillis);
    });
    setRecording(recording);
    console.log("Recording started");
  } catch (err) {
    console.error("Failed to start recording", err);
  }
}

async function stopRecording(setRecording, setUri, recording, uri) {
  console.log("Stopping recording..");
  setUri(recording.getURI());
  await recording.stopAndUnloadAsync();
  setRecording(false);
  console.log("Recording stopped and stored at", uri);
}

async function playSound(uri) {
  const { sound } = await Audio.Sound.createAsync({ uri: uri });
  await sound.playAsync();
}

export default function AudioRecordScreen() {
  const [recording, setRecording] = React.useState();
  const [uri, setUri] = React.useState("");
  const [duration, setDuration] = React.useState(0);
  const [title, setTitle] = React.useState("");
  const [description, setDescription] = React.useState("");

  return (
    <KeyboardAvoidingView
      style={[
        styles.container,
        {
          alignContent: "flex-start",
          justifyContent: "flex-start",
          flexDirection: "column",
        },
      ]}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <FormInput title="Title: " flex={0} onChange={(text) => setTitle(text)} />
      <FormInput
        title="Description: "
        multiline={true}
        flex={0}
        onChange={(text) => setDescription(text)}
      />
      <Button
        title={recording ? "Stop Recording" : "Start Recording"}
        onPress={
          recording
            ? () => stopRecording(setRecording, setUri, recording, uri)
            : () => startRecording(setRecording, setDuration)
        }
      />
      <Text style={{ padding: 10 }}>
        Duration: {Math.round(duration / 1000)}s
      </Text>
      <Button title="Play Audio" onPress={() => playSound(uri)} flex={1} />
      <BigButton
        style={{ marginTop: "auto" }} // https://stackoverflow.com/questions/31000885/align-an-element-to-bottom-with-flexbox
        text="Upload Audio"
        doOnPress={() => {
          uploadAudio(uri, title, description);
        }}
      />
    </KeyboardAvoidingView>
  );
}

function uploadAudio(uri, title, description) {
  // FileSystem.uploadAsync(ENDPOINT_URL + "/upload_audio", uri, {
  //   httpMethod: "POST",
  //   headers: {
  //     Accept: "application/json",
  //     "Content-Type": "application/json",
  //   },
  // });
  let uriParts = uri.split("."); // Derived from https://gist.github.com/EvanBacon/b44e31ac0ad2883aa2ab2525eb082a18
  let fileType = uriParts[uriParts.length - 1];

  let formData = new FormData();
  formData.append("file", {
    uri,
    name: `recording.${fileType}`,
    type: `audio/x-${fileType}`,
  });
  formData.append("title", title);
  formData.append("description", description);
  fetch(ENDPOINT_URL + "/upload_audio", {
    method: "POST",
    body: formData,
    headers: {
      Accept: "application/json",
      "Content-Type": "multipart/form-data",
    },
  })
    .then((response) => {
      console.log(JSON.stringify(response));
    })
    .catch((error) => {
      console.log(error);
    });
}

const styles = StyleSheet.create({
  container: {
    height: "100%",
    flex: 1,
    justifyContent: "center",
    flexDirection: "column",
    backgroundColor: "#ecf0f1",
    padding: 10,
  },
});

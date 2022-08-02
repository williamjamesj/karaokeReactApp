import * as React from "react";
import {
  Text,
  View,
  StyleSheet,
  Button,
  KeyboardAvoidingView,
  Pressable,
  TouchableWithoutFeedback,
  SafeAreaView,
  Keyboard,
} from "react-native";
import { ENDPOINT_URL } from "./LoginScreen";
import { Audio } from "expo-av";
import { BigButton, FormInput, FormToggleSwitch } from "../Styles";
import Ionicons from "@expo/vector-icons/Ionicons";
import { showMessage } from "react-native-flash-message";

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
  await Audio.setAudioModeAsync({
    allowsRecordingIOS: false,
  });
  setRecording(false);
}

async function playSound(uri) {
  await Audio.setAudioModeAsync({
    allowsRecordingIOS: false,
  });
  const { sound } = await Audio.Sound.createAsync({ uri: uri });
  await sound.playAsync();
}

export default function AudioRecordScreen({ route, navigation }) {
  const [recording, setRecording] = React.useState();
  const [uri, setUri] = React.useState("");
  const [duration, setDuration] = React.useState(0);
  const [title, setTitle] = React.useState("");
  const [visible, setVisible] = React.useState(false);
  const [description, setDescription] = React.useState("");

  return (
    <TouchableWithoutFeedback
      onPress={() => {
        Keyboard.dismiss();
      }}
    >
      <SafeAreaView style={styles.container}>
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
          <FormInput
            title="Title: "
            flex={0}
            onChange={(text) => setTitle(text)}
          />
          <FormInput
            title="Description: "
            multiline={true}
            flex={0}
            onChange={(text) => setDescription(text)}
            height="100%"
          />
          <FormToggleSwitch
            title={visible ? "Share Publicly: " : "Save Privately: "}
            onChange={() => setVisible((previousState) => !previousState)}
            visible={visible}
          />
          <Pressable // Recording Button, turns red when recording.
            style={[
              styles.roundedButton,
              recording
                ? { backgroundColor: "#a31621" }
                : { backgroundColor: "#6b6d76" },
            ]}
            onPress={
              recording
                ? () => stopRecording(setRecording, setUri, recording, uri)
                : () => startRecording(setRecording, setDuration)
            }
          >
            <Ionicons
              name="mic-outline"
              size={50}
              color={recording ? "white" : "black"}
            />
          </Pressable>
          <View>
            <Text style={{ padding: 10 }}>
              Duration: {Math.round(duration / 1000)}s
            </Text>
          </View>

          <Button title="Play Audio" onPress={() => playSound(uri)} flex={1} />
          <BigButton
            style={{ marginTop: "auto" }} // https://stackoverflow.com/questions/31000885/align-an-element-to-bottom-with-flexbox
            text="Upload Audio"
            doOnPress={() => {
              uploadAudio(uri, title, description, visible, navigation);
            }}
          />
        </KeyboardAvoidingView>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
}

function uploadAudio(uri, title, description, visible, navigation) {
  // FileSystem.uploadAsync(ENDPOINT_URL + "/upload_audio", uri, {
  //   httpMethod: "POST",
  //   headers: {
  //     Accept: "application/json",
  //     "Content-Type": "application/json",
  //   },
  // });
  let uriParts = uri.split(".");
  let fileType = uriParts[uriParts.length - 1];

  let formData = new FormData();
  formData.append("file", {
    uri,
    name: `recording.${fileType}`,
    type: `audio/x-${fileType}`,
  });
  formData.append("title", title);
  formData.append("description", description);
  console.log(visible);
  formData.append("visibility", visible);
  fetch(ENDPOINT_URL + "/upload_audio", {
    // Derived from https://gist.github.com/EvanBacon/b44e31ac0ad2883aa2ab2525eb082a18
    method: "POST",
    body: formData,
    headers: {
      Accept: "application/json",
      "Content-Type": "multipart/form-data",
    },
  })
    .then((response) => {
      navigation.goBack();
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
  roundedButton: {
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    borderRadius: 100,
    backgroundColor: "#ccc",
    width: 100,
    height: 100,
  },
});

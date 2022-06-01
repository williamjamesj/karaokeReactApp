import {
  Text,
  View,
  TextInput,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useContext, useState } from "react";
import { stylesGlobal } from "../Styles";
import { LoadingIndicator } from "./LoadingAnimation";
import { UserContext } from "./LoginScreen";
import { showMessage, hideMessage } from "react-native-flash-message";
import FlashMessage from "react-native-flash-message";
import { ENDPOINT_URL } from "./LoginScreen";
import { setToken, getToken } from "./Storage";

export function TwoFactorScreen() {
  const { authenticated, setAuthenticated } = useContext(UserContext);
  const [loading, setLoading] = useState(false);
  let code = "";
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={stylesGlobal.background}
    >
      <LoadingIndicator active={loading} />
      <FlashMessage position="top" floating={true} />
      <View>
        <Text style={[styles.label, stylesGlobal.text]}>
          Please enter your two-factor authentication code.
        </Text>
      </View>
      <TextInput
        style={styles.OTPInput}
        textContentType={"oneTimeCode"}
        onChangeText={(text) => (code = text)}
        autoCapitalize="none"
        autoCorrect={false}
        onSubmitEditing={() => submitToken(code, setAuthenticated, setLoading)}
        returnKeyType="done"
        blurOnSubmit={true}
      />
    </KeyboardAvoidingView>
  );
}

function submitToken(token, setAuthenticated, setLoading) {
  if (token.length != 6) {
    showMessage({
      message: "Invalid code",
      type: "danger",
    });
  } else {
    setLoading(true);
    fetch(ENDPOINT_URL + "/2fa", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ code: token }),
    })
      .then((response) => response.json())
      .then((json) => {
        handleResponse(json, setAuthenticated, setLoading);
      })
      .catch((error) => {
        console.log(error);
      });
  }
}

function handleResponse(response, setAuthenticated, setLoading) {
  setLoading(false);
  if (response["status"] == "authenticated") {
    setAuthenticated(true);
    token = response["token"];
    setToken(token);
  } else if (response["status"] == "Invalid Code") {
    showMessage({
      message: "Invalid code",
      type: "danger",
    });
  }
}

const styles = StyleSheet.create({
  label: {
    padding: "10%",
  },
  OTPInput: {
    width: "50%",
    height: 40,
    borderColor: "black",
    borderWidth: 1,
    borderRadius: 5,
  },
});

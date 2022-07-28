import {
  View,
  Text,
  TextInput,
  SafeAreaView,
  KeyboardAvoidingView,
} from "react-native";
import { useState, useContext } from "react";
import { LoadingIndicator } from "./LoadingAnimation";
import { showMessage } from "react-native-flash-message";
import FlashMessage from "react-native-flash-message";
import { setToken, getToken, wipeKey } from "./Storage";
import { stylesGlobal, FormInput, BigButton } from "../Styles";
import { UserContext } from "./LoginScreen";
import { ENDPOINT_URL } from "./LoginScreen";

export function RegistrationScreen({ route, navigation }) {
  const { setAuthenticated } = useContext(UserContext); // The setAuthenticated object will navigate the user to the next screen if it is set to true.
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false); // This state is set while the app is waiting for a response from the server, and controls the loading indicator.

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <LoadingIndicator active={loading} />
      <FlashMessage position="top" floating={true} />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={stylesGlobal.background}
      >
        <FormInput
          title="Username: "
          onChange={(username) => {
            setUsername(username);
          }}
          textContentType="username"
          autoComplete="username-new"
          autoCorrect={false}
        />
        <FormInput
          title="Email: "
          onChange={(email) => {
            setEmail(email);
          }}
          autoComplete="email"
          autoCorrect={false}
          textContentType="emailAddress"
        />
        <FormInput
          title="Password: "
          onChange={(password) => {
            setPassword(password);
          }}
          secureTextEntry={true}
          textContentType="newPassword"
        />
        <FormInput
          title="Confirm Password: "
          onChange={(confirmPassword) => {
            setConfirmPassword(confirmPassword);
          }}
          secureTextEntry={true}
          textContentType="password"
        />
        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
            width: "100%",
          }}
        >
          <BigButton
            text="Back"
            weightLoss={150}
            doOnPress={() => setAuthenticated("login")}
          />
          <BigButton
            text="Register"
            doOnPress={() => {
              if (
                email != "" &&
                password != "" &&
                confirmPassword != "" &&
                username != ""
              ) {
                // Check that all fields have entries
                if (password == confirmPassword) {
                  // Check that the passwords match
                  register(
                    { username, email, password, confirmPassword },
                    setAuthenticated,
                    setLoading
                  );
                } else {
                  showMessage({
                    message: "Passwords do not match.",
                    type: "danger",
                  });
                }
              } else {
                showMessage({
                  message: "Please fill in all fields.",
                  type: "danger",
                });
              }
            }}
            weightLoss={150}
          />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function register(credentials, setAuthenticated, setLoading) {
  console.log(credentials);
  setLoading(true);
  fetch(ENDPOINT_URL + "/register", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(credentials),
  })
    .then((response) => response.json())
    .then((json) => {
      finishedRegistration(json, setAuthenticated, setLoading);
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

function finishedRegistration(response, setAuthenticated, setLoading) {
  console.log(response);
  setLoading(false);
  if (response.status == "authenticated") {
    if ("token" in response) {
      setToken(response.token);
    }
    setAuthenticated(true);
  } else if (response.status == "usernameDuplication") {
    showMessage({
      message: "Username already exists.",
      type: "warning",
    });
  } else if (response.status == "emailDuplication") {
    showMessage({
      message: "Email already exists.",
      type: "danger",
    });
  }
}

import {
  Text,
  TextInput,
  KeyboardAvoidingView,
  Button,
  StyleSheet,
  View,
  Platform,
} from "react-native";
import { createContext, useContext, useState, useRef } from "react";
import { showMessage, hideMessage } from "react-native-flash-message";
import FlashMessage from "react-native-flash-message";
import { LoadingIndicator } from "./LoadingAnimation";
import { stylesGlobal } from "../Styles";

export const UserContext = createContext({
  // The user context stores all of the relevant user data.
  authenticated: false,
  setAuthenticated: () => {},
});

// export const UserData = createContext({ // I don't think I'm going to need to save UserData like this.
//   data: {},
//   setData: () => {},
// });

export function LoginScreen() {
  const { setAuthenticated } = useContext(UserContext); // The setAuthenticated object will navigate the user to the next screen if it is set to true.
  const [loading, setLoading] = useState(false); // This state is set while the app is waiting for a response from the server, and controls the loading indicator.
  let credentials = { email: "", password: "" };
  let passwordField = useRef(); // Allows the password field to be focused once the email field is completed.
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={[stylesGlobal.background, styles.loginViewLayout]}
    >
      <LoadingIndicator active={loading} />
      {/* The loading indicator displays whilst waiting for a response from the server. */}
      <FlashMessage position="top" floating={true} />
      {/* The flash message informs the user when they have to take action (e.g. invalid credentials). */}
      <View>
        {/* Not sure why, but the labels have to be wrapped in a view, otherwise they don't move properly with the KeyboardAvoidingView animation. */}
        <Text style={stylesGlobal.text}>Email:</Text>
      </View>
      <TextInput
        style={styles.loginInput}
        textContentType={"emailAddress"}
        onChangeText={(text) => (credentials["email"] = text)}
        autoComplete={"email"}
        autoCapitalize="none"
        onSubmitEditing={() => passwordField.current.focus()} // Once the user presses next on their keyboard, focus the password field.
        keyboardType="email-address"
        autoCorrect={false}
        returnKeyType="next"
      />
      <View>
        <Text style={stylesGlobal.text}>Password:</Text>
      </View>
      <TextInput
        style={styles.loginInput}
        textContentType={"password"}
        secureTextEntry={true}
        onChangeText={(text) => (credentials["password"] = text)}
        autoCapitalize="none"
        autoCorrect={false}
        onSubmitEditing={() =>
          callSubmit(credentials, setAuthenticated, setLoading)
        }
        returnKeyType="done"
        blurOnSubmit={true}
        ref={passwordField}
      />
      <Button
        title="Submit"
        onPress={() => {
          callSubmit(credentials, setAuthenticated);
        }}
      />
    </KeyboardAvoidingView>
  );
}

function callSubmit(credentials, setAuthenticated, setLoading) {
  if (credentials["email"] != "" && credentials["password"] != "") {
    setLoading(true);
    submit(credentials, setAuthenticated, setLoading);
  } else {
    showMessage({
      message: "Please enter your email and password.",
      type: "warning",
    });
  }
}

function submit(credentials, setAuthenticated, setLoading) {
  fetch("http://10.10.73.40:5000/login", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(credentials),
  })
    .then((response) => response.json())
    .then((json) => {
      handleResponse(json, setAuthenticated, setLoading);
    })
    .catch((error) => {
      console.log(error);
    });
}

function handleResponse(response, setAuthenticated, setLoading) {
  console.log(response);
  if (response["status"] == "authenticated") {
    setLoading(false);
    setAuthenticated(true);
  } else if (response["status"] == "2fa") {
    setLoading(false);
    setAuthenticated("2fa");
  } else {
    setLoading(false);
    showMessage({
      message: "Incorrect email or password.",
      type: "warning",
    });
  }
}

const styles = StyleSheet.create({
  loginViewLayout: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  loginInput: {
    height: 40,
    width: "75%",
    margin: 20,
    borderWidth: 1,
    borderRadius: 5,
  },
});

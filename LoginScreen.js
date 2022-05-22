import {
  Text,
  TextInput,
  SafeAreaView,
  Button,
  StyleSheet,
  ActivityIndicator,
  Modal,
} from "react-native";
import { createContext, useContext, useState } from "react";
import { showMessage, hideMessage } from "react-native-flash-message";
import FlashMessage from "react-native-flash-message";
import { LoadingIndicator } from "./LoadingAnimation";

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
  return (
    <SafeAreaView style={styles.loginViewLayout}>
      <LoadingIndicator active={loading} />
      <FlashMessage position="top" floating={true} />
      <Text style={styles.loginLabel}>Email:</Text>
      <TextInput
        style={styles.loginInput}
        textContentType={"emailAddress"}
        onChangeText={(text) => (credentials["email"] = text)}
        autoComplete={"email"}
        autoCapitalize="none"
        keyboardType="email-address"
        autoCorrect={false}
      />
      <Text style={styles.loginLabel}>Password:</Text>
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
      />
      <Button
        title="Submit"
        onPress={() => {
          callSubmit(credentials, setAuthenticated);
        }}
      />
    </SafeAreaView>
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
  fetch("http://192.168.0.172:5000/login", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(credentials),
  })
    .then((repsonse) => repsonse.json())
    .then((json) => {
      handleResponse(json, setAuthenticated, setLoading);
    })
    .catch((error) => {
      console.log(error);
    });
}

function handleResponse(response, setAuthenticated, setLoading) {
  if (response["status"] == "authenticated") {
    setLoading(false);
    setAuthenticated(true);
  } else {
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
  loginLabel: {
    fontSize: 20,
  },
  loginInput: {
    height: 40,
    width: "50%",
    margin: 20,
    borderWidth: 2,
    padding: 5,
  },
});

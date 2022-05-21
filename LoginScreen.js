import {
  Text,
  TextInput,
  SafeAreaView,
  Button,
  StyleSheet,
} from "react-native";
import { createContext, useContext, useState } from "react";

export const UserContext = createContext({
  // The user context stores all of the relevant user data.
  authenticated: false,
  setAuthenticated: () => {},
});

export function LoginScreen() {
  const { setAuthenticated } = useContext(UserContext);
  let credentials = { email: "", password: "" };
  return (
    <SafeAreaView
      style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
    >
      <Text>The login screen is this.</Text>
      <TextInput
        style={styles.input}
        textContentType={"username"}
        onChangeText={(text) => (credentials["email"] = text)}
      />
      <TextInput
        style={styles.input}
        textContentType={"password"}
        secureTextEntry={true}
        onChangeText={(text) => (credentials["password"] = text)}
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

function callSubmit(credentials, setAuthenticated) {
  if (credentials["email"] != "") {
    setAuthenticated(true);
  } else {
    console.log("No email.");
  }
}

async function submit(credentials) {
  console.log("Sending.");
  console.log(credentials);
  try {
    fetch("http://192.168.0.173:5000/login", {
      method: "POST",
      body: credentials,
    });
  } catch (error) {
    console.error(error);
  }
}

const styles = StyleSheet.create({
  input: {
    height: 40,
    margin: 20,
    borderWidth: 2,
    padding: 5,
  },
});

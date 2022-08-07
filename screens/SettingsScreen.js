import {
  View,
  Button,
  Linking,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  Text,
} from "react-native";
import { useContext, useEffect, useState } from "react";
import { FormInput, stylesGlobal } from "../Styles";
import { UserContext } from "./LoginScreen";
import { setToken, wipeKey } from "./Storage";
import { BigButton } from "../Styles";
import { LoadingIndicator } from "./LoadingAnimation";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { ENDPOINT_URL } from "./LoginScreen";
import { showMessage } from "react-native-flash-message";
import FlashMessage from "react-native-flash-message";

const Stack = createNativeStackNavigator();

export function SettingsScreen({ route, navigation }) {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Main Settings"
        component={MainSettingsScreen}
        options={{ headerShown: true, title: "Settings" }}
      />
      <Stack.Screen name="Two-Factor Setup" component={TwoFactorPromptScreen} />
    </Stack.Navigator>
  );
}

function MainSettingsScreen({ route, navigation }) {
  const { setAuthenticated } = useContext(UserContext);
  return (
    <View style={stylesGlobal.background}>
      <FlashMessage position="top" floating={true} />
      <BigButton
        text="Log Out"
        doOnPress={() => {
          logOut(setAuthenticated);
        }}
      />
      <BigButton
        text="Two-Factor Setup"
        doOnPress={() => navigation.navigate("Two-Factor Setup")}
      />
    </View>
  );
}

function TwoFactorPromptScreen({ route, navigation }) {
  const [loading, setLoading] = useState(false);
  const [secret, setSecret] = useState("");
  const [code, setCode] = useState("");
  const [actualSecret, setActualSecret] = useState("");
  useEffect(() => {
    setLoading(true);
    fetch(ENDPOINT_URL + "/2fagenerate", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((json) => {
        setSecret(json.secret);
        setActualSecret(json.actualSecret);
        console.log(json);
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
      });
  }, []);

  return (
    <TouchableWithoutFeedback
      onPress={() => {
        Keyboard.dismiss();
      }}
    >
      <KeyboardAvoidingView
        style={[stylesGlobal.background, { justifyContent: "center" }]}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <FlashMessage position="top" floating={true} />
        <LoadingIndicator active={loading} />
        <BigButton
          text="Configure Two-Factor"
          doOnPress={() => {
            Linking.openURL(secret);
          }}
        />
        <View>
          <Text>
            Once you have set up Two-Factor Authentication, input your code
            below to activate it for your account.
          </Text>
        </View>
        <FormInput
          title="Input Code: "
          onChange={(text) => {
            setCode(text);
          }}
          textContentType="oneTimeCode"
        />
        <BigButton
          text="Check Code"
          doOnPress={() => submitCode(code, actualSecret, navigation)}
        />
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
}

function submitCode(code, actualSecret, navigation) {
  fetch(ENDPOINT_URL + "/2faconfirm", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ code: code, secret: actualSecret }),
  })
    .then((response) => response.json())
    .then((json) => {
      console.log(json);
      if (json.status === "success") {
        navigation.navigate("Main Settings", {
          message: "Two-Factor Authentication Successfully Configured",
        });
      } else {
        showMessage({
          message: "Invalid Code. Please try again.",
          type: "warning",
        });
      }
    })
    .catch((error) => {
      console.log(error);
    });
}

function logOut(setAuthenticated) {
  setAuthenticated(false);
  wipeKey();
  return;
}

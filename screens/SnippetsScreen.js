import { FlatList, Pressable, SafeAreaView, Text, View } from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { SnippetViewScreen } from "./SnippetViewScreen";
import { useEffect, useState } from "react";
import { ENDPOINT_URL } from "./LoginScreen";
import Ionicons from "@expo/vector-icons/Ionicons";

const Stack = createNativeStackNavigator();

export function SnippetsScreen({ route, navigation }) {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Audio Snippets"
        component={SnippetsViewScreen}
        options={{ headerShown: true }}
      />
      <Stack.Screen
        name="SnippetView"
        component={SnippetViewScreen}
        options={{ headerShown: true, title: "Loading..." }}
      />
    </Stack.Navigator>
  );
}

function SnippetsViewScreen({ route, navigation }) {
  const [snippets, setSnippets] = useState([]);
  useEffect(() => {
    retrieveSnippets(setSnippets);
  }, []);
  return (
    <SafeAreaView>
      <FlatList
        data={snippets}
        renderItem={(item, index) => (
          <SnippetCard item={item} index={index} navigation={navigation} />
        )} // This SnippetCard is displayed for every item in the snippets array.
        extraData={snippets}
      />
    </SafeAreaView>
  );
}
function retrieveSnippets(setSnippets) {
  console.log("retrieving snippets");
  fetch(ENDPOINT_URL + "/snippetsList", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.json())
    .then((json) => setSnippets(json))
    .catch((error) => console.log(error));
}

function SnippetCard({ item, index, navigation }) {
  return (
    <Pressable
      style={{
        height: "auto", // Automatically adjusts to the size of the content.
        width: "95%",
        alignSelf: "center",
        borderColor: "black",
        borderWidth: 1,
        borderRadius: 10,
        padding: 5,
        margin: 5,
        backgroundColor: "#D4D5D8",
        // https://stackoverflow.com/questions/50162879/create-raised-or-shadow-effect-on-touchableopacity-react-native - makes the cards look like they are elevated.
        shadowColor: "rgba(0,0,0, .4)", // IOS
        shadowOffset: { height: 1, width: 1 }, // IOS
        shadowOpacity: 1, // IOS
        shadowRadius: 1, //IOS
        elevation: 2, // Android
      }}
      onPress={() =>
        navigation.navigate("SnippetView", { snippetID: item.item.snippetID })
      }
    >
      <Text style={{ marginBottom: 5 }}>
        {item.item.title} by{" "}
        {/* This weird little {" "} is required, otherwise the whitespace isn't rendered. */}
        <Text style={{ fontWeight: "bold" }}>{item.item.name}</Text>
      </Text>
      <Text style={{ marginBottom: 10 }}>{item.item.description}</Text>
      <View style={{ flexDirection: "row", marginTop: "auto" }}>
        <IoniconWithText
          name="heart-outline"
          text={item.item.likes ? item.item.likes : 0}
          style={{ paddingRight: 5 }}
        />
        <IoniconWithText
          name="chatbox-outline"
          text={item.item.comments ? item.item.comments : 0}
          style={{ paddingRight: 5 }}
        />
        <IoniconWithText
          name="eye-outline"
          text={item.item.views ? item.item.views : 0}
          style={{ paddingRight: 5 }}
        />
      </View>
    </Pressable>
  );
}

function IoniconWithText({ name, text, style = {} }) {
  return (
    <View style={[{ flexDirection: "row" }, style]}>
      <Ionicons name={name} size={20} />
      <Text style={{ alignSelf: "center" }}>{text}</Text>
    </View>
  );
}

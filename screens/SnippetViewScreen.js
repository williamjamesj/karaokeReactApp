import { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Button,
  Image,
  ScrollView,
  SafeAreaView,
} from "react-native";
import { ENDPOINT_URL } from "./LoginScreen";
import { LoadingIndicator } from "./LoadingAnimation";

export function SnippetViewScreen({ route, navigation }) {
  const [creatorName, setCreatorName] = useState("Loading...");
  const [snippetTitle, setSnippetTitle] = useState("Loading...");
  const [snippetDescription, setSnippetDescription] = useState("Loading...");
  const [likes, setLikes] = useState(0);
  const [views, setViews] = useState(0);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    retrieveSnippetData(
      route.params.snippetID,
      setCreatorName,
      setSnippetTitle,
      setSnippetDescription,
      setLoading
    );
  }, []);

  return (
    <SafeAreaView>
      <LoadingIndicator active={loading} />
    </SafeAreaView>
  );
}

function retrieveSnippetData(
  snippetID,
  setCreatorName,
  setSnippetTitle,
  setSnippetDescription,
  setLoading
) {
  setLoading(true);
  console.log(snippetID);
  fetch(ENDPOINT_URL + "/snippets", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ snippetID: snippetID }),
  }).then((response) => {
    response.json().then((json) => {
      console.log(json);
      setLoading(false);
      setCreatorName(json.author);
      setSnippetTitle(json.title);
      setSnippetDescription(json.description);
    });
  });
}

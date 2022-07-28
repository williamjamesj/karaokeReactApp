import { StyleSheet, Pressable, View, Text, TextInput } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";

export function FormInput(props) {
  let flex = 1;
  if (props.flex == undefined) {
    flex = props.flex;
  }
  return (
    <View
      style={{
        flexDirection: "row",
        flex: flex,
        alignItems: "center",
        justifyContent: "space-between",
        maxHeight: 100,
      }}
    >
      <View>
        <Text style={stylesGlobal.text}>{props.title}</Text>
      </View>
      <TextInput
        style={[stylesGlobal.input, { height: "20%", minHeight: 30 }]}
        onChangeText={props.onChange}
        secureTextEntry={props.secureTextEntry}
        multiline={props.multiline}
      >
        {props.children}
      </TextInput>
    </View>
  );
}

export function BigButton({
  style = {},
  doOnPress,
  text,
  weightLoss = "80%",
  chevron = true,
}) {
  return (
    <View
      style={[
        {
          alignItems: "center",
          height: 75,
          padding: 10,
        },
        style,
      ]}
    >
      <Pressable
        style={{
          backgroundColor: "#091540",
          borderRadius: 10,
          padding: 10,
          width: weightLoss,
          height: "100%",
          alignItems: "center",
        }}
        onPress={doOnPress}
      >
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-evenly",
            alignContent: "center",
          }}
        >
          <Text
            style={{
              color: "white",
              fontSize: 25,
              flex: 5,
              alignContent: "center",
              alignSelf: "center",
            }}
          >
            {text}
          </Text>
          {chevron ? (
            <Ionicons
              name="chevron-forward-outline"
              style={{
                fontSize: 25,
                alignSelf: "center",
              }}
              color="white"
            />
          ) : null}
        </View>
      </Pressable>
    </View>
  );
}

const stylesGlobal = StyleSheet.create({
  background: {
    // backgroundColor: "#1F46D6",
    flex: 1,
    alignItems: "center",
    justifyContent: "space-around",
    width: "100%",
  },
  text: {
    color: "black",
    alignSelf: "center",
  },
  bigText: {
    fontSize: 20,
    color: "black",
  },
  input: {
    height: "10%",
    width: "75%",
    maxHeight: 50,
    maxWidth: 200,
    margin: 20,
    borderWidth: 1,
    borderRadius: 5,
  },
  button: {
    color: "#303136",
  },
  title: {
    fontSize: 25,
    fontWeight: "bold",
    color: "black",
  },
  subtitle: {
    fontSize: 20,
    color: "grey",
  },
});

export { stylesGlobal };

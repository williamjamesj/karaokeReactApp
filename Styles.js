import { StyleSheet } from "react-native";

const stylesGlobal = StyleSheet.create({
  background: {
    // backgroundColor: "#1F46D6",
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
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
    fontSize: 30,
    fontWeight: "bold",
    color: "black",
  },
  subtitle: {
    fontSize: 20,
    color: "grey",
  },
});

export { stylesGlobal };

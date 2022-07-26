import { View, ActivityIndicator, Modal } from "react-native";

export function LoadingIndicator(props) {
  return (
    <Modal visible={props.active} transparent={true}>
      <View
        style={{
          flex: 1,
          alignItems: "center",
          flexDirection: "column",
          justifyContent: "space-around",
          backgroundColor: "#00000040",
        }}
      >
        <View
          style={{
            backgroundColor: "#FFFFFF",
            height: 100,
            width: 100,
            borderRadius: 10,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-around",
          }}
        >
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      </View>
    </Modal>
  );
}

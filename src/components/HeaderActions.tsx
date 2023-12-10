import { Ionicons } from "@expo/vector-icons";
import { View } from "react-native";

import { NavigationProp } from "@react-navigation/native";

type HeaderActionsProps = {
  navigation: NavigationProp<Record<string, object>>;
};

export const HeaderActions = ({ navigation }: HeaderActionsProps) => {
  return (
    <View style={{ flexDirection: "row", justifyContent: "flex-end" }}>
      <Ionicons
        name="chatbox"
        size={24}
        color="black"
        onPress={() => navigation.navigate("compose", {})}
      />
      <Ionicons
        name="menu"
        size={24}
        color="black"
        onPress={() => alert("TODO")}
        style={{ paddingLeft: 100 }}
      />
    </View>
  );
};
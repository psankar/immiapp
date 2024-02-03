import { Ionicons } from "@expo/vector-icons";
import { NavigationProp } from "@react-navigation/native";
import { useState } from "react";
import { View } from "react-native";
import {
  Menu,
  MenuOption,
  MenuOptions,
  MenuTrigger,
} from "react-native-popup-menu";
import t from "../localization/i18n";

type HeaderActionsProps = {
  navigation: NavigationProp<Record<string, object>>;
};

export const HeaderActions = ({ navigation }: HeaderActionsProps) => {
  const [menuVisible, setMenuVisible] = useState(false);

  return (
    <View style={{ flexDirection: "row", justifyContent: "flex-end" }}>
      <Ionicons
        name="chatbox"
        size={24}
        color="black"
        onPress={() => navigation.navigate(t("compose"), {})}
        style={{ paddingRight: 10 }}
      />
      <Ionicons name="menu" size={25} onPress={() => setMenuVisible(true)} />
      {menuVisible && (
        <Menu
          opened={menuVisible}
          onBackdropPress={() => setMenuVisible(false)}
        >
          <MenuTrigger text="Menu" />
          <MenuOptions>
            <MenuOption
              onSelect={() => {
                setMenuVisible(false);
                navigation.navigate(t("invite"), {});
              }}
              text={t("Invite")}
            />
            <MenuOption
              onSelect={() => console.log("Option 2 clicked")}
              text="Option 2"
            />
          </MenuOptions>
        </Menu>
      )}
    </View>
  );
};

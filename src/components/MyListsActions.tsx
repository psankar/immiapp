import { Ionicons } from "@expo/vector-icons";
import { NavigationProp } from "@react-navigation/native";
import React, { useContext, useState } from "react";
import { View } from "react-native";
import {
  Menu,
  MenuOption,
  MenuOptions,
  MenuTrigger,
} from "react-native-popup-menu";
import { AuthContext, AuthContextType } from "../context/AuthContext";
import t from "../localization/i18n";
import { StyleSheet } from "react-native";

type MyListsActionsProps = {
  navigation: NavigationProp<Record<string, object>>;
};

export const MyListsActions = ({ navigation }: MyListsActionsProps) => {
  const [menuVisible, setMenuVisible] = useState(false);
  const { logout } = useContext<AuthContextType>(AuthContext);

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
          <MenuTrigger />
          <MenuOptions>
            <MenuOption
              onSelect={() => {
                setMenuVisible(false);
                navigation.navigate(t("invite"), {});
              }}
              text={t("invite")}
              style={styles.menuOption}
            />
            <View style={{ height: 3, backgroundColor: "#E0E0E0" }} />
            <MenuOption
              onSelect={() => logout()}
              text={t("signout")}
              style={styles.menuOption}
            />
          </MenuOptions>
        </Menu>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  menuOption: {
    height: 40,
  },
});

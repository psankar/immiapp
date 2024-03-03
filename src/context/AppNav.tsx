import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useContext } from "react";
import t from "../localization/i18n";
import Compose from "../screens/Compose";
import CreateList from "../screens/CreateList";
import { Invite } from "../screens/Invite";
import ListTimeline from "../screens/ListTimeline";
import ManageList from "../screens/ManageList";
import { MyLists } from "../screens/MyLists";
import { SignIn } from "../screens/SignIn";
import { AuthContext, AuthContextType } from "./AuthContext";
import LanguageSelector from "../components/LanguageSelector";
import i18n from "i18next";
import ForgotPassword from "../screens/ForgotPassword";
import { ChangePassword } from "../screens/ChangePassword";

const Stack = createNativeStackNavigator();

export const AppNav = () => {
  const { isLoggedIn } = useContext<AuthContextType>(AuthContext);

  if (localStorage.getItem("lang")) {
    i18n.changeLanguage(localStorage.getItem("lang") || "en");
  }

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {isLoggedIn ? (
          <Stack.Screen name={t("my_lists")} component={MyLists} />
        ) : (
          <Stack.Screen name={t("sign_in")} component={SignIn} />
        )}
        <Stack.Screen
          name={t("list_timeline")}
          component={ListTimeline}
          initialParams={{ displayName: "", handle: "" }}
        />
        <Stack.Screen name={t("compose")} component={Compose} />
        <Stack.Screen name={t("create_list")} component={CreateList} />
        <Stack.Screen
          name={t("list_manage")}
          component={ManageList}
          initialParams={{ display_name: "" }}
        />
        <Stack.Screen name={t("invite")} component={Invite} />
        <Stack.Screen name={"Change Language"} component={LanguageSelector} />
        <Stack.Screen name={t("forgot_password")} component={ForgotPassword} />
        <Stack.Screen name={t("change_password")} component={ChangePassword} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

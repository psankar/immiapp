import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import t from "../localization/i18n";
import Compose from "../screens/Compose";
import CreateList from "../screens/CreateList";
import ListTimeline from "../screens/ListTimeline";
import ManageList from "../screens/ManageList";
import { MyLists } from "../screens/MyLists";
import { SignIn } from "../screens/SignIn";
import { AuthContext, AuthContextType } from "./AuthContext";
import { useContext } from "react";

const Stack = createNativeStackNavigator();

export const AppNav = () => {
  const { isLoggedIn } = useContext<AuthContextType>(AuthContext);

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {isLoggedIn ? (
          <Stack.Screen name={t("my_lists")} component={MyLists} />
        ) : (
          <Stack.Screen name={t("sign_in")} component={SignIn} />
        )}
        <Stack.Screen
          name={"list_timeline"}
          component={ListTimeline}
          initialParams={{ displayName: "", handle: "" }}
        />
        <Stack.Screen name={t("compose")} component={Compose} />
        <Stack.Screen name={t("create_list")} component={CreateList} />
        <Stack.Screen
          name={t("list_manage")}
          component={ManageList}
          initialParams={{ list_handle: "", display_name: "" }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

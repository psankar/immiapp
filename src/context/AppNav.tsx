import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React, { useContext } from "react";
import t from "../localization/i18n";
import Compose from "../screens/Compose";
import ListTimeline from "../screens/ListTimeline";
import { MyLists } from "../screens/MyLists";
import { SignIn } from "../screens/SignIn";
import { AuthContext, AuthContextType } from "./AuthContext";

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
      </Stack.Navigator>
    </NavigationContainer>
  );
};

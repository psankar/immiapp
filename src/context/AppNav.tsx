import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React, { useContext } from "react";
import { MyLists } from "../screens/MyLists";
import { SignIn } from "../screens/SignIn";
import { AuthContext, AuthContextType } from "./AuthContext";
import t from "../localization/i18n";
import ListTimeline from "../screens/ListTimeline";

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
        <Stack.Screen name={"list_timeline"} component={ListTimeline} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

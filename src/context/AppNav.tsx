import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React, { useContext } from "react";
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
          <Stack.Screen name="My Lists" component={MyLists} />
        ) : (
          <Stack.Screen name="SignIn" component={SignIn} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

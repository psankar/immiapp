import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import * as React from "react";
import AuthProvider, {
  AuthContext,
  AuthContextType,
} from "./src/context/AuthContext";
import Home from "./src/screens/Home";
import SignIn from "./src/screens/SignIn";

const Stack = createNativeStackNavigator();

function App() {
  const { isLoggedIn } = React.useContext<AuthContextType>(AuthContext);

  return (
    <AuthProvider>
      <NavigationContainer>
        <Stack.Navigator>
          {isLoggedIn ? (
            <Stack.Screen name="Home" component={Home} />
          ) : (
            <Stack.Screen name="SignIn" component={SignIn} />
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </AuthProvider>
  );
}

export default App;

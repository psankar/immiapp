import React, { useState, useContext } from "react";
import { View, TextInput, Button, Text } from "react-native";
import { AuthContext, AuthContextType } from "../context/AuthContext";

const SignIn = () => {
  const [accountHandle, setAccountHandle] = useState("");
  const [password, setPassword] = useState("");
  const [isValid, setIsValid] = useState(false);
  const [error, setError] = useState("");

  const { login } = useContext<AuthContextType>(AuthContext);

  const handleAccountHandleChange = (text: string) => {
    setAccountHandle(text);
    validateInputs(text, password);
  };

  const handlePasswordChange = (text: string) => {
    setPassword(text);
    validateInputs(accountHandle, text);
  };

  const validateInputs = (accountHandle: string, password: string) => {
    const accountHandleRegex = /^[a-z0-9]*[a-z][a-z0-9]*$/;
    const passwordRegex = /^\S{3,32}$/;
    setIsValid(
      accountHandleRegex.test(accountHandle) && passwordRegex.test(password)
    );
  };

  const handleSignIn = async () => {
    setError("");
    try {
      const response = await fetch("http://localhost:8080/login", {
        method: "POST",
        body: JSON.stringify({
          account_handle: accountHandle,
          password: password,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (response.ok) {
        console.log("Authentication succeeded");
      } else if (response.status === 401) {
        setError("Authentication failed");
      } else {
        setError("Unknown error occurred");
      }
    } catch (error) {
      console.error(error);
      setError("Network error");
    }
  };

  const handleForgotPassword = () => {
    // handle forgot password
  };

  return (
    <View>
      <label>Account Handle</label>
      <TextInput
        aria-label="AccountHandle"
        placeholder="AccountHandle"
        value={accountHandle}
        onChangeText={handleAccountHandleChange}
      />
      <label>Password</label>
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={handlePasswordChange}
        secureTextEntry
      />
      <Button title="Sign In" onPress={handleSignIn} disabled={!isValid} />
      <Text onPress={handleForgotPassword}>Forgot Password?</Text>
      {error ? <Text>{error}</Text> : null}
    </View>
  );
};

export default SignIn;

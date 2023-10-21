import React, { useContext, useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { AuthContext, AuthContextType } from "../context/AuthContext";
import BASE_URL from "../config";

export const SignIn = () => {
  const [accountHandle, setAccountHandle] = useState("");
  const [password, setPassword] = useState("");
  const [isValid, setIsValid] = useState(false);
  const [error, setError] = useState("");

  const { login, isLoggedIn } = useContext<AuthContextType>(AuthContext);

  const handleAccountHandleChange = (text: string) => {
    setAccountHandle(text);
    validateInputs(text, password);
  };

  const handlePasswordChange = (text: string) => {
    setPassword(text);
    validateInputs(accountHandle, text);
  };

  const validateInputs = (accountHandle: string, password: string) => {
    // TODO: These regexes are not the same as the ones in the backend
    const accountHandleRegex = /^[a-z0-9]*[a-z][a-z0-9]*$/;
    const passwordRegex = /^\S{3,32}$/;
    setIsValid(
      accountHandleRegex.test(accountHandle) && passwordRegex.test(password)
    );
  };

  const handleSignIn = async () => {
    setError("");

    try {
      const response = await fetch(`${BASE_URL}/login`, {
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
        login();
      } else if (response.status === 401) {
        setError("Authentication failed");
      } else if (response.status === 400) {
        setError("Bad username or password");
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
    <View style={styles.container}>
      <Text style={styles.label}>Account Handle</Text>
      <TextInput
        aria-label="AccountHandle"
        style={styles.input}
        placeholder="AccountHandle"
        value={accountHandle}
        onChangeText={handleAccountHandleChange}
      />
      <Text style={styles.label}>Password</Text>
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={handlePasswordChange}
        secureTextEntry
      />
      <Pressable
        onPress={handleSignIn}
        disabled={!isValid}
        style={styles.button}
      >
        <Text style={styles.buttonText}>Sign In</Text>
      </Pressable>
      <Text style={styles.forgotPassword} onPress={handleForgotPassword}>
        Forgot Password?
      </Text>
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: "#007AFF",
    borderRadius: 5,
    padding: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 20,
  },
  label: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 20,
    padding: 10,
    width: "100%",
  },
  forgotPassword: {
    marginTop: 20,
    color: "blue",
    textDecorationLine: "underline",
  },
  error: {
    color: "red",
    marginTop: 20,
  },
});

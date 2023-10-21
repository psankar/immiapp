import axios from "axios";
import { useTranslation } from "react-i18next";
import React, { useContext, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import BASE_URL from "../config";
import { AuthContext, AuthContextType } from "../context/AuthContext";

export const SignIn = () => {
  const [accountHandle, setAccountHandle] = useState("");
  const [password, setPassword] = useState("");
  const [isValid, setIsValid] = useState(false);
  const [error, setError] = useState("");
  const [isWaiting, setIsWaiting] = useState(false);

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

  const handleSignIn = () => {
    setError("");
    setIsWaiting(true);

    axios
      .post(`${BASE_URL}/login`, {
        account_handle: accountHandle,
        password: password,
      })
      .then((response) => {
        if (response.status === 200) {
          console.log("Authentication succeeded");
          login();
        } else {
          console.error(response);
          setError("Unknown error occurred");
        }
      })
      .catch((error) => {
        console.error(error);
        if (error.response.status === 401) {
          setError("Wrong username or password");
        } else if (error.response.status === 400) {
          setError("Invalid username or password");
        } else {
          setError("Network error");
        }
      })
      .finally(() => {
        setIsWaiting(false);
      });
  };

  const handleForgotPassword = () => {
    // handle forgot password
  };

  if (isWaiting) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  const { t } = useTranslation();

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Account Handle</Text>
      <TextInput
        style={styles.input}
        placeholder="handle1"
        placeholderTextColor="#999"
        value={accountHandle}
        onChangeText={handleAccountHandleChange}
      />
      <Text style={styles.label}>Password</Text>
      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor="#999"
        value={password}
        onChangeText={handlePasswordChange}
        secureTextEntry
      />
      <Pressable
        onPress={handleSignIn}
        disabled={!isValid}
        style={styles.button}
      >
        <Text style={styles.buttonText}>{t("sign_in")}</Text>
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
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
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

import axios from "axios";
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
import t from "../localization/i18n";

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
    const accountHandleRegex = /^[a-z0-9]*[a-z][a-z0-9]*$/;
    const passwordRegex = /^\S{8,32}$/;
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
      .then(async (response) => {
        if (response.status === 200) {
          console.log("Authentication succeeded", response);

          // TODO: "VALID" Should come from a const
          if (response.data.account_state !== "VALID") {
            setError(t("account_invalid_state"));
            return;
          }

          await axios
            .post(
              `${BASE_URL}/twofa/verify`,
              {
                code: "TODO: Yet to implement 2fa support",
              },
              {
                headers: {
                  Authorization: `Bearer ${response.data.login_token}`,
                },
              }
            )
            .then((response) => {
              let authToken = response.data.auth_token;
              let refreshToken = response.data.refresh_token;
              if (authToken && refreshToken) {
                login(authToken, refreshToken);
                return;
              }
              console.log(response.data);
              setError(t("unknown_error"));
            })
            .catch((error) => {
              if (axios.isAxiosError(error)) {
                if (error.code === "ERR_NETWORK") {
                  setError(t("network_error"));
                  return;
                }
              }
              console.error(error);
              setError(t("unknown_error"));
            });
        } else {
          console.error(response);
          setError(t("unknown_error"));
        }
      })
      .catch((error) => {
        if (axios.isAxiosError(error)) {
          if (error.code === "ERR_NETWORK") {
            setError(t("network_error"));
            return;
          }

          if (error.response?.status === 401) {
            setError(t("wrong_credentials"));
            return;
          } else if (error.response?.status === 400) {
            setError(t("invalid_credentials"));
            return;
          }
        }
        console.error(error);
        setError(t("unknown_error"));
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

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{t("account_handle")}</Text>
      <TextInput
        style={styles.input}
        placeholder="handle1"
        placeholderTextColor="#999"
        value={accountHandle}
        onChangeText={handleAccountHandleChange}
      />
      <Text style={styles.label}>{t("password")}</Text>
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
        style={isValid ? styles.signInEnabled : styles.signInDisabled}
      >
        <Text style={styles.buttonText}>{t("sign_in")}</Text>
      </Pressable>
      <Text style={styles.forgotPassword} onPress={handleForgotPassword}>
        {t("forgot_password")}
      </Text>
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  signInEnabled: {
    backgroundColor: "#007AFF",
    borderRadius: 5,
    padding: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  signInDisabled: {
    backgroundColor: "#999",
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

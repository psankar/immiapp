import { Ionicons } from "@expo/vector-icons";
import { NavigationProp, useIsFocused } from "@react-navigation/native";
import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import {
  ActivityIndicator,
  ImageBackground,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import BASE_URL from "../config";
import {
  isValidAccountHandle,
  isValidPassword,
} from "../constants/global-constants";
import { AuthContext, AuthContextType } from "../context/AuthContext";
import t from "../localization/i18n";

type SignInProps = {
  navigation: NavigationProp<Record<string, object>>;
};

export const SignIn = ({ navigation }: SignInProps) => {
  const [accountHandle, setAccountHandle] = useState("");
  const [password, setPassword] = useState("");
  const [isValid, setIsValid] = useState(false);
  const [error, setError] = useState("");
  const [isWaiting, setIsWaiting] = useState(false);

  const { login } = useContext<AuthContextType>(AuthContext);

  const isFocused = useIsFocused();
  useEffect(() => {}, [isFocused]);

  const onAccountHandleChange = (text: string) => {
    text = text.toLowerCase().replace(/\s+/g, "");
    setAccountHandle(text);
    validateInputs(text, password);
  };

  const onPasswordChange = (text: string) => {
    setPassword(text);
    validateInputs(accountHandle, text);
  };

  const validateInputs = (accountHandle: string, password: string) => {
    setIsValid(
      isValidAccountHandle(accountHandle) && isValidPassword(password)
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
            })
            .finally(() => {
              setPassword("");
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
        setPassword("");
      });
  };

  const handleForgotPassword = () => {
    navigation.navigate(t("forgot_password"), {});
  };

  if (isWaiting) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={styles.viewport}>
      <View style={styles.container}>
        <ImageBackground
          source={require("../../assets/logo.svg")}
          resizeMode="contain"
          tintColor={"violet"}
          style={{
            width: 100, // Adjust the width as needed
            height: 100, // Adjust the height as needed
            alignSelf: "center",
            marginBottom: 80,
          }}
        />
        <Text style={styles.label}>{t("account_handle")}</Text>
        <TextInput
          style={styles.input}
          placeholder="handle1"
          placeholderTextColor="#999"
          value={accountHandle}
          onChangeText={(text) => onAccountHandleChange(text)}
          autoCapitalize="none"
        />
        <Text style={styles.label}>{t("password")}</Text>
        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#999"
          value={password}
          onChangeText={onPasswordChange}
          autoCapitalize="none"
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
        <Pressable
          onPress={() => {
            navigation.navigate("Change Language", {});
          }}
        >
          <View style={styles.languageContainer}>
            <Ionicons name="globe" size={18} color="black" />
            <Text>{"Change Language"}</Text>
          </View>
        </Pressable>
        {error ? <Text style={styles.error}>{error}</Text> : null}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  signInEnabled: {
    backgroundColor: "darkviolet",
    borderRadius: 9,
    padding: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  signInDisabled: {
    backgroundColor: "#999",
    borderRadius: 9,
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
    alignSelf: "center",
    backgroundColor: "#fff",
    padding: 60,
    minWidth: "70%",
  },
  label: {
    fontSize: 12,
    fontWeight: "bold",
    marginBottom: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  languageContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
  },
  input: {
    flex: 1,
    borderColor: "#ccc",
    borderWidth: 1,
    padding: 20,
    borderRadius: 12,
    maxHeight: 40,
    marginBottom: 20,
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
  viewport: {
    flex: 1,
    backgroundColor: "lavender",
  },
});

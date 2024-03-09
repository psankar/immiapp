import { Ionicons } from "@expo/vector-icons";
import { NavigationProp, useIsFocused } from "@react-navigation/native";
import axios from "axios";
import { styled } from "nativewind";
import React, { useContext, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
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

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledTextInput = styled(TextInput);
const StyledPressable = styled(Pressable);

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

  const handleAccountHandleChange = (text: string) => {
    setAccountHandle(text);
    validateInputs(text, password);
  };

  const handlePasswordChange = (text: string) => {
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
      <View>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <StyledView className="flex-1 justify-center items-center bg-gray-100">
      <StyledView className="w-4/5 bg-white rounded-lg shadow-lg p-8">
        <StyledText className="text-lg font-bold mb-4">
          {t("account_handle")}
        </StyledText>
        <StyledTextInput
          className="border border-gray-300 rounded-lg p-2 mb-4"
          placeholder="handle1"
          placeholderTextColor="#999"
          value={accountHandle}
          onChangeText={handleAccountHandleChange}
        />
        <StyledText className="text-lg font-bold mb-4">
          {t("password")}
        </StyledText>
        <StyledTextInput
          className="border border-gray-300 rounded-lg p-2 mb-4"
          placeholder="Password"
          placeholderTextColor="#999"
          value={password}
          onChangeText={handlePasswordChange}
          secureTextEntry
        />
        <StyledPressable
          onPress={handleSignIn}
          disabled={!isValid}
          className="bg-blue-500 text-white rounded-lg p-2 mb-4"
        >
          <StyledText>{t("sign_in")}</StyledText>
        </StyledPressable>
        <StyledPressable>
          <StyledText
            onPress={handleForgotPassword}
            className="text-blue-500 underline"
          >
            {t("forgot_password")}
          </StyledText>
        </StyledPressable>
        <StyledPressable
          onPress={() => {
            navigation.navigate("Change Language", {});
          }}
          className="flex items-center mt-4"
        >
          <StyledView className="flex items-center">
            <Ionicons name="globe" size={18} color="black" />
            <StyledText className="ml-2">{"Change Language"}</StyledText>
          </StyledView>
        </StyledPressable>
        {error ? (
          <StyledText className="text-red-500 mt-4">{error}</StyledText>
        ) : null}
      </StyledView>
    </StyledView>
  );
};

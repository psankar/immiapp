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
    <StyledView className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
      <StyledView className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <StyledText className="block text-sm font-medium leading-6 text-gray-900">
          {t("account_handle")}
        </StyledText>
        <StyledTextInput
          placeholder="handle1"
          placeholderTextColor="#999"
          value={accountHandle}
          onChangeText={handleAccountHandleChange}
          className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
        />
        <StyledText className="block text-sm font-medium leading-6 text-gray-900">
          {t("password")}
        </StyledText>
        <StyledTextInput
          placeholder="Password"
          placeholderTextColor="#999"
          value={password}
          onChangeText={handlePasswordChange}
          secureTextEntry
          className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
        />
        <Pressable onPress={handleSignIn} disabled={!isValid}>
          <StyledText className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
            {t("sign_in")}
          </StyledText>
        </Pressable>
        <Pressable>
          <StyledText
            className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            onPress={handleForgotPassword}
          >
            {t("forgot_password")}
          </StyledText>
        </Pressable>
        <Pressable
          onPress={() => {
            navigation.navigate("Change Language", {});
          }}
        >
          <StyledView>
            <Ionicons name="globe" size={18} color="black" />
            <StyledText>{"Change Language"}</StyledText>
          </StyledView>
        </Pressable>
        {error ? <StyledText>{error}</StyledText> : null}
      </StyledView>
    </StyledView>
  );
};

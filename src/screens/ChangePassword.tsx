import React, { useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { isValidPassword } from "../constants/global-constants";
import { saxios } from "../context/AuthContext";
import t from "../localization/i18n";

export const ChangePassword = () => {
  const [existingPassword, setExistingPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [isValid, setIsValid] = useState(false);

  const onExistingPasswordInputChange = (text: string) => {
    setExistingPassword(text);
    validateInputs();
  };

  const onNewPasswordInputChange = (text: string) => {
    setNewPassword(text);
    validateInputs();
  };

  const onRepeatPasswordInputChange = (text: string) => {
    setRepeatPassword(text);
    validateInputs();
  };

  const validateInputs = () => {
    setIsValid(
      isValidPassword(existingPassword) &&
        isValidPassword(newPassword) &&
        newPassword === repeatPassword
    );
  };

  const handleChangePassword = async () => {
    setError("");

    if (!isValidPassword(newPassword)) {
      setError(t("invalid_password"));
      return;
    }

    if (newPassword !== repeatPassword) {
      // ideally this should never get called,
      // as the button will not be enabled if they are different
      setError(t("passwords_dont_match"));
      return;
    }

    setIsLoading(true);
    try {
      await saxios.post("/change-password", {
        existing_password: existingPassword,
        new_password: newPassword,
      });
      setError("");
    } catch (err) {
      setError(t("password_change_failed"));
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{t("password_existing")}</Text>
      <TextInput
        style={styles.input}
        secureTextEntry
        placeholder={t("password")}
        value={newPassword}
        onChangeText={onExistingPasswordInputChange}
      />
      <Text style={styles.label}>{t("password_new")}</Text>
      <TextInput
        style={styles.input}
        secureTextEntry
        placeholder={t("password")}
        value={newPassword}
        onChangeText={onNewPasswordInputChange}
      />
      <Text style={styles.label}>{t("password_new_repeat")}</Text>
      <TextInput
        style={styles.input}
        secureTextEntry
        placeholder={t("password")}
        value={repeatPassword}
        onChangeText={onRepeatPasswordInputChange}
      />
      <Pressable
        onPress={handleChangePassword}
        disabled={!isValid}
        style={isValid ? styles.buttonEnabled : styles.buttonDisabled}
      >
        <Text style={styles.buttonText}>{t("change_password")}</Text>
      </Pressable>
      {error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  buttonEnabled: {
    backgroundColor: "#007AFF",
    borderRadius: 5,
    padding: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonDisabled: {
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
  input: {
    placeholderTextColor: "#999",
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 20,
    padding: 10,
    width: "100%",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
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
  error: {
    color: "red",
    marginTop: 20,
  },
});

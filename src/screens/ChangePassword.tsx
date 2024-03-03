import React, { useState } from "react";
import {
  ActivityIndicator,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { isValidPassword } from "../constants/global-constants";
import { saxios } from "../context/AuthContext";
import t from "../localization/i18n";
import { NavigationProp } from "@react-navigation/native";

type ChangePasswordProps = {
  navigation: NavigationProp<Record<string, object>>;
};

export const ChangePassword = ({ navigation }: ChangePasswordProps) => {
  const [existingPassword, setExistingPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [isValid, setIsValid] = useState(false);
  const [passwordChanged, setPasswordChanged] = useState(false);

  const onExistingPasswordInputChange = (text: string) => {
    setExistingPassword(text);
    validateInputs(text, newPassword, repeatPassword);
  };

  const onNewPasswordInputChange = (text: string) => {
    setNewPassword(text);
    validateInputs(existingPassword, text, repeatPassword);
  };

  const onRepeatPasswordInputChange = (text: string) => {
    setRepeatPassword(text);
    validateInputs(existingPassword, newPassword, text);
  };

  const validateInputs = (
    existingPassword: string,
    newPassword: string,
    repeatPassword: string
  ) => {
    console.debug();
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
    saxios
      .post("/change-password", {
        existing_password: existingPassword,
        new_password: newPassword,
      })
      .then((response) => {
        if (response.status === 200) {
          console.log("Password change succeeded", response);
          setPasswordChanged(true);
        }
      })
      .catch((error) => {
        console.error("Password change failed", error);
        setError(t("password_change_failed"));
      })
      .finally(() => {
        setIsLoading(false);
        setExistingPassword("");
        setNewPassword("");
        setRepeatPassword("");
      });
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (passwordChanged) {
    return (
      <Modal visible={true} animationType="slide">
        <View style={styles.modalContainer}>
          <Text style={styles.modalText}>{t("password_changed")}</Text>
          <Pressable
            onPress={() => {
              setPasswordChanged(false);
              navigation.goBack();
            }}
            style={styles.modalButton}
          >
            <Text style={styles.modalButtonText}>OK</Text>
          </Pressable>
        </View>
      </Modal>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{t("password_existing")}</Text>
      <TextInput
        style={styles.input}
        secureTextEntry
        placeholder={t("password")}
        value={existingPassword}
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
      {error ? <Text style={styles.error}>{error}</Text> : null}
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
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  modalText: {
    fontSize: 18,
    marginBottom: 20,
  },
  modalButton: {
    backgroundColor: "#f00",
    padding: 10,
    borderRadius: 5,
    alignSelf: "center",
  },
  modalButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});

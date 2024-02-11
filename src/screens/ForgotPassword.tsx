import { NavigationProp } from "@react-navigation/native";
import axios from "axios";
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
import BASE_URL from "../config";
import { isValidAccountHandle } from "../constants/global-constants";
import t from "../localization/i18n";

type ForgotPasswordProps = {
  navigation: NavigationProp<Record<string, object>>;
};

const ForgotPassword = ({ navigation }: ForgotPasswordProps) => {
  const [accountHandle, setAccountHandle] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [error, setError] = useState("");
  const [isWaiting, setIsWaiting] = useState(false);

  const handlePress = () => {
    setError("");
    setIsWaiting(true);
    axios
      .post(`${BASE_URL}/forgot-password`, {
        account_handle: accountHandle,
      })
      .then(() => {
        setIsWaiting(false);
        setModalVisible(true);
      })
      .catch((error: any) => {
        setIsWaiting(false);
        setError(error.response.data);
      });
  };

  if (isWaiting) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TextInput
        value={accountHandle}
        onChangeText={setAccountHandle}
        placeholder="handle1"
        style={styles.input}
      />
      <Pressable
        onPress={handlePress}
        disabled={!isValidAccountHandle(accountHandle)}
        style={
          isValidAccountHandle(accountHandle)
            ? styles.submitEnabled
            : styles.submitDisabled
        }
      >
        <Text style={styles.buttonText}>{t("submit")}</Text>
      </Pressable>
      <Modal visible={modalVisible} animationType="slide">
        <View style={styles.modalContainer}>
          <Text style={styles.modalText}>{t("check_password_reset_mail")}</Text>
          <Pressable
            onPress={() => {
              setModalVisible(false);
              navigation.goBack();
            }}
            style={styles.modalButton}
          >
            <Text style={styles.modalButtonText}>OK</Text>
          </Pressable>
        </View>
      </Modal>
      {error && (
        <Text style={styles.error}>
          {t("error")}: {error}
        </Text>
      )}
    </View>
  );
};

export default ForgotPassword;

const styles = StyleSheet.create({
  submitEnabled: {
    backgroundColor: "#007AFF",
    borderRadius: 5,
    padding: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  submitDisabled: {
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
    placeholderTextColor: "#999",
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
    backgroundColor: "#007AFF",
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

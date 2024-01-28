import { Ionicons } from "@expo/vector-icons";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import React, { useState } from "react";
import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import BASE_URL from "../config";
import { globalConstants as gc } from "../constants/global-constants";
import { saxios } from "../context/AuthContext";
import t from "../localization/i18n";

type Props = {
  route: any;
  navigation: NavigationProp<Record<string, object>>;
};

const Compose = ({ route, navigation }: Props) => {
  const [publishText, setPublishText] = useState("");
  const [error, setError] = useState<string | null>(null);
  const { inReplyTo, inReplyToAccount, inReplyToBody } = route.params;

  const handleTextChange = (text: string) => {
    setPublishText(text);
  };

  const handlePublish = () => {
    // Logic to publish the text
    saxios
      .post(`${BASE_URL}/immis`, {
        body: publishText,
      })
      .then(() => {
        navigation.goBack();
      })
      .catch((error: any) => {
        setError(error.response.data);
      });
  };

  const handleReset = () => {
    setPublishText("");
  };

  return (
    <View style={styles.container}>
      {error && (
        <Modal visible={true} animationType="slide">
          <View style={styles.modalContainer}>
            <Text style={styles.modalText}>{error}</Text>
            <Pressable
              onPress={() => setError(null)}
              style={styles.modalButton}
            >
              <Text style={styles.modalButtonText}>OK</Text>
            </Pressable>
          </View>
        </Modal>
      )}
      {inReplyTo && (
        <Text style={styles.replyPreview}>
          {t("replying_to")}: @{inReplyToAccount}
          {"\n\n"}
          {inReplyToBody}
        </Text>
      )}
      <TextInput
        style={styles.textInput}
        value={publishText}
        onChangeText={handleTextChange}
        multiline={true}
        numberOfLines={4}
        placeholder={t("say_nice_things")}
      />
      <Ionicons name="camera" size={24} color="black" />
      <View style={styles.buttonsInline}>
        <Pressable
          style={[styles.button, styles.publishButton]}
          disabled={
            publishText.length > gc.immiMaxLen ||
            publishText.length < gc.immiMinLen
          }
          onPress={handlePublish}
        >
          <Text style={styles.buttonText}>{t("publish")}</Text>
        </Pressable>
        <Pressable
          style={[styles.button, styles.resetButton]}
          onPress={handleReset}
        >
          <Text style={styles.buttonText}>{t("reset")}</Text>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    borderRadius: 5,
  },
  textInput: {
    borderWidth: 1,
    borderRadius: 5,
    borderColor: "gray",
    marginBottom: 16,
    padding: 8,
    placeholderTextColor: "#999",
  },
  button: {
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    alignSelf: "center",
    width: 200,
  },
  buttonsInline: {
    flexDirection: "column",
    justifyContent: "space-between",
  },
  publishButton: {
    backgroundColor: "#007AFF",
    padding: 10,
    borderRadius: 5,
    marginTop: 20,
    alignSelf: "center",
  },
  resetButton: {
    backgroundColor: "gray",
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
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
  replyPreview: {
    fontSize: 18,
    marginBottom: 20,
    color: "#666",
  },
});

export default Compose;

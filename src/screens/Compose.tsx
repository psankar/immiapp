import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import { Pressable, Text, TextInput, View, StyleSheet } from "react-native";
import { saxios } from "../context/AuthContext";
import BASE_URL from "../config";
import { useNavigation } from "@react-navigation/native";
import { globalConstants as gc } from "../constants/global-constants";
import t from "../localization/i18n";

const Compose = () => {
  const [publishText, setPublishText] = useState("");
  const [responseMessage, setResponseMessage] = useState("");
  const [showElement, setShowElement] = useState(true);
  const navigation = useNavigation();
  let isSuccess = false;
  const handleTextChange = (text: string) => {
    setPublishText(text);
  };
  const handlePublish = () => {
    // Logic to publish the text
    saxios
      .post(`${BASE_URL}/immis`, {
        body: publishText,
      })
      .then((response) => {
        isSuccess = response.status === 201;
        if (isSuccess) {
          setResponseMessage("Published post successfully");
          handleReset();
        }
      })
      .catch((error: any) => {
        setResponseMessage(error);
      });
  };

  const handleReset = () => {
    setPublishText("");
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.textInput}
        value={publishText}
        onChangeText={handleTextChange}
        multiline={true}
        numberOfLines={10}
        placeholder="Say something nice..."
      />
      <Ionicons name="camera" size={24} color="black" />
      <View style={styles.buttonsInline}>
        <Pressable
          style={[styles.button, styles.publishButton]}
          disabled={publishText.length > gc.pubishTextSize}
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
      {showElement && (
        <Text style={[!isSuccess && styles.failure, styles.responseAlert]}>
          {responseMessage}
        </Text>
      )}
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
    height: 200,
    borderWidth: 1,
    borderColor: "gray",
    marginBottom: 16,
    padding: 8,
  },
  button: {
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    alignSelf: "center",
    width: 200,
  },
  buttonsInline: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  publishButton: {
    backgroundColor: "blue",
  },
  resetButton: {
    backgroundColor: "gray",
  },
  buttonText: {
    color: "white",
    textAlign: "center",
  },
  responseAlert: {
    padding: 10,
    marginTop: 20,
    color: "green",
  },
  failure: {
    color: "red",
  },
});

export default Compose;

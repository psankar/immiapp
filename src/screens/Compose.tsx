import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { Pressable, Text, TextInput, View, StyleSheet } from "react-native";

const Compose = () => {
  const [text, setText] = useState("");

  const handleTextChange = (text: string) => {
    setText(text);
  };

  const handlePublish = () => {
    // Logic to publish the text
    console.log("Publishing:", text);
  };

  const handleReset = () => {
    setText("");
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.textInput}
        value={text}
        onChangeText={handleTextChange}
        multiline={true}
        numberOfLines={10}
        placeholder="Say something nice..."
      />
      <Pressable
        style={[styles.button, styles.publishButton]}
        onPress={handlePublish}
      >
        <Text style={styles.buttonText}>Publish</Text>
      </Pressable>
      <Pressable
        style={[styles.button, styles.resetButton]}
        onPress={handleReset}
      >
        <Text style={styles.buttonText}>Reset</Text>
      </Pressable>
      <Ionicons name="camera" size={24} color="black" />{" "}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
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
    marginTop: 20,
    alignSelf: "center",
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
});

export default Compose;

import React, { useState } from "react";
import { Pressable, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons"; // Import the Ionicons component

const Compose = () => {
  const [text, setText] = useState("");

  const handleTextChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(event.target.value);
  };

  const handlePublish = () => {
    // Logic to publish the text
    console.log("Publishing:", text);
  };

  const handleReset = () => {
    setText("");
  };

  return (
    <View>
      <textarea value={text} onChange={handleTextChange} rows={10} cols={50} />
      <Pressable onPress={handlePublish}>
        <Text>Publish</Text>
      </Pressable>
      <Pressable onPress={handleReset}>
        <Text>Reset</Text>
      </Pressable>
      <Ionicons name="camera" size={24} color="black" />{" "}
      {/* Use the Ionicons component */}
    </View>
  );
};

export default Compose;

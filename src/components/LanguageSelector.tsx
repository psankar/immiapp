import { NavigationProp } from "@react-navigation/native";
import i18n from "i18next";
import React from "react";
import { FlatList, Pressable, Text, View } from "react-native";

type Language = {
  name: string;
  code: string;
};

type LanguageListProps = {
  navigation: NavigationProp<Record<string, object>>;
};

const LanguageList = ({ navigation }: LanguageListProps) => {
  const languages: Language[] = [
    { name: "English", code: "en" },
    { name: "Tamil தமிழ்", code: "ta" },
  ];

  const renderLanguage = ({ item }: { item: Language }) => (
    <View>
      <Pressable
        onPress={() => {
          i18n.changeLanguage(item.code);
          navigation.goBack();
        }}
      >
        <Text>{item.name}</Text>
      </Pressable>
    </View>
  );

  return (
    <View>
      <FlatList
        data={languages}
        renderItem={renderLanguage}
        keyExtractor={(item) => item.name}
      />
    </View>
  );
};

export default LanguageList;

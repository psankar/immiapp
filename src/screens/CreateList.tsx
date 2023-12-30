import React, { useState } from "react";
import {
  View,
  TextInput,
  Pressable,
  Alert,
  Text,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { saxios } from "../context/AuthContext";
import { t } from "i18next";
import { NavigationProp } from "@react-navigation/native";

type CreateListProps = {
  navigation: NavigationProp<Record<string, object>>;
};

const CreateList = ({ navigation }: CreateListProps) => {
  const [listName, setListName] = useState("");
  const [listHandle, setListHandle] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isWaiting, setIsWaiting] = useState(false);

  const handleCreateList = async () => {
    // TODO: Replace with actual Regex validation in server side
    const listNameRegex = /^[A-Za-z\s]+$/;
    const listHandleRegex = /^[A-Za-z0-9_]+$/;

    if (!listNameRegex.test(listName)) {
      setError(t("list_name_invalid"));
      return;
    }

    if (!listHandleRegex.test(listHandle)) {
      setError(t("list_handle_invalid"));
      return;
    }

    setIsWaiting(true);
    setError(null);

    // Make network call to create a new list
    saxios
      .post("/lists", {
        display_name: listName,
        handle: listHandle,
      })
      .then((response) => {
        if (response.status === 200) {
          navigation.navigate(t("my_lists"), {});
        } else {
          setError(t("list_create_failed"));
        }
      })
      .catch((error) => {
        setError(t("list_create_failed"));
      })
      .finally(() => {
        setIsWaiting(false);
      });
  };

  return (
    <View style={styles.container}>
      {isWaiting ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      ) : (
        <View>
          <TextInput
            placeholder="List Name"
            value={listName}
            onChangeText={setListName}
          />
          <TextInput
            placeholder="List Handle"
            value={listHandle}
            onChangeText={setListHandle}
          />
          <Pressable onPress={handleCreateList} style={styles.createListButton}>
            <Text style={styles.createListButtonText}>{t("create_list")}</Text>
          </Pressable>
          {error && <Text>{error}</Text>}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  createListButton: {
    backgroundColor: "#007AFF",
    padding: 10,
    borderRadius: 5,
    marginTop: 20,
    alignSelf: "center",
  },
  createListButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  signoutButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default CreateList;

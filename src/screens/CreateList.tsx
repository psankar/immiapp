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
  const [listDisplayName, setListDisplayName] = useState("");
  const [listHandle, setListHandle] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isWaiting, setIsWaiting] = useState(false);

  const handleCreateList = async () => {
    const listHandleRegex = /^[a-z0-9]*[a-z][a-z0-9]*$/;

    if (listDisplayName.length < 3 || listDisplayName.length > 32) {
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
        display_name: listDisplayName,
        handle: listHandle,
      })
      .then((response) => {
        if (response.status === 200) {
          navigation.navigate(t("my_lists"), {});
        } else {
          console.error(error);
          setError(t("list_create_failed"));
        }
      })
      .catch((error) => {
        console.error(error);
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
          <Text style={styles.label}>{t("list_name")}</Text>
          <TextInput
            style={styles.input}
            placeholder={t("list_name_placeholder")}
            value={listDisplayName}
            onChangeText={setListDisplayName}
          />
          <Text style={styles.label}>{t("list_handle")}</Text>
          <TextInput
            style={styles.input}
            placeholder={t("list_handle_placeholder")}
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
  label: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 20,
    padding: 10,
    width: "100%",
  },
  signoutButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default CreateList;

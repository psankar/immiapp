import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import BASE_URL from "../config";
import { saxios } from "../context/AuthContext";
import t from "../localization/i18n";

import { NavigationProp, useIsFocused } from "@react-navigation/native";
import { MyListsActions } from "../components/MyListsActions";
import css from "../css/css";

type MyListsProps = {
  navigation: NavigationProp<Record<string, object>>;
};

export const MyLists = ({ navigation }: MyListsProps) => {
  const [lists, setLists] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLists = async () => {
    saxios
      .get(`${BASE_URL}/lists`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      })
      .then((response) => {
        if (response.status === 200) {
          setLists(response.data);
        } else {
          setError(t("lists_fetch_failed"));
        }
      })
      .catch((error) => {
        console.error(error);
        setError(t("lists_fetch_failed"));
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const isFocused = useIsFocused();
  useEffect(() => {
    fetchLists();
  }, [isFocused]);

  const renderItem = ({
    item,
  }: {
    item: { id: string; display_name: string };
  }) => (
    <View style={styles.listItem}>
      <Pressable
        style={{ flex: 8, justifyContent: "center" }}
        onPress={() =>
          navigation.navigate(t("list_timeline"), {
            listId: item.id,
            displayName: item.display_name,
          })
        }
      >
        <Text style={[styles.listItemText]}>{item.display_name}</Text>
      </Pressable>
      <View style={{ flex: 1, alignItems: "flex-end" }}>
        <Pressable
          onPress={() =>
            navigation.navigate(t("list_manage"), {
              listId: item.id,
              displayName: item.display_name,
            })
          }
        >
          <Ionicons name="settings" size={24} color="black" />
        </Pressable>
      </View>
    </View>
  );

  if (isLoading) {
    return (
      <View style={css.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        {error && (
          <Modal visible={true} animationType="slide">
            <View style={styles.modalContainer}>
              <Text style={styles.modalText}>{error}</Text>
              <Pressable
                onPress={() => {
                  fetchLists();
                  setError(null);
                }}
                style={styles.modalButton}
              >
                <Text style={styles.modalButtonText}>OK</Text>
              </Pressable>
            </View>
          </Modal>
        )}
      </View>
    );
  }

  return (
    <View style={css.viewport}>
      <View style={styles.container}>
        <MyListsActions navigation={navigation} />
        <Text style={[css.label, { textAlign: "center", paddingBottom: 10 }]}>
          {t("my_lists")}
        </Text>
        <FlatList
          data={lists}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
        />
        <View>
          <Pressable
            style={css.btnPrimaryEnabled}
            onPress={() => navigation.navigate(t("create_list"), {})}
          >
            <Text style={css.btnText}>{t("create_list")}</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignSelf: "center",
    minWidth: "70%",
    padding: 20,
  },
  listItem: {
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    flexDirection: "row",
    padding: 10,
  },
  listItemText: {
    fontSize: 18,
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

import { Ionicons } from "@expo/vector-icons";
import React, { useContext, useEffect, useState } from "react";
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
import { AuthContext, AuthContextType, saxios } from "../context/AuthContext";
import t from "../localization/i18n";

import { NavigationProp } from "@react-navigation/native";
import { HeaderActions } from "../components/HeaderActions";

type MyListsProps = {
  navigation: NavigationProp<Record<string, object>>;
};

export const MyLists = ({ navigation }: MyListsProps) => {
  const [lists, setLists] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { logout } = useContext<AuthContextType>(AuthContext);

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

  useEffect(() => {
    fetchLists();
  }, []);

  const renderItem = ({
    item,
  }: {
    item: { handle: string; display_name: string };
  }) => (
    <View style={styles.listItem}>
      <Pressable
        onPress={() =>
          navigation.navigate(t("list_manage"), {
            list_handle: item.handle,
            display_name: item.display_name,
          })
        }
      >
        <Ionicons name="settings" size={24} color="black" />
      </Pressable>
      <Text style={styles.listItemText}>{item.display_name}</Text>
      <Pressable
        onPress={() =>
          navigation.navigate("list_timeline", {
            displayName: item.display_name,
            handle: item.handle,
          })
        }
      >
        <Ionicons name="arrow-forward" size={24} color="black" />
      </Pressable>
    </View>
  );

  const handleSignout = () => {
    logout();
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
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      ) : (
        <>
          <HeaderActions navigation={navigation} />
          <FlatList
            data={lists}
            renderItem={renderItem}
            keyExtractor={(item) => item.handle}
          />
          <View>
            <Pressable
              style={styles.createListButton}
              onPress={() => navigation.navigate(t("create_list"), {})}
            >
              <Text style={styles.createListButtonText}>
                {t("create_list")}
              </Text>
            </Pressable>
            <Pressable onPress={handleSignout} style={styles.signoutButton}>
              <Text style={styles.signoutButtonText}>{t("signout")}</Text>
            </Pressable>
          </View>
        </>
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
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  listItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    flexDirection: "row",
  },
  listItemText: {
    fontSize: 18,
  },
  signoutButton: {
    backgroundColor: "#f00",
    padding: 10,
    borderRadius: 5,
    marginTop: 20,
    alignSelf: "center",
  },
  signoutButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
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

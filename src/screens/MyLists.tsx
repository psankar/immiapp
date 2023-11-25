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
import { Ionicons } from "@expo/vector-icons";

import { NavigationProp } from "@react-navigation/native";

type MyListsProps = {
  navigation: NavigationProp<Record<string, object>>;
};

export const MyLists = ({ navigation }: MyListsProps) => {
  const [lists, setLists] = useState([]);
  const [isWaiting, setIsWaiting] = useState(true);
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
        setError(t("lists_fetch_failed"));
      })
      .finally(() => {
        setIsWaiting(false);
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
      {isWaiting ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      ) : (
        <>
          <FlatList
            data={lists}
            renderItem={renderItem}
            keyExtractor={(item) => item.handle}
          />
          <Pressable onPress={handleSignout} style={styles.signoutButton}>
            <Text style={styles.signoutButtonText}>Signout</Text>
          </Pressable>
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
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  listItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
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

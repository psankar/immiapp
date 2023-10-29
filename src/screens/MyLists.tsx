import { useNavigation } from "@react-navigation/native";
import React, { useContext, useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import BASE_URL from "../config";
import { AuthContext, AuthContextType, saxios } from "../context/AuthContext";

export const MyLists = () => {
  const [lists, setLists] = useState([]);
  const [isWaiting, setIsWaiting] = useState(true);
  const navigation = useNavigation();

  const { logout, authToken } = useContext<AuthContextType>(AuthContext);

  const fetchLists = async () => {
    saxios
      .get(`${BASE_URL}/lists`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      })
      .then((response) => {
        if (response.status === 200) {
          setLists(response.data);
        } else {
          console.log("Lists fetch failed", response);
        }
      })
      .catch((error) => {
        console.log("Lists fetch failed", error);
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
    </View>
  );

  if (isWaiting) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={lists}
        renderItem={renderItem}
        keyExtractor={(item) => item.handle}
      />
      <Pressable onPress={logout} style={styles.signoutButton}>
        <Text style={styles.signoutButtonText}>Signout</Text>
      </Pressable>
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
});

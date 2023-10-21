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
import { AuthContext, AuthContextType } from "../context/AuthContext";

export const MyLists = () => {
  const [lists, setLists] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigation = useNavigation();

  const { logout } = useContext<AuthContextType>(AuthContext);

  useEffect(() => {
    const fetchLists = async () => {
      try {
        const data: any = [
          { ListID: 1, ListName: "List 1" },
          { ListID: 2, ListName: "List 2" },
        ];
        setLists(data);
        setIsLoading(false);
      } catch (error) {
        console.error(error);
      }
    };
    fetchLists();
  }, []);

  const renderItem = ({
    item,
  }: {
    item: { ListID: number; ListName: string };
  }) => (
    <View style={styles.listItem}>
      <Text style={styles.listItemText}>{item.ListName}</Text>
    </View>
  );

  if (isLoading) {
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
        keyExtractor={(item) => item.ListID.toString()}
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

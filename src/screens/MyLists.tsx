import { useNavigation } from "@react-navigation/native";
import React, { useContext, useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
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
    <View style={{ padding: 10 }}>
      <Text>{item.ListName}</Text>
    </View>
  );

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View>
      <FlatList
        data={lists}
        renderItem={renderItem}
        keyExtractor={(item) => item.ListID.toString()}
      />
      <Pressable onPress={logout}>
        <Text>Signout</Text>
      </Pressable>
    </View>
  );
};

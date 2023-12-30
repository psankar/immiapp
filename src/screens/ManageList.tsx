import { NavigationProp } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { Button, FlatList, Text, TextInput, View } from "react-native";
import { saxios } from "../context/AuthContext";

interface User {
  account_handle: string;
}

export interface ManageListProps {
  navigation: NavigationProp<Record<string, object>>;
  list_handle: string;
  display_name: string;
}

const ManageList = ({
  navigation,
  list_handle,
  display_name,
}: ManageListProps) => {
  const [users, setUsers] = useState<User[]>([]);
  const [accountHandle, setAccountHandle] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    console.log("ManageList", list_handle, display_name);
    navigation.setOptions({ title: display_name });
    saxios
      .post("/get-list-members", { list_handle })
      .then((response) => setUsers(response.data))
      .catch((error) => setError(error.message));
  }, []);

  const addAccountToList = () => {
    const regex = /^[a-z0-9]*[a-z][a-z0-9]*$/;
    if (!regex.test(accountHandle)) {
      setError("Invalid account handle");
      return;
    }

    saxios
      .post("/add-to-list", { list_handle, account_handle: accountHandle })
      .then((response) => setUsers([...users, response.data]))
      .catch((error) => setError(error.message));
  };

  return (
    <View>
      <FlatList
        data={users}
        keyExtractor={(item) => item.account_handle}
        renderItem={({ item }) => (
          <View>
            <Text>{item.account_handle}</Text>
          </View>
        )}
      />
      <TextInput value={accountHandle} onChangeText={setAccountHandle} />
      <Button title="Add" onPress={addAccountToList} />
      {error && <Text>{error}</Text>}
    </View>
  );
};

export default ManageList;

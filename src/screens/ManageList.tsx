import { NavigationProp } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { Button, FlatList, Text, TextInput, View } from "react-native";
import { saxios } from "../context/AuthContext";
import t from "../localization/i18n";

type ManageListProps = {
  route: any;
  navigation: NavigationProp<Record<string, object>>;
};

const ManageList = ({ route, navigation }: ManageListProps) => {
  const { list_handle, display_name } = route.params;
  const [users, setUsers] = useState<String[]>([]);
  const [accountHandle, setAccountHandle] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    console.log("ManageList", list_handle, display_name);
    navigation.setOptions({ title: display_name });
    saxios
      .post("/get-list-members", { list_handle })
      .then((response) => setUsers(response.data.account_handles))
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
      .then((response) => {
        if (response.status === 200) {
          // TODO: Perhaps show a dialog that the user was added to the list
          navigation.navigate(t("my_lists"), {});
        } else {
          // TODO: Handle errors more gracefully with proper messages
          setError(response.data.error);
        }
      })
      .catch((error) => setError(error.message));
  };

  return (
    <View>
      <FlatList data={users} renderItem={({ item }) => <Text>{item}</Text>} />
      <TextInput value={accountHandle} onChangeText={setAccountHandle} />
      <Button title="Add" onPress={addAccountToList} />
      {error && <Text>{error}</Text>}
    </View>
  );
};

export default ManageList;

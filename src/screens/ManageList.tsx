import { NavigationProp } from "@react-navigation/native";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";
import { saxios } from "../context/AuthContext";
import t from "../localization/i18n";
import { StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

type ManageListProps = {
  route: any;
  navigation: NavigationProp<Record<string, object>>;
};

const ManageList = ({ route, navigation }: ManageListProps) => {
  const { list_handle, display_name } = route.params;
  const [users, setUsers] = useState<String[]>([]);
  const [accountHandle, setAccountHandle] = useState("");
  const [error, setError] = useState("");
  const [isWaiting, setIsWaiting] = useState(false);

  useEffect(() => {
    navigation.setOptions({ title: display_name });
    saxios
      .post("/get-list-members", { list_handle })
      .then((response) => setUsers(response.data.account_handles))
      .catch((error) => setError(error.message));
  }, []);

  const handleRemoveUserFromList = (account: String) => {
    setIsWaiting(true);
    saxios
      .post("/remove-from-list", { list_handle, account_handle: account })
      .then((response) => {
        if (response.status === 200) {
          navigation.navigate(t("my_lists"), {});
        }
      })
      .catch((error) => setError(error.message))
      .finally(() => {
        setIsWaiting(false);
      });
  };

  const renderAccountHandle = ({ item }: { item: String }) => (
    <View style={styles.listItem}>
      <Text style={styles.listItemText}>{item}</Text>
      <Ionicons
        name="remove-circle"
        size={24}
        color="red"
        onPress={() => handleRemoveUserFromList(item)}
      />
    </View>
  );

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
        }
        // TODO: Handle errors more gracefully with proper messages
        setError(response.data.error);
      })
      .catch((error) => {
        if (error.response?.status === 400) {
          setError(t("account_not_found"));
          return;
        }
        setError(error.message);
      });
  };

  if (isWaiting) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View>
      {users && users.length === 0 ? (
        <Text>{t("no_users_in_list")}</Text>
      ) : (
        <FlatList data={users} renderItem={renderAccountHandle} />
      )}

      {
        <View
          style={{
            borderBottomColor: "black",
            borderBottomWidth: StyleSheet.hairlineWidth,
          }}
        />
      }

      <View>
        <Text style={styles.label}>{t("account_handle")}</Text>
        <View>
          <TextInput
            value={accountHandle}
            style={styles.input}
            placeholder={t("account_handle")}
            placeholderTextColor="#999"
            onChangeText={setAccountHandle}
          />
          <Pressable onPress={addAccountToList} style={styles.addToListButton}>
            <Text style={styles.addToListButtonText}>{t("add_to_list")}</Text>
          </Pressable>
        </View>
      </View>

      {error ? <Text>{error}</Text> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  addToListButton: {
    backgroundColor: "#007AFF",
    padding: 10,
    borderRadius: 5,
    marginTop: 20,
    alignSelf: "center",
  },
  addToListButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  label: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  listItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  listItemText: {
    fontSize: 16,
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 20,
    padding: 10,
    width: "100%",
  },
});

export default ManageList;

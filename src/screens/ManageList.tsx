import { NavigationProp } from "@react-navigation/native";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Modal,
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
  const { listId, displayName } = route.params;
  const [users, setUsers] = useState<String[]>([]);
  const [accountHandle, setAccountHandle] = useState("");
  const [msg, setMsg] = useState<string | null>(null);
  const [isWaiting, setIsWaiting] = useState(false);

  useEffect(() => {
    navigation.setOptions({ title: displayName });
    refresh();
  }, []);

  const refresh = () => {
    setIsWaiting(true);
    saxios
      .post("/get-list-members", { list_id: listId })
      .then((response) => {
        setIsWaiting(false);
        setUsers(response.data.account_handles);
      })
      .catch((error) => {
        setIsWaiting(false);
        setMsg(error.message);
      });
  };

  const handleRemoveUserFromList = (account: String) => {
    setIsWaiting(true);
    saxios
      .post("/remove-from-list", { list_id: listId, account_handle: account })
      .then((response) => {
        setIsWaiting(false);
        if (response.status === 200) {
          setMsg(t("account_removed_from_list"));
          refresh();
          return;
        }
      })
      .catch((error) => {
        setIsWaiting(false);
        setMsg(error.message);
      });
  };

  const renderAccountHandle = ({ item }: { item: String }) => (
    <View style={styles.accountsListView}>
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
      setMsg("Invalid account handle");
      return;
    }

    saxios
      .post("/add-to-list", { list_id: listId, account_handle: accountHandle })
      .then((response) => {
        if (response.status === 200) {
          setMsg(t("account_added_to_list"));
          setAccountHandle("");
          refresh();
          return;
        }
        // TODO: Handle errors more gracefully with proper messages
        setMsg(response.data.error);
      })
      .catch((error) => {
        if (error.response?.status === 400) {
          setMsg(t("account_not_found"));
          return;
        }
        setMsg(error.message);
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
      {msg && (
        <Modal visible={true} animationType="slide">
          <View style={styles.modalContainer}>
            <Text style={styles.modalText}>{msg}</Text>
            <Pressable onPress={() => setMsg(null)} style={styles.modalButton}>
              <Text style={styles.modalButtonText}>OK</Text>
            </Pressable>
          </View>
        </Modal>
      )}

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
  accountsListView: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    flexDirection: "row",
    justifyContent: "space-between",
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

export default ManageList;

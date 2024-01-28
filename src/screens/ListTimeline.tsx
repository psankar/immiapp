import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { NavigationProp } from "@react-navigation/native";
import React, { useContext, useEffect, useState } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import BASE_URL from "../config";
import { AuthContext, AuthContextType, saxios } from "../context/AuthContext";
import t from "../localization/i18n";
import { formatDate } from "../utils/utils";

// TODO: Use more precise types below
type Props = {
  route: any;
  navigation: NavigationProp<Record<string, object>>;
};

const ListTimeline = ({ route, navigation }: Props) => {
  const { handle, displayName } = route.params;
  const { refreshAuthToken } = useContext<AuthContextType>(AuthContext);
  var [immiIDs, setImmiIDs] = useState<string[]>([]);

  // TODO: Use ImmiInfo type from documented API schema instead of "any" below
  // TODO: The immiInfoCache should be persisted and size limited
  var [immiInfoCache, setImmiInfoCache] = useState<Record<string, any>>({});

  useEffect(() => {
    let isMounted = true;
    navigation.setOptions({ title: displayName || t("list_timeline") });
    const fetchData = async () => {
      try {
        let response: Response;
        while (true) {
          response = await fetch(`${BASE_URL}/read-list`, {
            method: "POST",
            headers: {
              Authorization: `Bearer ${localStorage.getItem("authToken")}`,
              "Content-Type": "text/event-stream",
            },
            body: JSON.stringify({ list_handle: handle }),
          });

          if (response.status === 452) {
            refreshAuthToken();
            continue;
          }
          break;
        }

        if (!response.body) {
          throw new Error("No response body");
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder("utf-8");

        while (isMounted) {
          const { done, value } = await reader.read();
          if (done) break;
          const text = decoder.decode(value, { stream: true });
          const newData = JSON.parse(text);
          if (newData && newData.length > 0) {
            const l = [...newData, ...immiIDs];
            immiIDs = l;
          }
          console.log(immiIDs, newData);
          setImmiIDs(immiIDs);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, []);

  const fetchImmiInfo = async (immiID: string) => {
    try {
      const response = await saxios.get(`/immi/${immiID}`);
      const immiInfo: any = response.data;
      setImmiInfoCache((prevCache) => ({
        ...prevCache,
        [immiID]: immiInfo,
      }));
    } catch (error) {
      // TODO: Handle errors better here and for
      // all cases (invalid immiID, deleted immiID, etc.)
      console.error("Error fetching immiInfo:", error);
    }
  };

  const renderImmiID = ({ item }: { item: string }) => {
    const immiInfo = immiInfoCache[item];
    if (!immiInfo) {
      fetchImmiInfo(item);
      return null;
    }

    var date = new Date(immiInfo.time);

    return (
      <View style={styles.immiContainer}>
        <Text style={styles.immiBody}>{"@" + immiInfo.account_handle}</Text>
        <Text style={styles.immiBody}>{immiInfo.body}</Text>
        <Text style={styles.immiTime}>{formatDate(date)}</Text>
        <MaterialCommunityIcons
          name="reply"
          size={18}
          color="black"
          onPress={() => {
            navigation.navigate(t("compose"), {
              inReplyTo: immiInfo.immi_id,
              inReplyToBody: immiInfo.body,
              inReplyToAccount: immiInfo.account_handle,
            });
          }}
        />
      </View>
    );
  };

  return (
    <View>
      <FlatList
        data={immiIDs}
        renderItem={renderImmiID}
        keyExtractor={(item) => item}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  immiContainer: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  immiBody: {
    fontSize: 16,
    marginBottom: 5,
  },
  immiTime: {
    fontSize: 12,
    color: "#666",
  },
});

export default ListTimeline;

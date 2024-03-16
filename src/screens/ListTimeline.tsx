import { MaterialCommunityIcons, Ionicons } from "@expo/vector-icons";
import { NavigationProp } from "@react-navigation/native";
import React, { useContext, useEffect, useState } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import BASE_URL from "../config";
import { formatDate } from "../constants/global-constants";
import { AuthContext, AuthContextType, saxios } from "../context/AuthContext";
import t from "../localization/i18n";

// TODO: Use more precise types below
type ListTimelineProps = {
  route: any;
  navigation: NavigationProp<Record<string, object>>;
};

const ListTimeline = ({ route, navigation }: ListTimelineProps) => {
  const { listId, displayName } = route.params;
  const { refreshAuthToken } = useContext<AuthContextType>(AuthContext);
  var [immiInfos, setImmiInfos] = useState<any[]>([]);

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
            body: JSON.stringify({ list_id: listId }),
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
            const l = [...newData, ...immiInfos];
            immiInfos = l;
          }
          console.debug(immiInfos, newData);
          setImmiInfos(immiInfos);
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

  const renderImmi = (items: any) => {
    var immiInfo = items.item;
    var date = new Date(immiInfo.time);

    return (
      <View style={styles.immiContainer}>
        {immiInfo.repeater_handle ? (
          <Text style={styles.immiBody}>
            t("repeated_by") immiInfo.repeater_handle
          </Text>
        ) : null}
        <Text style={styles.immiBody}>{"@" + immiInfo.account_handle}</Text>
        <Text style={styles.immiBody}>{immiInfo.body}</Text>
        <Text style={styles.immiTime}>{formatDate(date)}</Text>
        <MaterialCommunityIcons
          name="reply"
          size={22}
          color="black"
          onPress={() => {
            navigation.navigate(t("compose"), {
              inReplyTo: immiInfo.immi_id,
              inReplyToBody: immiInfo.body,
              inReplyToAccount: immiInfo.account_handle,
            });
          }}
        />
        <Ionicons
          name="repeat"
          size={22}
          color={immiInfo.is_repeated_by_me ? "blue" : "black"}
          onPress={() => {
            // TODO: Show some visual feedback
            saxios.post("/repeat-immi/" + immiInfo.immi_id);
          }}
        />
      </View>
    );
  };

  console.log("immiInfos", immiInfos);
  return (
    <View>
      <FlatList
        data={immiInfos}
        renderItem={renderImmi}
        keyExtractor={(item) => item.item}
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

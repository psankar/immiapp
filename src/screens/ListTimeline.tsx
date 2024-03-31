import { MaterialCommunityIcons, Ionicons } from "@expo/vector-icons";
import { NavigationProp } from "@react-navigation/native";
import React, { useContext, useEffect, useState } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import BASE_URL from "../config";
import { formatDate } from "../constants/global-constants";
import { AuthContext, AuthContextType, saxios } from "../context/AuthContext";
import t from "../localization/i18n";
import css from "../css/css";

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

  const renderImmiReactions = (immiInfo: any) => {
    return (
      <>
        <Ionicons
          name="add"
          size={18}
          onPress={() => {
            console.log("add reactions");
          }}
        />
        <Text>{immiInfo.like_count > 0 ? immiInfo.like_count : ""}</Text>
      </>
    );
  };

  const renderImmiReply = (immiInfo: any) => {
    return (
      <>
        <MaterialCommunityIcons
          name="reply-outline"
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
        <Text>{immiInfo.reply_count > 0 ? immiInfo.reply_count : ""}</Text>
      </>
    );
  };

  const renderImmiRepeat = (immiInfo: any) => {
    if (immiInfo.is_repeated_by_me) {
      return (
        <>
          <Ionicons
            name="megaphone"
            size={18}
            color="blue"
            onPress={() => {
              saxios.post("/unrepeat-immi/" + immiInfo.immi_id).then(() => {
                immiInfo.is_repeated_by_me = false;
              });
            }}
          />
          <Text>
            {immiInfo.repeated_count > 0 ? immiInfo.repeated_count : ""}
          </Text>
        </>
      );
    } else {
      return (
        <>
          <Ionicons
            name="megaphone-outline"
            size={18}
            color={"black"}
            onPress={() => {
              saxios.post("/repeat-immi/" + immiInfo.immi_id).then(() => {
                immiInfo.is_repeated_by_me = true;
              });
            }}
          />
          <Text>
            {immiInfo.repeated_count > 0 ? immiInfo.repeated_count : ""}
          </Text>
        </>
      );
    }
  };

  const renderImmi = (items: any) => {
    var immiInfo = items.item;
    var date = new Date(immiInfo.time);

    return (
      <View style={styles.immiContainer}>
        {immiInfo.repeater_handle ? (
          <Text style={css.label}>
            {t("repeated_by") + " " + immiInfo.repeater_handle}
          </Text>
        ) : null}

        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <Text style={[css.label, { paddingBottom: 3 }]}>
            {"@" + immiInfo.account_handle}
          </Text>
          <Text style={styles.immiTime}>{formatDate(date)}</Text>
        </View>

        <Text style={styles.immiBody}>{immiInfo.body}</Text>

        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <View style={{ flexDirection: "row", alignItems: "flex-start" }}>
            {renderImmiReply(immiInfo)}
          </View>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            {renderImmiRepeat(immiInfo)}
          </View>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            {renderImmiReactions(immiInfo)}
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={css.viewport}>
      <View style={styles.container}>
        <FlatList
          data={immiInfos}
          renderItem={renderImmi}
          keyExtractor={(item) => item.item}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignSelf: "center",
    minWidth: "70%",
    padding: 20,
  },
  immiContainer: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  immiBody: {
    fontSize: 16,
    marginBottom: 5,
    paddingBottom: 10,
  },
  immiTime: {
    fontSize: 10,
    color: "#666",
  },
});

export default ListTimeline;

import { NavigationProp } from "@react-navigation/native";
import { useContext, useEffect, useState } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import BASE_URL from "../config";
import { AuthContext, AuthContextType, saxios } from "../context/AuthContext";
import t from "../localization/i18n";

// TODO: Use more precise types below
type Props = {
  route: any;
  navigation: NavigationProp<Record<string, object>>;
};

const ListTimeline = ({ route, navigation }: Props) => {
  const { handle, displayName } = route.params;
  var [immiIDs, setImmiIDs] = useState<string[]>([]);

  // TODO: Use ImmiInfo from the documented API schema instead of "any" below
  var [immiInfoCache, setImmiInfoCache] = useState<Record<string, any>>({});

  const { authToken } = useContext<AuthContextType>(AuthContext);

  useEffect(() => {
    let isMounted = true;
    navigation.setOptions({ title: displayName || t("list_timeline") });
    const fetchData = async () => {
      try {
        const response = await fetch(`${BASE_URL}/read-list`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${authToken}`,
            "Content-Type": "text/event-stream",
          },
          body: JSON.stringify({ list_handle: handle }),
        });

        if (!response.body) {
          // TODO: Handle 452 for refresh_token
          throw new Error("Go back to the home page and try again.");
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

    return (
      <View style={styles.immiContainer}>
        <Text style={styles.immiBody}>{immiInfo.body}</Text>
        <Text style={styles.immiTime}>{immiInfo.time}</Text>
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
    fontWeight: "bold",
    marginBottom: 5,
  },
  immiTime: {
    fontSize: 12,
    color: "#666",
  },
});

export default ListTimeline;

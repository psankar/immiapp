import { useContext, useEffect, useState } from "react";
import { AuthContext, AuthContextType, saxios } from "../context/AuthContext";
import BASE_URL from "../config";
import { View, FlatList, Text } from "react-native";

// TODO: Use more precise types below
type Props = {
  route: any;
  navigation: any;
};

const ListTimeline = ({ route }: Props) => {
  const { handle, displayName } = route.params;
  var [immiIDs, setImmiIDs] = useState<string[]>([]);
  var [immiInfoCache, setImmiInfoCache] = useState<Map<string, any>>(
    new Map<string, any>()
  );

  const { authToken } = useContext<AuthContextType>(AuthContext);

  useEffect(() => {
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
          // Handle 452 for refresh_token
          throw new Error("Go back to the home page and try again.");
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder("utf-8");

        while (true) {
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
  }, []);

  const fetchImmiInfo = async (immiID: string) => {
    console.log("fetching ImmiInfo for", immiID);
    try {
      const response = await saxios.get(`/immis/${immiID}`);
      const immiInfo: any = response.data;
      setImmiInfoCache((prevCache) => ({
        ...prevCache,
        [immiID]: immiInfo,
      }));
    } catch (error) {
      console.error("Error fetching immiInfo:", error);
    }
  };

  const renderImmiID = ({ item }: { item: string }) => {
    const immiInfo = immiInfoCache.get(item);
    if (!immiInfo) {
      console.log("Triggering fetchImmiInfo for", item);
      fetchImmiInfo(item);
      return null;
    }
    return (
      <View>
        <Text>{immiInfo.body}</Text>
        <Text>{immiInfo.time}</Text>
      </View>
    );
  };

  return (
    <View>
      <Text>{displayName}</Text>
      <FlatList
        data={immiIDs}
        renderItem={renderImmiID}
        keyExtractor={(item) => item}
      />
    </View>
  );
};

export default ListTimeline;

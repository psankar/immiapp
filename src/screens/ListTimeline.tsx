import { useContext, useEffect, useState } from "react";
import { AuthContext, AuthContextType, saxios } from "../context/AuthContext";
import BASE_URL from "../config";

// TODO: Use more precise types below
type Props = {
  route: any;
  navigation: any;
};

const ListTimeline = ({ route }: Props) => {
  const { handle, displayName } = route.params;
  var [immiIDs, setImmiIDs] = useState<string[]>([]);

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
          throw new Error("Response body is null");
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
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  return <div>{displayName}</div>;
};

export default ListTimeline;

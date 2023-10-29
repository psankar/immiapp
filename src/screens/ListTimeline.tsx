import { useEffect, useState } from "react";
import { saxios } from "../context/AuthContext";

// TODO: Use more precise types below
type Props = {
  route: any;
  navigation: any;
};

const ListTimeline = ({ route }: Props) => {
  const { handle, displayName } = route.params;
  useEffect(() => {
    const fetchData = async () => {
      console.log("listTimeline", displayName, handle);
      try {
        const response = await saxios.post("/read-list", {
          list_handle: handle,
        });
        response.data.on("data", (chunk: any) => {
          console.log(chunk.toString());
        });
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, []);

  return <div>{displayName}</div>;
};

export default ListTimeline;

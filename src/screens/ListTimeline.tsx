import { useEffect, useState } from "react";
import { saxios } from "../context/AuthContext";

const ListTimeline = () => {
  const [displayName, setDisplayName] = useState("");
  const [handle, setHandle] = useState("");

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

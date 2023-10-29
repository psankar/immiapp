import { useEffect } from "react";
import { saxios } from "../context/AuthContext";

interface ListTimelineProps {
  displayName: string;
  handle: string;
}

const ListTimeline: React.FC<ListTimelineProps> = ({ displayName, handle }) => {
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

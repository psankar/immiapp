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
      saxios
        .post(
          "/read-list",
          {
            list_handle: handle,
          },
          {
            onDownloadProgress: (progressEvent) => {
              const newChunk = progressEvent.event.target.response;
              if (newChunk) {
                console.log(newChunk);
                console.log(typeof newChunk);
              }
            },
          }
        )
        .catch((error) => {
          console.log(error);
        });
    };
    fetchData();
  }, []);

  return <div>{displayName}</div>;
};

export default ListTimeline;

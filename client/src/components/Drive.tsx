import React, { useEffect } from "react";
import { useGetIsAuthed } from "../hooks/auth";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { RETRIEVE_FILE_METADATA_LIST } from "../urls";
import { FileMetaDataReceivedSchema } from "../schema";
import { z } from "zod";
import FileCard from "./FileCard";

const Drive: React.FC = () => {
  const navigate = useNavigate();
  const authQuery = useGetIsAuthed();

  const myDriveQuery = useQuery({
    queryKey: ["drive", "list"],
    queryFn: async () => {
      return axios
        .get(RETRIEVE_FILE_METADATA_LIST, {
          headers: {
            Accept: "application/json",
          },
          withCredentials: true,
        })
        .then((res) => res.data)
        .then((data) => z.array(FileMetaDataReceivedSchema).parse(data));
    },
  });

  useEffect(() => {
    if (authQuery.status === "success" && !authQuery.data) {
      navigate("/login");
    }
  }, [authQuery.status]);

  useEffect(() => {
    if (myDriveQuery.status === "success") {
      console.log(myDriveQuery.data);
    } else if (myDriveQuery.status === "error") {
      console.error(myDriveQuery.error);
    }
  }, [myDriveQuery.status]);

  if (authQuery.status === "pending") {
    return <p>Loading...</p>;
  }

  return (
    <div className="flex flex-col items-center">
      <h1 className="font-mono text-3xl">My Drive</h1>
      <p>Browse and download your previously uploaded documents here.</p>
      <div className="flex flex-wrap justify-center mt-3">
        {myDriveQuery.isSuccess && myDriveQuery.data?.length === 0 && (
          <p className="xl text-gray-400">
            You have no Files, try uploading some!
          </p>
        )}
        {myDriveQuery.isSuccess && myDriveQuery.data.length > 0 && (
          <ul>
            {myDriveQuery.data.map((fm) => (
              <FileCard key={fm.fileID} data={fm} />
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Drive;

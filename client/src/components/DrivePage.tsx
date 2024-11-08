import React, { useEffect } from "react";
import { useGetIsAuthed } from "../hooks/auth";
import { useNavigate } from "react-router-dom";

const DrivePage: React.FC = () => {
  const navigate = useNavigate();
  const authQuery = useGetIsAuthed();

  useEffect(() => {
    if (authQuery.status === "success" && !authQuery.data) {
      navigate("/login");
    }
  }, [authQuery.status]);

  if (authQuery.status === "pending") {
    return <p>Loading...</p>;
  }

  return (
    <>
      <h1>My Drive</h1>
      <p>Browse and download your previously uploaded documents here.</p>
    </>
  );
};

export default DrivePage;

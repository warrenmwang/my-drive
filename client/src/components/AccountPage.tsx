import React, { useEffect } from "react";
import {
  useGetIsAuthed,
  useMutationDeleteAcc,
  useMutationLogout,
} from "../hooks/auth";
import { useNavigate } from "react-router-dom";

const AccountPage: React.FC = () => {
  const navigate = useNavigate();
  const logoutMutation = useMutationLogout();
  const deleteMutation = useMutationDeleteAcc();
  const authQuery = useGetIsAuthed();

  const handleLogout = () => {
    logoutMutation.mutate(undefined, {
      onSettled: () => navigate("/"),
    });
  };

  const handleDelete = () => {
    deleteMutation.mutate(undefined, {
      onSettled: () => navigate("/"),
    });
    navigate("/");
  };

  useEffect(() => {
    if (authQuery.status === "success" && !authQuery.data) {
      navigate("/login");
    }
  }, [authQuery.status]);

  if (authQuery.status === "pending") {
    return <p>Loading...</p>;
  }

  return (
    <div className="flex flex-col gap-3">
      <button onClick={handleLogout} className="button__gray ">
        Logout
      </button>
      <div></div>
      <button onClick={handleDelete} className="button__red">
        Delete
      </button>
    </div>
  );
};

export default AccountPage;

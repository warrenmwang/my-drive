import React, { useState } from "react";
import { useMutationDeleteAcc, useMutationLogout } from "../hooks/auth";

const AccountSection: React.FC = () => {
  const [show, setShow] = useState<boolean>(false);
  const logoutMutation = useMutationLogout();
  const deleteMutation = useMutationDeleteAcc();

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  const handleDelete = () => {
    if (
      confirm(
        "Are you sure you want to delete your account, this action is permanent?",
      )
    ) {
      deleteMutation.mutate();
    }
  };

  return (
    <>
      <button onClick={() => setShow(!show)} className="button__blue">
        {!show ? "Show Account Settings" : "Close Account Settings"}
      </button>
      {show && (
        <div className="flex gap-3 bg-slate-200 mb-3">
          <button onClick={handleLogout} className="button__gray ">
            Logout
          </button>
          <div></div>
          <button onClick={handleDelete} className="button__red">
            Delete
          </button>
        </div>
      )}
    </>
  );
};

export default AccountSection;

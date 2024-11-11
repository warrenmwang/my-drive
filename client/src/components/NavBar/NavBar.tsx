import React from "react";
import { NavLink } from "react-router-dom";
import { useGetIsAuthed } from "../../hooks/auth";

const NavBar: React.FC = function () {
  let isAuthed = false;
  const authed = useGetIsAuthed();
  if (authed.isSuccess) {
    isAuthed = authed.data;
  }

  return (
    <nav className="flex gap-3 bg-slate-200 p-2">
      <NavLink className="p-3 bg-slate-300 rounded-md" to="/">
        Home
      </NavLink>

      {!isAuthed && (
        <NavLink className="p-3 bg-slate-300 rounded-md" to="/login">
          Login
        </NavLink>
      )}

      {isAuthed && (
        <>
          <NavLink className="p-3 bg-slate-300 rounded-md" to="/account">
            Account
          </NavLink>
          <NavLink className="p-3 bg-slate-300 rounded-md" to="/form">
            Form
          </NavLink>
          <NavLink className="p-3 bg-slate-300 rounded-md" to="/drive">
            Drive
          </NavLink>
        </>
      )}
    </nav>
  );
};

export default NavBar;

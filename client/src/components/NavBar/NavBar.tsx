import React from "react";
import { NavLink } from "react-router-dom";

const NavBar: React.FC = function () {
  return (
    <nav className="flex gap-3 bg-slate-200 p-2">
      <NavLink className="p-3 bg-slate-300 rounded-md" to="/">
        Home
      </NavLink>
      <NavLink className="p-3 bg-slate-300 rounded-md" to="/login">
        Login
      </NavLink>
      <NavLink className="p-3 bg-slate-300 rounded-md" to="/form">
        Form
      </NavLink>
    </nav>
  );
};
export default NavBar;

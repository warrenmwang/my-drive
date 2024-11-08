import React from "react";
import { Route, Routes } from "react-router-dom";
import HomePage from "./HomePage/HomePage";
import LoginPage from "./LoginPage";
import AccountPage from "./AccountPage";
import WizardForm from "./WizardForm";
import DrivePage from "./DrivePage";

const RouteRenderer: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/account" element={<AccountPage />} />
      <Route path="/form" element={<WizardForm />} />
      <Route path="/drive" element={<DrivePage />} />
    </Routes>
  );
};

export default RouteRenderer;

// import * as React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import LoginPage from "./components/LoginPage";
import HomePage from "./components/HomePage/HomePage";
import WizardForm from "./components/WizardForm";
import NavBar from "./components/NavBar/NavBar";

function App() {
  return (
    <>
      <BrowserRouter>
        <NavBar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/form" element={<WizardForm />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
